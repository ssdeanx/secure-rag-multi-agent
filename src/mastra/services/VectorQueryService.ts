import { embedMany } from "ai";
import { google } from "@ai-sdk/google";
import { ValidationService } from "./ValidationService";
import { RoleService } from "./RoleService";
import { log } from "../config/logger";

export interface QueryInput {
  question: string;
  allowTags: string[];
  maxClassification: "public" | "internal" | "confidential";
  topK?: number;
  minSimilarity?: number;
}

export interface QueryResult {
  text: string;
  docId: string;
  versionId: string;
  source: string;
  score: number;
  securityTags: string[];
  classification: "public" | "internal" | "confidential";
}

export interface SecurityFilters {
  allowedClasses: string[];
  allowTags: string[];
}

export class VectorQueryService {
  static buildSecurityFilters(
    allowTags: string[],
    maxClassification: "public" | "internal" | "confidential"
  ): SecurityFilters {
    const allowedClasses: string[] = [];

    if (maxClassification === "public" || maxClassification === "internal" || maxClassification === "confidential") {
      allowedClasses.push("classification:public");
    }
    if (maxClassification === "internal" || maxClassification === "confidential") {
      allowedClasses.push("classification:internal");
    }
    if (maxClassification === "confidential") {
      allowedClasses.push("classification:confidential");
    }

    return {
      allowedClasses,
      allowTags
    };
  }

  static async generateQueryEmbedding(question: string): Promise<number[]> {
    const embeddingModel: string = process.env.EMBEDDING_MODEL ?? "gemini-embedding-001";
    const { embeddings } = await embedMany({
      model: google.textEmbedding(embeddingModel),
      values: [question]
    });
    return embeddings[0] as number[];
  }

