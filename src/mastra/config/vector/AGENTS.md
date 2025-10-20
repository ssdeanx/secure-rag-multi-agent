<!-- AGENTS-META {"title":"Vector Store Configurations","version":"1.2.0","last_updated":"2025-10-20T13:00:00Z","applies_to":"/src/mastra/config/vector","tags":["layer:backend","domain:vector","type:config","status":"stable"],"status":"stable"} -->

# Vector Store Configurations (`/src/mastra/config/vector`)

## Persona

**Name:** Vector Infrastructure Architect
**Role Objective:** Provide unified, production-ready vector storage abstractions with consistent APIs, embedding support, and query capabilities across multiple vector databases.

## Purpose

Enable flexible vector storage options for the Governed RAG system, supporting various deployment scenarios from local development to enterprise cloud deployments. Each configuration provides identical functionality levels with Mastra RAG tool integration.

## Key Files

| File | Vector Store | Deployment | Key Features | Status |
| ---- | ------------ | ---------- | ------------ | ------ |
| `astra.ts` | **DataStax AstraDB** | Cloud | Enterprise-grade vector search, JSON metadata, N1QL queries, multi-region replication | ✅ Production |
| `chroma.ts` | **ChromaDB** | Local/Cloud | Open-source vector database, metadata filtering, Python/JS clients, local persistence | ✅ Production |
| `cloudflare.ts` | **Cloudflare Vectorize** | Cloud | Serverless vector storage, global CDN, Workers integration, automatic scaling | 🟡 Basic |
| `couchbase.ts` | **Couchbase Server** | On-prem/Cloud | Full N1QL SQL queries, JSON documents, multi-model database, enterprise features | ✅ Production |
| `lance.ts` | **LanceDB** | Local | Columnar vector storage, fast similarity search, embedded deployment, Sift syntax | ✅ Production |
| `mongodb.ts` | **MongoDB Atlas** | Cloud | Document-based vectors, aggregation pipelines, Atlas Vector Search, enterprise MongoDB | ✅ Production |
| `opensearch.ts` | **OpenSearch** | On-prem/Cloud | Elasticsearch-compatible, full-text search, aggregations, Kibana integration | ✅ Production |
| `pinecone.ts` | **Pinecone** | Cloud | Managed vector database, pod-based scaling, metadata filtering, REST/gRPC APIs | 🟡 Basic |
| `qdrant.ts` | **Qdrant** | Local/Cloud | High-performance vectors, HNSW indexing, payload filtering, distributed deployment | 🟡 Basic |
| `s3vectors.ts` | **AWS S3 Vectors** | Cloud | Amazon S3 integration, MongoDB/Sift filters, serverless scaling, AWS ecosystem | ✅ Production |

## Architecture Overview

Each vector store configuration provides:

### Core Capabilities

- **Document Processing**: Text chunking with configurable overlap
- **Embedding Generation**: Google Gemini integration (128-3072 dimensions)
- **Vector Storage**: Batch upsert with rich metadata
- **Similarity Search**: Configurable top-K retrieval with scoring
- **Index Management**: Automatic index creation and validation

### Advanced Features

- **Mastra RAG Tools**: `createVectorQueryTool` and `createGraphRAGTool`
- **Metadata Filtering**: Type-safe filter interfaces (implementation varies by store)
- **Error Handling**: Structured logging and graceful degradation
- **Environment Config**: Comprehensive environment variable support

### Common Interface

```typescript
// All stores implement this consistent API
export async function processDocument(content: string): Promise<{ chunks: Chunk[], embeddings: number[][] }>
export async function storeDocumentEmbeddings(chunks: Chunk[], embeddings: number[][]): Promise<string[]>
export async function querySimilarDocuments(query: string, options?: QueryOptions): Promise<Result[]>
export async function initializeVectorIndex(): Promise<void>

// Mastra RAG tool exports
export const {storeName}QueryTool: VectorQueryTool
export const {storeName}GraphTool: GraphRAGTool
```

## Configuration Patterns

### Environment Variables

Each store supports provider-specific environment variables. All vector stores support `*_EMBEDDING_DIMENSION` for configuring the embedding vector size (default: 1536):

