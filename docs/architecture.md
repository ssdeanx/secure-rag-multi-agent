# Architecture

The Mastra Governed RAG is built around Mastra's multi-agent orchestration framework, integrating Next.js for the frontend/API, PostgreSQL with PgVector for vector storage, and OpenAI for embeddings/LLM. The core logic is in `src/mastra/`, with workflows coordinating agents, tools, and services for secure RAG.

## High-Level Components

- **Frontend (Next.js)**: UI for chat, auth, indexing panel. Routes: `/` (chat), `/api/chat`, `/api/index`.
- **Backend (Mastra)**: Agents and workflows in `src/mastra/`. Services handle data processing/security.
- **Storage**:
    - PostgreSQL with PgVector: Vector embeddings with security payloads (classification, roles, tags).
    - Supabase: Authentication and user management.
- **External**: OpenAI API (embeddings: text-embedding-3-small, LLM: gpt-4o-mini).
- **CLI**: `src/cli/index.ts` for indexing/querying/demo.

### Key Directories

- `src/mastra/agents/` (6 agents): Specialized LLMs for tasks.
- `src/mastra/workflows/` (2 workflows): Orchestrate steps.
- `src/mastra/tools/` (2 tools): Reusable functions (vector query, JWT auth).
- `src/mastra/services/` (10 services): Business logic (auth, embedding, indexing, etc.).
- `src/mastra/config/`: Role hierarchy, logger, OpenAI setup.
- `corpus/`: Sample docs for indexing.

## Workflows

Mastra workflows define sequential steps combining agents, tools, and services. Two main workflows:

### 1. Governed RAG Answer Workflow (`governed-rag-answer.workflow.ts`)

Handles secure queries: Auth → Retrieve → Rerank → Answer → Verify.

**Steps**:

1. **Authentication** (`authenticationStep`):
    - Input: `{jwt, question}`.
    - Uses `AuthenticationService` + `RoleService` to validate JWT, compute `accessFilter` (maxClassification, allowTags from role inheritance).
    - Output: `{accessFilter, question}`.

2. **Retrieval and Rerank** (`retrievalStep`):
    - Input: `{accessFilter, question}`.
    - `retrieveAgent`: Generates query, calls `vector-query.tool` to search PostgreSQL with PgVector (filters by accessFilter).
    - Extracts contexts (chunks with docId, text, score, securityTags, classification).
    - `rerankAgent`: Reorders contexts by relevance to question.
    - Output: `{contexts: DocumentContext[], question}`.

3. **Answer Generation** (`answerStep`):
    - Input: `{contexts, question}`.
    - `answererAgent`: LLM generates answer from contexts, produces citations (docId, source).
    - If no contexts: "No authorized documents found."
    - Output: `{answer: {answer: string, citations: []}, contexts, question}`.

4. **Answer Verification** (`verifyStep`):
    - Input: `{answer, contexts, question}`.
    - `verifierAgent`: Checks for policy violations (e.g., no unauthorized info leakage).
    - If fails: Throws error; else passes answer/citations.
    - Output: `{answer: string, citations: [{docId, source}]}`.

**Text Diagram**:

```
User Query + JWT → [Auth Service] → accessFilter
                    ↓
                [Retrieve Agent + Vector Tool] → filtered contexts (PostgreSQL with PgVector query)
                    ↓
                [Rerank Agent] → relevance-sorted contexts
                    ↓
                [Answerer Agent] → generated answer + citations
                    ↓
                [Verifier Agent] → verified output
                    ↓
Stream Response: answer chunks + {done, citations}
```

### 2. Governed RAG Index Workflow (`governed-rag-index.workflow.ts`)

Handles document ingestion: Process → Chunk → Embed → Store.

**Steps**:

1. **Index Documents** (`indexDocumentsStep`):
    - Input: `{documents: [{filePath, docId, classification, allowedRoles, tenant, source?}]}`.
    - Loops over docs:
        - `DocumentProcessorService`: Read/parse MD (cheerio/marked).
        - `ChunkingService`: Split into chunks (~500 tokens).
        - `EmbeddingService`: Generate vectors (OpenAI text-embedding-3-small, dim=1536).
        - `DocumentIndexingService`: Store in PostgreSQL with PgVector with payload: `{docId, versionId, classification, allowedRoles, securityTags, tenant, source}`.
    - Creates PostgreSQL with PgVector collection if needed.
    - Output: `{indexed: number, failed: number, documents: [{docId, status, chunks?, error?}]}`.

**Text Diagram**:

```
Documents (corpus/*.md) → [Processor Service] → parsed text
                            ↓
                        [Chunking Service] → text chunks
                            ↓
                        [Embedding Service] → vectors (OpenAI)
                            ↓
                        [Indexing Service + VectorStorage] → PostgreSQL with PgVector (with security payload)
                            ↓
Summary: {indexed, failed, details}
```

## Agents

Agents are LLM-powered (gpt-4o-mini via @ai-sdk/openai), configured in `src/mastra/agents/*.agent.ts`. Use schemas for structured output.

- **retrieve.agent.ts** (`retrieveAgent`): Queries vector store with filters. Uses `vector-query.tool`.
- **rerank.agent.ts** (`rerankAgent`): Scores/reorders contexts by question relevance.
- **answerer.agent.ts** (`answererAgent`): Synthesizes answer from contexts, generates citations.
- **verifier.agent.ts** (`verifierAgent`): Audits answer for security/compliance.
- **identity.agent.ts**: Likely handles user identity resolution (used in auth?).
- **policy.agent.ts**: Enforces policies (potentially in verification or auth).

## Tools

Reusable functions bound to agents:

- `vector-query.tool.ts` (`vectorQueryTool`): Queries PostgreSQL with PgVector with embedding similarity + filters (classification, roles, tags).
- `jwt-auth.tool.ts` (`jwtAuthTool`): Validates/decodes JWT, extracts claims.

## Services

Utility classes in `src/mastra/services/*.ts`:

- `AuthenticationService`: JWT validation, accessFilter computation.
- `RoleService`: Role hierarchy checks, inheritance resolution.
- `ValidationService`: Schema/input validation (Zod).
- `EmbeddingService`: OpenAI embeddings.
- `ChunkingService`: Text splitting strategies.
- `DocumentProcessorService`: MD parsing/extraction.
- `DocumentIndexingService`: Chunk metadata + storage.
- `VectorQueryService`: PostgreSQL with PgVector interactions (search/filter).
- `VectorStorageService`: Collection management (create/delete).
- `WorkflowDecorators`: Logging/metrics for workflows.

## Data Flow

- **Indexing**: API/CLI → Workflow → Services → PostgreSQL with PgVector (vectors + payloads).
- **Query**: API/UI → Workflow → Agents/Tools/Services → Filtered contexts → Answer.
- **Security**: Enforced at retrieval (filter) + verification (audit).
- **Logging**: All steps to `logs/mastra.log`/`logs/workflow.log` (via @mastra/loggers).

## Extensibility

- Add agents/tools: Extend Mastra config in `src/mastra/index.ts`.
- Custom workflows: New .workflow.ts files.
- Services: Modular; inject via Mastra context.
- Deployment: Docker for PostgreSQL with PgVector/Supabase; Next.js for app.

For role examples, see [Demo Roles](./demo-roles.md). Source: Verified from `src/mastra/workflows/*.ts` and related files.
