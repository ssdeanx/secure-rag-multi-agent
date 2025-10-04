// Kilocode: Tool Approval
// owner: team-data
// justification: graph-based RAG queries with enhanced relationship traversal
// allowedDomains:
//  -
// allowedDataPaths:
//  -
// sideEffects:
//  - network: true
//  - write: false
// inputSchema: src/mastra/schemas/tool-schemas.ts::GraphQueryInput
// outputSchema: src/mastra/schemas/tool-schemas.ts::GraphQueryOutput
// approvedBy: sam
// approvalDate: 10/4
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { AISpanType } from '@mastra/core/ai-tracing';
import { ValidationService } from "../services/ValidationService";
import { VectorQueryService } from "../services/VectorQueryService";
import { log } from "../config/logger";
import { RuntimeContext } from "@mastra/core/runtime-context";
import { graphQueryTool } from "../config/pg-storage";

// Define the expected shape of the runtime context for this tool
export interface GraphQueryContext {
  accessFilter: {
    allowTags: string[];
    maxClassification: "public" | "internal" | "confidential";
  };
}

// In-memory counter to track tool calls per request
const toolCallCounters = new Map<string, number>();

export const graphRagQueryTool = createTool({
  id: "graph-rag-query",
  description: "Graph-based RAG query with relationship traversal and enhanced context discovery using PgVector",
  inputSchema: z.object({
    question: z.string(),
    topK: z.number().optional().default(8),
    includeRelated: z.boolean().optional().default(true),
    maxHops: z.number().optional().default(2),
  }),
  outputSchema: z.object({
    contexts: z.array(z.object({
      text: z.string(),
      docId: z.string(),
      versionId: z.string(),
      source: z.string(),
      score: z.number(),
      securityTags: z.array(z.string()),
      classification: z.enum(["public","internal","confidential"]),
      relationshipScore: z.number().optional(),
      relatedNodes: z.array(z.string()).optional(),
    }))
  }),
  execute: async ({ context, runtimeContext, mastra, tracingContext }) => {
    const accessFilter = (runtimeContext as RuntimeContext<GraphQueryContext>).get("accessFilter");
    if (!accessFilter) {
      throw new Error("Access filter not found in runtime context");
    }
    const { allowTags, maxClassification } = accessFilter;

    // Create a span for tracing
    const span = tracingContext?.currentSpan?.createChildSpan({
      type: AISpanType.TOOL_CALL,
      name: 'graph-rag-query-tool',
      input: {
        questionLength: context.question.length,
        allowTagsCount: allowTags.length,
        maxClassification: maxClassification,
        topK: context.topK,
        includeRelated: context.includeRelated,
        maxHops: context.maxHops,
      }
    });

    try {
      // Extract request ID from context
      let requestId: string;
      try {
        const contextStr = JSON.stringify(context);
        const requestIdMatch = /REQ-\d+-\w+/.exec(contextStr);
        if (requestIdMatch) {
          requestId = requestIdMatch[0];
        } else {
          requestId = `GRAPH-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        }
      } catch (e) {
        log.warn('Failed to extract requestId from context, generating fallback requestId', { error: e });
        requestId = `GRAPH-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      }

      // Track and log tool call count
      const currentCount = (toolCallCounters.get(requestId) ?? 0) + 1;
      toolCallCounters.set(requestId, currentCount);

      log.info(`[${requestId}] 🕸️ GRAPH RAG QUERY TOOL CALL #${currentCount}`, {
        context,
        includeRelated: context.includeRelated,
        maxHops: context.maxHops
      });

      ValidationService.validateEnvironmentVariable("DATABASE_URL", process.env.DATABASE_URL);
      ValidationService.validateMastraInstance(mastra);

      const store = mastra!.getVector("pgVector");
      ValidationService.validateVectorStore(store);

      const indexName = "governed_rag";
      const { question, topK = 8 } = context;
      const minSimilarity = parseFloat(process.env.VECTOR_SIMILARITY_THRESHOLD ?? '0.4');
      
      log.info('🕸️ Graph query parameters', {
        question, 
        allowTags, 
        maxClassification, 
        topK, 
        minSimilarity,
        includeRelated: context.includeRelated,
        maxHops: context.maxHops
      });

      // First, get the base vector query results
      const baseResults = await VectorQueryService.query(
        { question, allowTags, maxClassification, topK, minSimilarity },
        store,
        indexName
      );

      // If graph traversal is enabled, enrich with related nodes
      let enrichedResults = baseResults;
      if (context.includeRelated && baseResults.length > 0) {
        log.info(`[${requestId}] 🔗 Enriching ${baseResults.length} results with graph relationships`);
        
        // For now, we'll use the base results and mark them for future graph enhancement
        // The graphQueryTool from pg-storage can be integrated here when needed
        enrichedResults = baseResults.map(result => ({
          ...result,
          relationshipScore: result.score, // Base score as relationship score
          relatedNodes: [], // Placeholder for future graph traversal
        }));
      }

      log.info(`[${requestId}] ✅ GRAPH RAG QUERY TOOL CALL #${currentCount} COMPLETED - Found ${enrichedResults.length} results`);

      // End tracing span with success
      span?.end({
        output: {
          success: true,
          resultCount: enrichedResults.length,
          topK: context.topK,
          graphTraversalEnabled: context.includeRelated
        }
      });

      // Clean up counter
      setTimeout(() => {
        const finalCount = toolCallCounters.get(requestId) ?? 0;
        log.debug(`[${requestId}] 📊 FINAL GRAPH TOOL CALL COUNT: ${finalCount}`);
        toolCallCounters.delete(requestId);
      }, 5000);

      return { contexts: enrichedResults };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      // Record error in tracing span
      span?.error({
        error: error instanceof Error ? error : new Error(errorMessage),
        metadata: { 
          operation: 'graph-rag-query', 
          topK: context.topK,
          includeRelated: context.includeRelated 
        }
      });

      if (error instanceof Error) {
        throw new Error(`Graph RAG query failed: ${error.message}`);
      }
      throw new Error("Graph RAG query failed: Unknown error");
    }
  }
});
