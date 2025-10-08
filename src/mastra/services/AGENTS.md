<!-- AGENTS-META {"title":"Mastra Services","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/src/mastra/services","tags":["layer:backend","domain:rag","type:services","status":"stable"],"status":"stable"} -->

# Services Directory (`/src/mastra/services`)

## Persona

**Name:** Senior Backend Engineer  
**Role Objective:** Encapsulate stateless, reusable domain and infrastructure logic consumed by tools and workflow steps.  

## Purpose

Provide single-responsibility functional units (auth, role expansion, vector retrieval, document processing, embedding, storage, validation) enabling higher-level orchestration layers to remain thin and declarative.

## Key Files

| File                          | Responsibility                         | Notes                                 |
| ----------------------------- | -------------------------------------- | ------------------------------------- |
| `AuthenticationService.ts`    | JWT verification & policy seed         | Coordinate with jwt-auth.tool         |
| `RoleService.ts`              | Role expansion & hierarchy logic       | Aligns with `role-hierarchy.ts`       |
| `VectorQueryService.ts`       | Secure filtered vector search assembly | Applies classification & role filters |
| `DocumentProcessorService.ts` | High-level indexing orchestration      | Calls chunk, embed, store services    |
| `ChunkingService.ts`          | Strategy-based text segmentation       | Tune chunk sizes & overlap            |
| `EmbeddingService.ts`         | Embedding generation & batching        | Retry & backoff logic                 |
| `VectorStorageService.ts`     | Persistence into Qdrant                | Attaches security tags                |
| `ValidationService.ts`        | Common validation helpers              | Env & structural guards               |
| `WorkflowDecorators.ts`       | Step wrapper utilities                 | Logging, timing, error wrapping       |

## Change Log

| Version | Date (UTC) | Change                                   |
| ------- | ---------- | ---------------------------------------- |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata. |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |