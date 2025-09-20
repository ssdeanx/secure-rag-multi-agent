import { QdrantVector } from '@mastra/qdrant'
import { embedMany } from "ai";
import { google } from "@ai-sdk/google";
import { log } from "./logger";

export const qVector = new QdrantVector({
  url: process.env.QDRANT_URL ?? 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY! ?? ''
})

await qVector.createIndex({
  indexName: 'governed_rag',
  dimension: 3072,
  metric: 'cosine',
});

// Basic index for common queries
//await store.createIndex({
//  name: 'idx_threads_resource',
//  table: 'mastra_threads',
//  columns: ['resourceId'],
//  method: 'btree', // '"gin" | "btree" | "hash" | "gist" | "spgist" | "brin" | undefined'
//  unique: true,
//  where: 'resourceId IS NOT NULL',
//  storage: { fillfactor: 90 },
//  concurrent: true,
//  opclass: 'resource_id_ops'
//});

// Composite index with sort order for filtering + sorting
//await store.createIndex({
//  name: 'idx_messages_composite',
//  table: 'mastra_messages',
//  columns: ['thread_id', 'createdAt DESC'],
//  unique: true,
//  method: 'gist',
//  where: 'thread_id IS NOT NULL',
//  storage: { fillfactor: 90 },
//  concurrent: true,
//  opclass: 'timestamp_ops'
//});

//await pgVector.createIndex({
//  indexName: "agentMemoryIndex",
//  dimension: 1536,
//  metric: 'cosine', // or 'euclidean', 'dotproduct'
//  buildIndex: true,
//});

// Store embeddings with rich metadata for better organization and filtering
await qVector.upsert({
  indexName: "governed_rag",
  vectors: embeddings,
  metadata: chunks.map((chunk, i) => ({
//    // Basic content
    text: chunk.text,
    id: chunk.id ?? `chunk-${i}`, // generate fallback id when chunk has no id

//    // Document organization
    source: chunk.metadata?.source,
    category: chunk.metadata?.category,

    // Temporal metadata
    createdAt: new Date().toISOString(),
    version: "1.0",

    // Custom fields
    language: chunk.metadata?.language,
    author: chunk.metadata?.author,
    confidenceScore: chunk.metadata?.score,
    sparseVector: chunk.metadata?.sparseVector,
  })),
  sparseVectors: chunks.map((chunk) => chunk.metadata?.sparseVector), // Optional sparse vectors
});