```bash
# AstraDB (Enterprise-grade managed vector database)
ASTRA_DB_TOKEN=your_token
ASTRA_DB_ENDPOINT=your_endpoint
ASTRA_DB_KEYSPACE=your_keyspace
ASTRA_EMBEDDING_DIMENSION=1536

# ChromaDB (Open-source vector database)
CHROMA_API_KEY=your_key          # For Chroma Cloud
CHROMA_TENANT=your_tenant
CHROMA_DATABASE=your_database
CHROMA_URL=http://localhost:8000  # For local instance
CHROMA_EMBEDDING_DIMENSION=1536

# Cloudflare Vectorize (Serverless vector storage)
CF_ACCOUNT_ID=your_account_id
CF_API_TOKEN=your_api_token
CF_EMBEDDING_DIMENSION=1536

# LanceDB (Local columnar vector database)
LANCE_DB_PATH=/tmp/lance_db
LANCE_TABLE_NAME=governed_rag
LANCE_EMBEDDING_DIMENSION=1536

# MongoDB Atlas (Document-based vector storage)
MONGODB_URI=mongodb://user:pass@host:27017
MONGODB_DATABASE=mastra_db
MONGODB_COLLECTION=governed_rag
MONGODB_EMBEDDING_DIMENSION=1536

# Pinecone (Managed vector database)
PINECONE_API_KEY=your_api_key
PINECONE_ENVIRONMENT=us-east1-gcp
PINECONE_PROJECT_ID=your_project_id
PINECONE_EMBEDDING_DIMENSION=1536

# OpenSearch (Elasticsearch-compatible vector search)
OPENSEARCH_URL=https://your-domain.es.amazonaws.com
OPENSEARCH_EMBEDDING_DIMENSION=1536

# Qdrant (High-performance vector database)
QDRANT_URL=https://your-cluster.cloud.qdrant.io:6333
QDRANT_API_KEY=your_api_key
QDRANT_EMBEDDING_DIMENSION=1536

# S3Vectors (AWS S3-based vector storage)
S3_VECTORS_BUCKET_NAME=governed-rag-vectors
AWS_REGION=us-east-1
S3_EMBEDDING_DIMENSION=1536

# Couchbase (Multi-model database with vectors)
COUCHBASE_CONNECTION_STRING=couchbases://your-cluster.cloud.couchbase.com
COUCHBASE_USERNAME=your_username
COUCHBASE_PASSWORD=your_password
COUCHBASE_BUCKET=governed_rag
COUCHBASE_SCOPE=_default
COUCHBASE_COLLECTION=vectors
COUCHBASE_EMBEDDING_DIMENSION=1536
```

### Initialization

All stores follow the same initialization pattern:

```typescript
import { initializeVectorIndex } from './config/vector/{store}.ts'

// Initialize on startup
await initializeVectorIndex()
```

### Usage in Agents/Tools

```typescript
import { astraQueryTool, astraGraphTool } from './config/vector/astra'

// Use in Mastra workflows
const workflow = createWorkflow({
  // ... workflow definition
  tools: [astraQueryTool, astraGraphTool]
})
```

## Selection Criteria

### For Development/Local

- **LanceDB**: Fast, embedded, no external dependencies
- **ChromaDB**: Local instance with web UI
- **Qdrant**: Local deployment with advanced features

### For Production/Cloud

- **AstraDB**: Enterprise-grade, multi-cloud, managed
- **MongoDB Atlas**: If already using MongoDB ecosystem
- **Pinecone**: Pure vector focus, global CDN
- **S3Vectors**: AWS ecosystem integration
- **OpenSearch**: Full-text search requirements

### For Enterprise On-Prem

- **Couchbase**: Multi-model database needs
- **OpenSearch**: Elasticsearch ecosystem
- **MongoDB**: Document database requirements

## Performance Characteristics

| Store | Indexing Speed | Query Speed | Storage Efficiency | Scalability |
| ----- | -------------- | ----------- | ------------------ | ----------- |
| AstraDB | Fast | Very Fast | High | Excellent |
| ChromaDB | Medium | Fast | Medium | Good |
| LanceDB | Very Fast | Very Fast | High | Limited |
| MongoDB | Medium | Fast | Medium | Excellent |
| OpenSearch | Slow | Medium | Low | Excellent |
| Pinecone | Fast | Very Fast | High | Excellent |
| S3Vectors | Medium | Fast | High | Excellent |
| Couchbase | Medium | Fast | Medium | Excellent |

## Migration Guide

### Switching Between Stores

1. **Update Environment Variables**: Set new store's environment variables
2. **Change Imports**: Update agent/workflow imports to use new store tools
3. **Re-index Documents**: Run indexing workflow with new store
4. **Update Frontend**: Modify vector store selection if applicable

### Data Migration

Most stores don't support direct data export/import. For migration:

1. Export documents from source system
2. Re-run document processing pipeline
3. Index into target vector store
4. Update application configuration

## Troubleshooting

### Common Issues

#### Connection Failures

- Verify environment variables are set correctly
- Check network connectivity and firewall rules
- Validate credentials and permissions

#### Indexing Errors

- Ensure embedding dimensions match index configuration
- Check available storage space
- Verify index name uniqueness

#### Query Performance

- Adjust top-K values for better performance
- Implement metadata filtering to reduce result sets
- Consider index optimization or scaling

#### Memory Issues

- Reduce batch sizes for document processing
- Implement streaming for large document sets
- Monitor embedding generation memory usage

## Change Log

| Version | Date (UTC) | Change |
| ------- | ---------- | ------ |
| 1.2.0   | 2025-10-20 | Added comprehensive environment variable documentation for all 10 vector stores with detailed configuration examples and comments |
| 1.1.0   | 2025-10-20 | Added comprehensive documentation for all 10 vector store configurations with selection criteria, performance characteristics, and troubleshooting guide |
| 1.0.0   | 2025-10-20 | Initial comprehensive vector store documentation |