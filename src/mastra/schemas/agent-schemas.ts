import { z } from "zod";

export const jwtClaimsSchema = z.object({
  sub: z.string(),
  roles: z.array(z.string()),
  tenant: z.string().optional(),
  stepUp: z.boolean().optional(),
  exp: z.number().optional(),
  iat: z.number().optional(),
  iss: z.string().optional(),
});

export const accessFilterSchema = z.object({
  allowTags: z.array(z.string()),
  maxClassification: z.enum(["public", "internal", "confidential"]),
});

export const documentContextSchema = z.object({
  text: z.string(),
  docId: z.string(),
  versionId: z.string(),
  source: z.string(),
  score: z.number(),
  securityTags: z.array(z.string()),
  classification: z.enum(["public", "internal", "confidential"]),
});

export const ragAnswerSchema = z.object({
  answer: z.string(),
  citations: z.array(z.object({
    docId: z.string(),
    source: z.string(),
  })),
});

export const verificationResultSchema = z.object({
  ok: z.boolean(),
  reason: z.string(),
  answer: z.union([
    z.string(),
    z.object({
      text: z.string(),
      citations: z.array(z.object({
        docId: z.string(),
        source: z.string(),
      }))
    })
  ]),
});

/**
 * Centralized output schemas for all agents
 * (Some were previously defined ad-hoc in agent files)
 */
export const answererOutputSchema = ragAnswerSchema;

export const retrieveOutputSchema = z.object({
  contexts: z.array(documentContextSchema)
});

export const rerankOutputSchema = z.object({
  contexts: z.array(documentContextSchema)
});

export const verifierOutputSchema = verificationResultSchema;

export const identityOutputSchema = jwtClaimsSchema.extend({
  error: z.string().optional()
});

export const policyOutputSchema = accessFilterSchema.extend({
  maxClassification: z.enum(["public", "internal", "confidential"])
});

export const editorOutputSchema = z.object({
  editedContent: z.string(),
  contentType: z.string(),
  summaryOfChanges: z.string(),
  improvementSuggestions: z.string()
});

export const evaluationOutputSchema = z.object({
  isRelevant: z.boolean(),
  reason: z.string()
});

export const learningExtractionOutputSchema = z.object({
  learning: z.string(),
  followUpQuestion: z.string()
});

export const researchOutputSchema = z.object({
  queries: z.array(z.string()),
  searchResults: z.array(z.object({
    title: z.string().optional(),
    url: z.string().optional(),
    relevance: z.string().optional(),
  })).optional(),
  learnings: z.array(z.any()).optional(),
  completedQueries: z.array(z.string()).optional(),
  phase: z.string().optional()
}).passthrough();

export const copywriterOutputSchema = z.object({
  content: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export const productRoadmapOutputSchema = z.object({
  content: z.string(),
  object: z.any().optional()
});

export const reportOutputSchema = z.object({
  report: z.string()
});

export const starterOutputSchema = z.object({
  content: z.string()
});

export const selfReferencingOutputSchema = z.object({
  content: z.string().optional()
});

/**
 * Export a mapping if needed programmatically
 */
export const AgentOutputSchemas = {
  answerer: answererOutputSchema,
  retrieve: retrieveOutputSchema,
  rerank: rerankOutputSchema,
  verifier: verifierOutputSchema,
  identity: identityOutputSchema,
  policy: policyOutputSchema,
  editor: editorOutputSchema,
  evaluation: evaluationOutputSchema,
  learning: learningExtractionOutputSchema,
  research: researchOutputSchema,
  copywriter: copywriterOutputSchema,
  productRoadmap: productRoadmapOutputSchema,
  report: reportOutputSchema,
  starter: starterOutputSchema,
  selfReferencing: selfReferencingOutputSchema
};
