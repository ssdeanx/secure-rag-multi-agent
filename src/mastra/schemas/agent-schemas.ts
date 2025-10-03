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
  learnings: z.array(learningExtractionOutputSchema).optional(),
  completedQueries: z.array(z.string()).optional(),
  phase: z.string().optional()
}).loose();

export const copywriterOutputSchema = z.object({
  content: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

// Specific schema for the product roadmap actions
export const roadmapActionSchema = z.object({
  type: z.literal("setState"),
  stateKey: z.literal("nodes"),
  setterKey: z.enum(["addNode", "removeNode", "changeNode"]),
  args: z.array(z.any()), // Args can be complex, leaving as any for now but could be tightened ## w
  content: z.string(),
});

export const productRoadmapOutputSchema = z.object({
  content: z.string(),
  object: roadmapActionSchema.optional(),
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

export const assistantOutputSchema = z.object({
  summary: z.string(),
  data: z.string(),
  sources: z.array(z.object({
    url: z.string(),
    title: z.string(),
  }))
});

/**
 * Content Generation Workflow Schemas
 */

// Cedar integration schemas
export const cedarContextSchema = z.object({
  selectedFeatures: z.array(z.string()).optional(),
  userPreferences: z.record(z.string(), z.any()).optional(),
  sessionState: z.any().optional()
}).optional();

export const cedarActionSchema = z.object({
  type: z.literal("setState"),
  stateKey: z.string(),
  setterKey: z.string(),
  args: z.array(z.any())
}).optional();

// Content generation input
export const contentGenerationInputSchema = z.object({
  contentType: z.enum(['blog', 'marketing', 'technical', 'business']),
  topic: z.string().min(1, "Topic is required"),
  requirements: z.string().min(1, "Requirements are required"),
  tone: z.enum(['professional', 'casual', 'technical', 'persuasive']).optional(),
  targetAudience: z.string().optional(),
  cedarContext: cedarContextSchema,
  minQualityScore: z.number().min(0).max(1).default(0.7)
});

// Validated request (after input validation)
export const validatedRequestSchema = z.object({
  contentType: z.string(),
  topic: z.string(),
  requirements: z.string(),
  tone: z.string(),
  targetAudience: z.string().optional(),
  cedarContext: cedarContextSchema,
  minQualityScore: z.number()
});

// Draft content (from copywriter)
export const draftContentSchema = z.object({
  content: z.string(),
  contentType: z.string(),
  wordCount: z.number(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

// Refined content (from editor) - extends editorOutputSchema
export const refinedContentSchema = z.object({
  editedContent: z.string(),
  contentType: z.string(),
  summaryOfChanges: z.string(),
  improvementSuggestions: z.string(),
  wordCount: z.number()
});

// Evaluation result (from evaluation agent)
export const evaluationResultSchema = z.object({
  isRelevant: z.boolean(),
  reason: z.string(),
  qualityScore: z.number().min(0).max(1),
  metrics: z.object({
    contentSimilarity: z.number().optional(),
    completeness: z.number().optional(),
    toneConsistency: z.number().optional(),
    keywordCoverage: z.number().optional()
  }).optional()
});

// Final content output
export const finalContentSchema = z.object({
  finalContent: z.string(),
  contentType: z.string(),
  qualityScore: z.number(),
  iterationsPerformed: z.number(),
  summaryOfChanges: z.string(),
  improvementSuggestions: z.string(),
  wordCount: z.number(),
  cedarAction: cedarActionSchema
});

/**
 * Export a mapping if needed programmatically
 * NOTE: All keys are camelCase to match actual agent/workflow exports
 */
export const agentOutputSchemas = {
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
  selfReferencing: selfReferencingOutputSchema,
  // Content generation workflow schemas
  contentGenerationInput: contentGenerationInputSchema,
  validatedRequest: validatedRequestSchema,
  draftContent: draftContentSchema,
  refinedContent: refinedContentSchema,
  evaluationResult: evaluationResultSchema,
  finalContent: finalContentSchema
};
