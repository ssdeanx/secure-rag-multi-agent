import { Memory } from "@mastra/memory";
import { PgVector, PostgresStore } from '@mastra/pg';
import { google } from "@ai-sdk/google";
import { createVectorQueryTool, MDocument, createGraphRAGTool } from "@mastra/rag";
import { embedMany } from "ai";
import { log } from "./logger";
import type { AITracingEvent } from '@mastra/core/ai-tracing';
import { AISpanType } from '@mastra/core/ai-tracing';
import { qdrant } from "./vector-store";
;

log.info("PG Storage config loaded");


export const store = new PostgresStore({
    connectionString: process.env.SUPABASE ?? "postgresql://user:password@localhost:5432/mydb",
    schemaName: 'public',
    max: 20, // use up to 20 connections
    idleTimeoutMillis: 30000, // close idle clients after 30 seconds
});

//export const pgVector = new PgVector({ connectionString: process.env.SUPABASE ?? "postgresql://user:password@localhost:5432/mydb", schemaName: 'mastra' });


export const agentMemory = new Memory({
  storage: store,
  vector: qdrant,
  embedder:  google.textEmbedding("gemini-embedding-001"),
  options: {
    lastMessages: 500,
    semanticRecall: {
      topK: 3,
      messageRange: {
        before: 3,
        after: 2
      },
      scope: 'resource'
    },
    workingMemory: {
        enabled: true,
        template: `
        # Todo List
          ## Active Items
            - Task 1: Example task
                - Due:
                - Description:
                - Status: Not Started
                - Estimated Time:
                - Priority:
            - Task 2: Another task
                - Due:
                - Description:
                - Status: Not Started
                - Estimated Time:
                - Priority:


          ## Completed Items
            - None yet

        `
      },
      threads: {
        generateTitle: true
      },
    }
  },
);

// Graph-based RAG tool for complex relational queries
export const graphQueryTool = createGraphRAGTool({
  vectorStoreName: "pgVector",
  indexName: "agentMemoryIndex",
  model: google.textEmbedding("gemini-embedding-001"),
  graphOptions: {
    threshold: 0.7,
  },
  enableFilter: true,
});

// qdrant with performance tuning
export const qdrantQueryTool = createVectorQueryTool({
  vectorStoreName: "qdrant",
  indexName: "governed_rag",
  model: google.textEmbedding("gemini-embedding-001"),
  databaseConfig: {
    qdrant: {
      minScore: 0.7,    // Filter low-quality results
      ef: 200,          // HNSW search parameter
      probes: 10        // IVFFlat probe parameter
    }
  },
  enableFilter: true,
  description: "Search for semantically similar content in the pgVector store using embeddings. Supports filtering, ranking, and context retrieval."
});

// Provide a typed placeholder for chunks so subsequent code compiles.
// Replace or populate this with real content-loading logic as needed.
const chunks: Array<{ text: string; metadata?: any; id?: string }> = [];

// Create tracing event for embedding operation
const embeddingEvent: any = {
  type: AISpanType.LLM_CHUNK,
  timestamp: new Date().toISOString(),
  model: 'gemini-embedding-001',
  input: {
    chunkCount: chunks.length,
    totalTextLength: chunks.reduce((sum, chunk) => sum + (chunk.text?.length ?? 0), 0)
  },
  output: { status: 'processing' }
};

const { embeddings } = await embedMany({
  values: chunks.map(chunk => chunk.text),
  model: google.textEmbedding('gemini-embedding-001'),
  maxParallelCalls: 10,
  maxRetries: 3,
  abortSignal: new AbortController().signal,
  experimental_telemetry: {
    isEnabled: true,
    recordInputs: true,
    recordOutputs: true,
    functionId: 'embedMany',
    metadata: {
      type: 'chunking',
      source: 'pg-storage.ts',
      function: 'embedMany',
      model: 'gemini-embedding-001',
      usage: 'internal',
      purpose: 'embedding chunks for storage',
      timestamp: new Date().toISOString()},
    tracer: undefined
    }
});

// Update tracing event with completion
embeddingEvent.output = {
  embeddingCount: embeddings.length,
  embeddingDimension: embeddings[0]?.length || 0,
  status: 'completed'
};
log.info("Embeddings generated", { output: embeddingEvent.output, type: embeddingEvent.type, model: embeddingEvent.model, timestamp: embeddingEvent.timestamp, input: embeddingEvent.input, chunkCount: embeddingEvent.input.chunkCount });
//const store2 = new PostgresStore({ connectionString });
