---
title: GovernedRagIndexWorkflow - Technical Documentation
component_path: `src/mastra/workflows/governed-rag-index.workflow.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra Indexing / Backend
tags: [workflow, mastra, indexing, rag, security]
---

# GovernedRagIndexWorkflow Documentation

Mastra workflow for indexing documents into Qdrant with security tags/classifications. Single step handles batch processing, index creation, and progress logging.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Load documents into vector store with metadata for secure RAG.

- OVR-002: Scope: One step (indexDocuments) using DocumentIndexingService; creates index if needed. Excludes doc parsing.

- OVR-003: Context: CLI/API for initial corpus loading (/api/index).

## 2. Architecture Section

- ARC-001: Design patterns: Batch processing workflow.

- ARC-002: Dependencies:

  - @mastra/core (createWorkflow, createStep)

  - zod (schemas)

  - Local: DocumentIndexingService, qdrantVector, logger

- ARC-003: Interactions: Input docs array → output stats (indexed/failed).

- ARC-004: Progress: Logs per doc; creates index (dim=3072).

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Workflow"
        GRI[GovernedRagIndex] --> IDS[indexDocumentsStep]
    end

    subgraph "Processing"
        IDS --> C[createIndex (Qdrant)]
        C --> DIS[DocumentIndexingService.indexDocument]
        DIS --> Loop[For each doc]
        Loop --> Out[Results: indexed/failed]
    end

    subgraph "Input/Output"
        In[Docs: path, docId, classification, roles, tenant] --> GRI
        GRI --> Stats[{indexed, failed, documents[]}]
    end

    subgraph "External"
        Q[Qdrant] --> C
        L[Logger] --> IDS
    end

    classDiagram
        class GovernedRagIndex {
            +inputSchema: ZodObject (docs array)
            +outputSchema: ZodObject (stats)
        }
        class IndexStep {
            +execute(input): IndexingResult[]
        }

        GovernedRagIndex --> IndexStep
```

## 3. Interface Documentation

- INT-001: Schemas for docs/stats.

| Input Doc | Fields | Notes |
|-----------|--------|-------|
| `filePath` | `string` | Source file |
| `docId` | `string` | Unique ID |
| `classification` | `enum` | public/internal/confidential |
| `allowedRoles` | `string[]` | Access roles |
| `tenant` | `string` | Org |
| `source` | `string?` | Optional |

Output: `{indexed: number, failed: number, documents: [{docId, status, chunks?, error?}]}`

INT notes:

- INT-003: Progress via logProgress.

## 4. Implementation Details

- IMP-001: Step: Creates index (collection=governed_rag, dim=3072); loops docs with service.indexDocument.

- IMP-002: Service call: Per doc, tracks status/chunks/error.

- IMP-003: Logging: Step start/end; progress per doc.

- IMP-004: Error: Throw on createIndex fail (but continues if exists).

Edge cases and considerations:

- Empty docs: {indexed:0, failed:0}

- Index exists: No-op.

## 5. Usage Examples

### Workflow Call

```ts
const result = await governedRagIndex.execute({
  documents: [{filePath: 'doc.md', docId: '1', classification: 'public', allowedRoles: ['public'], tenant: 'acme'}]
});
```

### CLI Integration

```bash
npm run cli index -- --docs corpus/*.md
```

Best practices:

- Batch small; validate inputs.

- Monitor failed for errors.

## 6. Quality Attributes

- QUA-001 Security: Tags roles/classification at index time.

- QUA-002 Performance: Batch upsert; progress logging.

- QUA-003 Reliability: Continues on per-doc fail.

- QUA-004 Maintainability: Single step; service abstracts.

- QUA-005 Extensibility: Add steps (e.g., validate).

## 7. Reference Information

- REF-001: Dependencies: @mastra/core, zod, local service/vector

- REF-002: Env: QDRANT_COLLECTION='governed_rag'

- REF-003: Testing: Mock service; assert stats.

- REF-004: Troubleshooting: Index fail — check Qdrant URL/dim.

- REF-005: Related: DocumentIndexingService

- REF-006: Change history: 1.0 (2025-09-23)
