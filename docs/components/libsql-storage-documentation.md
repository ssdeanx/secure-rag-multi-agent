---
title: LibSQLStorage - Technical Documentation
component_path: `src/mastra/config/libsql-storage.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra Storage / Backend
tags: [storage, libsql, vector, mastra, configuration]
---

# LibSQLStorage Documentation

Configuration module for LibSQL-based storage and vector operations in Mastra, including store creation, index initialization, search, upsert/query functions, memory configs, and health checks. Supports tracing and error handling.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Setup and manage LibSQL for Mastra metadata/vector storage with Gemini embeddings.

- OVR-002: Scope: Factories (createLibSQLStore/VectorStore), utils (search, upsert, query), memory (research/report), health/init. Excludes direct DB ops.

- OVR-003: Context: Used in Mastra bootstrap for persistent agent memory and RAG vector search.

## 2. Architecture Section

- ARC-001: Design patterns: Factory with tracing; adapter for vector ops.

- ARC-002: Dependencies:
    - @mastra/libsql (LibSQLStore, LibSQLVector)

    - @mastra/core (Memory, tracing types)

    - ai-sdk/google (embedder)

    - node:fs/path (logs/dir)

    - Local: logger, utils

- ARC-003: Interactions: Creates stores; embeds/queries vectors; subscribes memory.

- ARC-004: Tracing: Spans for init/search/upsert with input/output/metadata.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Configuration"
        LS[LibSQLStorage] --> CLS[createLibSQLStore]
        LS --> CLVS[createLibSQLVectorStore]
        LS --> IVI[initializeVectorIndexes]
    end

    subgraph "Operations"
        LS --> SSC[searchSimilarContent]
        LS --> UV[upsertVectors]
        LS --> QV[queryVectors]
        LS --> SMM[searchMemoryMessages]
    end

    subgraph "Memory"
        LS --> CRM[createResearchMemory]
        LS --> CRM2[createReportMemory]
    end

    subgraph "Utils/Health"
        LS --> PSHC[performStorageHealthCheck]
        LS --> ISS[initializeStorageSystem]
        LS --> ECM[extractChunkMetadata]
    end

    subgraph "External"
        M[Mastra] --> LS
        G[Google AI] --> LS
        L[LibSQL] --> CLS
    end

    classDiagram
        class LibSQLStore {
            +url: string
            +authToken?: string
        }
        class VectorOps {
            +search(query, index): QueryResult[]
            +upsert(index, vectors, metadata): void
        }

        LibSQLStorage --> LibSQLStore
        LibSQLStorage --> VectorOps
```

## 3. Interface Documentation

- INT-001: Exported functions/configs.

| Function                  | Purpose               | Parameters                          | Return Type         | Notes           |
| ------------------------- | --------------------- | ----------------------------------- | ------------------- | --------------- |
| `createLibSQLStore`       | Create metadata store | `tracingContext?`                   | `LibSQLStore`       | Env URL/auth    |
| `createLibSQLVectorStore` | Create vector store   | `tracingContext?`                   | `LibSQLVector`      | Separate DB     |
| `searchSimilarContent`    | Embed + query         | `query, index, topK`                | `QueryResult[]`     | With tracing    |
| `upsertVectors`           | Insert vectors        | `index, vectors, metadata, ids`     | `{success, count?}` | Mutable arrays  |
| `queryVectors`            | Similarity search     | `index, queryVector, topK, filter?` | `QueryResult[]`     | Optional vector |

### Memory Configs

- createResearchMemory(): Memory for agents (lastMessages=500, semanticRecall topK=5)

INT notes:

- INT-003: Tracing optional; errors throw VectorStoreError.

## 4. Implementation Details

- IMP-001: Stores: New LibSQLStore/Vector with env URLs; tracing spans for init.

- IMP-002: Ops: Embed with Gemini; query/upsert with mutable copies; error class.

- IMP-003: Memory: Options for recall/working; processors empty.

- IMP-004: Health: Checks connectivity/indexes; init creates indexes.

Edge cases and considerations:

- No auth: Optional token.

- Empty vectors: Noop.

- Tracing absent: Logs only.

## 5. Usage Examples

### Store Creation

```ts
const store = createLibSQLStore(tracing)
const vector = createLibSQLVectorStore(tracing)
```

### Vector Search

```ts
const results = await searchSimilarContent('query', 'index', 5, tracing)
```

### Memory Setup

```ts
const memory = createResearchMemory()
```

Best practices:

- Pass tracing for observability.

- Use separate DBs for metadata/vector.

## 6. Quality Attributes

- QUA-001 Security: Env secrets; mask in logs.

- QUA-002 Performance: Async ops; batch embeds.

- QUA-003 Reliability: Try-catch; fallbacks.

- QUA-004 Maintainability: Factories centralize config.

- QUA-005 Extensibility: Add indexes/processors.

## 7. Reference Information

- REF-001: Dependencies: @mastra/libsql, ai-sdk/google, zod

- REF-002: Env: DATABASE_URL, VECTOR_DATABASE_URL

- REF-003: Testing: Mock stores; assert spans.

- REF-004: Troubleshooting: Connection fail — check env/DB.

- REF-005: Related: Mastra index.ts (bootstrap)

- REF-006: Change history: 1.0 (2025-09-23)
