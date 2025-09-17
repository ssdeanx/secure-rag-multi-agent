import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import { ValidationService } from "../services/ValidationService";
import { VectorQueryService } from "../services/VectorQueryService";
import { logger } from "../config/logger";

// In-memory counter to track tool calls per request
const toolCallCounters = new Map<string, number>();

export const vectorQueryTool = createTool({
  id: "vector-query",
  description: "Qdrant query with allowTags + classification filter",
  inputSchema: z.object({
    question: z.string(),
    allowTags: z.array(z.string()),
    maxClassification: z.enum(["public","internal","confidential"]),
    topK: z.number()
  }),
  outputSchema: z.object({
    contexts: z.array(z.object({
      text: z.string(),
      docId: z.string(),
      versionId: z.string(),
      source: z.string(),
      score: z.number(),
      securityTags: z.array(z.string()),
      classification: z.enum(["public","internal","confidential"])
    }))
  }),
  execute: async ({ context, mastra }) => {
    try {
      // Extract request ID from context (may come from agent input)
      let requestId = 'UNKNOWN';
      try {
        // Try to extract requestId if it was passed through the agent
        const contextStr = JSON.stringify(context);
        const requestIdMatch = contextStr.match(/REQ-\d+-\w+/);
        if (requestIdMatch) {
          requestId = requestIdMatch[0];
        }
      } catch (e) {
        // Fallback to generating our own request ID
        requestId = `TOOL-${Date.now()}`;
      }
      
      // Track and log tool call count
      const currentCount = (toolCallCounters.get(requestId) || 0) + 1;
      toolCallCounters.set(requestId, currentCount);
      
      logger.info(`[${requestId}] 🔧 VECTOR QUERY TOOL CALL #${currentCount}`, { context });
      
      ValidationService.validateEnvironmentVariable("QDRANT_URL", process.env.QDRANT_URL);
      ValidationService.validateMastraInstance(mastra);
      
      const store = mastra!.getVector("qdrant");
      ValidationService.validateVectorStore(store);
      
      const indexName: string = process.env.QDRANT_COLLECTION || "governed_rag";
      const { question, allowTags, maxClassification, topK = 8 } = context;
      // Use environment variable or default for similarity threshold
      const minSimilarity = parseFloat(process.env.VECTOR_SIMILARITY_THRESHOLD || '0.4');
      logger.info('🔧 Extracted parameters', { question, allowTags, maxClassification, topK, minSimilarity });
      
      const results = await VectorQueryService.query(
        { question, allowTags, maxClassification, topK, minSimilarity },
        store,
        indexName
      );

      logger.info(`[${requestId}] ✅ VECTOR QUERY TOOL CALL #${currentCount} COMPLETED - Found ${results.length} results`);
      
      // Clean up counter if this seems to be the final call (after a short delay to account for any immediate retries)
      setTimeout(() => {
        const finalCount = toolCallCounters.get(requestId) || 0;
        logger.info(`[${requestId}] 📊 FINAL TOOL CALL COUNT: ${finalCount}`);
        toolCallCounters.delete(requestId);
      }, 5000);

      return { contexts: results };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Vector query failed: ${error.message}`);
      }
      throw new Error("Vector query failed: Unknown error");
    }
  }
});