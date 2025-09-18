import { QdrantVector } from '@mastra/qdrant'

export const qdrant = new QdrantVector({
  url: process.env.QDRANT_URL ?? 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY
})

await qdrant.createIndex({
  indexName: "myCollection",
  dimension: 1536,
});

// Store embeddings with rich metadata for better organization and filtering
await qdrant.upsert({
  indexName: "myCollection",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({
    // Basic content
    text: chunk.text,
    id: chunk.id,

    // Document organization
    source: chunk.source,
    category: chunk.category,

    // Temporal metadata
    createdAt: new Date().toISOString(),
    version: "1.0",

    // Custom fields
    language: chunk.language,
    author: chunk.author,
    confidenceScore: chunk.score,
  })),
});