  static async searchWithFilters(
    embedding: number[],
    filters: SecurityFilters,
    vectorStore: unknown,
    indexName: string,
    topK: number,
    minSimilarity = 0.4
  ): Promise<QueryResult[]> {
    log.info('🔍 Applying query filters', { filters });
    log.info('🔍 Classification filters', { allowedClasses: filters.allowedClasses });
    log.info('🔍 Role filters', { allowTags: filters.allowTags });

    // Separate role tags from tenant tags for proper filtering
    const userRoleTags = filters.allowTags.filter(tag => tag.startsWith('role:'));
    const userTenantTags = filters.allowTags.filter(tag => tag.startsWith('tenant:'));

    // Extract role names from role tags (remove 'role:' prefix)
    const userRoles = userRoleTags.map(tag => tag.replace('role:', ''));

    log.info('🔍 HIERARCHICAL ACCESS CONTROL', {
      originalRoles: userRoles,
      roleAccessInfo: RoleService.formatRolesForLogging(userRoles),
      classificationAccess: filters.allowedClasses,
      tenantAccess: userTenantTags
    });

    // Build proper Qdrant filter with correct security logic
    const qdrantFilter: { must: Array<{ key: string; match: { any: string[] } }> } = {
      must: [
        // MUST match allowed classification level
        {
          key: "securityTags",
          match: {
            any: filters.allowedClasses
          }
        }
      ]
    };

    // HIERARCHICAL ROLE-BASED ACCESS CONTROL
    // Use role hierarchy to expand user's effective roles
    if (userRoles.length > 0) {
      const accessInfo = RoleService.generateAccessTags(userRoles);
      const effectiveRoleTags = accessInfo.expandedRoles.map(role => `role:${role}`);

      log.info('🔍 EXPANDED ROLE ACCESS', {
        originalRoles: userRoles,
        effectiveRoles: accessInfo.expandedRoles,
        queryTags: effectiveRoleTags
      });

      // Documents must have at least ONE role that the user can access (including inherited roles)
      qdrantFilter.must.push({
        key: "securityTags",
        match: {
          any: effectiveRoleTags
        }
      });
    } else {
      // If user has no roles, they can only access documents marked as public
      log.info('🔍 User has no roles - restricting to public-only access');
      qdrantFilter.must.push({
        key: "securityTags",
        match: {
          any: ["role:public"]
        }
      });
    }

    // Add tenant filtering as additional requirement
    if (userTenantTags.length > 0) {
      qdrantFilter.must.push({
        key: "securityTags",
        match: {
          any: userTenantTags
        }
      });
    }

    log.info('🔍 Query configuration', {
      qdrantFilter,
      minSimilarity
    });

    const results = await (vectorStore as any).query({
      indexName,
      queryVector: embedding,
      topK,
      filter: qdrantFilter,
      includeVector: false
    });

    log.info(`🔍 Query returned ${results?.length ?? 0} results before similarity filtering`);

    if (!results || results.length === 0) {
      log.info('🔍 Access Control Summary - No accessible documents found (properly restricted)', {
        userRoles: userRoleTags,
        userTenant: userTenantTags,
        maxClassification: filters.allowedClasses
      });
      return [];
    }

    // Apply similarity threshold filtering
    const similarityFilteredResults = results.filter((r: any) => {
      const score = r.score ?? 0;
      log.debug(`🔍 Document ${r.metadata?.docId}: score=${score.toFixed(3)}, threshold=${minSimilarity}, ${score >= minSimilarity ? 'KEEP' : 'FILTER_OUT'}`);
      return score >= minSimilarity;
    });

    log.info(`🔍 After similarity filtering (>=${minSimilarity}): ${similarityFilteredResults.length}/${results.length} documents kept`);

    if (similarityFilteredResults.length === 0) {
      log.info('🔍 Relevance Control Summary - No relevant documents found', {
        securityPassed: results.length,
        similarityThreshold: minSimilarity,
        highestScore: Math.max(...results.map((r: any) => r.score ?? 0)).toFixed(3)
      });
      return [];
    }

    // Get user's expanded roles for validation
    const accessInfo = userRoles.length > 0 ? RoleService.generateAccessTags(userRoles) : { expandedRoles: [] };

    // Log successful access control summary
    log.info('🔍 ACCESS CONTROL VALIDATION (with hierarchy)', {
      documentsRetrieved: similarityFilteredResults.length,
      userEffectiveRoles: accessInfo.expandedRoles,
      userTenant: userTenantTags
    });

    return similarityFilteredResults.map((r: any, index: number) => {
      let securityTags: string[] = [];

      if (Array.isArray(r.metadata?.securityTags)) {
        securityTags = r.metadata.securityTags;
      } else if (typeof r.metadata?.securityTags === 'string') {
        securityTags = r.metadata.securityTags.split(',').map((tag: string) => tag.trim());
      }

      // Extract document roles and validate user access using hierarchy
      const docRoles = securityTags.filter(tag => tag.startsWith('role:')).map(tag => tag.replace('role:', ''));
      const docClassification = securityTags.find(tag => tag.startsWith('classification:'));
      const hasValidRoleAccess = RoleService.canAccessDocument(userRoles, securityTags.filter(tag => tag.startsWith('role:')));

      log.debug(`🔍 HIERARCHICAL ACCESS CHECK - Doc ${index + 1} (${r.metadata?.docId})`, {
        documentRoles: docRoles,
        classification: docClassification,
        userAccess: hasValidRoleAccess ? 'GRANTED' : 'DENIED',
        score: r.score
      });

      // Enhanced security validation using role hierarchy
      if (!hasValidRoleAccess && docRoles.length > 0) {
        log.warn(`⚠️ SECURITY WARNING: Document ${r.metadata?.docId} was retrieved but user lacks access!`, {
          documentRequiredRoles: docRoles,
          userEffectiveRoles: accessInfo.expandedRoles
        });

        // Additional debugging - show what roles could access this document
        const accessibleRoles = RoleService.getDocumentAccessibleRoles(docRoles);
        log.warn(`Roles that CAN access this doc: [${accessibleRoles.join(', ')}]`);
      }

      return {
        text: String(r.metadata?.text ?? ""),
        docId: String(r.metadata?.docId ?? "unknown"),
        versionId: r.metadata?.versionId ? String(r.metadata.versionId) : "unknown",
        source: r.metadata?.source ? String(r.metadata.source) : "unknown",
        score: r.score ?? 0,
        securityTags,
        classification: (r.metadata?.classification as "public" | "internal" | "confidential") || "public"
      };
    });
  }

  static async query(
    input: QueryInput,
    vectorStore: unknown,
    indexName: string
  ): Promise<QueryResult[]> {
    ValidationService.validateQuestion(input.question);
    ValidationService.validateAccessTags(input.allowTags);
    ValidationService.validateVectorStore(vectorStore);

    const filters: SecurityFilters = this.buildSecurityFilters(input.allowTags, input.maxClassification);
    const embedding = await this.generateQueryEmbedding(input.question);

    return await this.searchWithFilters(
      embedding,
      filters,
      vectorStore,
      indexName,
      input.topK ?? 8,
      input.minSimilarity ?? 0.4
    );
  }
}
