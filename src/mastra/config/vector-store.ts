import { QdrantVector } from '@mastra/qdrant'

export const qdrant = new QdrantVector({
  url: process.env.QDRANT_URL ?? 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY
})

await qdrant.createIndex({
  indexName: "myCollection",
  dimension: 1536,
});

