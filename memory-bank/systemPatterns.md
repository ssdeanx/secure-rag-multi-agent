<!-- META {"title":"System Patterns","version":"1.0","last_updated":"2025-10-20T12:11:00Z","source":"src/mastra/config","tags":["memory-bank","patterns","system"]} -->

# System Patterns

## Architectural Patterns

- Pattern 1: Description

## Design Patterns

- Pattern 1: Description

## Common Idioms

- Idiom 1: Description

## Single-Tool-Call Agent Pattern

Each agent executes exactly ONE tool call per invocation. This ensures predictable, auditable AI behavior. Agents are designed as single-responsibility units that call one specialized tool, then return their results to the orchestrating workflow. This pattern prevents cascading errors, makes agent behavior transparent, and simplifies security auditing. Used consistently across all 20+ agents including Identity, Policy, Retrieve, Rerank, Answerer, Verifier, Research, and specialized analysis agents.

### Examples

- IdentityAgent calls jwt-auth-tool once
- PolicyAgent calls policy-check-tool once
- RetrieveAgent calls vector-query-tool once
- AnswererAgent calls LLM-generation once
- ResearchAgent calls web-scraper-tool once per phase

## Workflow Orchestration Pattern

Workflows chain multiple agents in sequence to accomplish complex tasks. Each workflow defines a sequence of steps that invoke specific agents, passing outputs from one step as inputs to the next. Workflows handle error management, logging, and tracing. Currently 10+ workflows: governed-rag-answer (main RAG pipeline), governed-rag-index (document indexing), chat workflows, research workflows, content generation, financial analysis, report generation, template reviewer. Each workflow implements comprehensive error handling, tracing (Langfuse), and security validation at each step.

### Examples

- governed-rag-answer workflow: Identity → Policy → Retrieve → Rerank → Answerer → Verifier
- research-workflow: Query Decomposition → Web Scraping → Content Evaluation → Learning Extraction → Synthesis
- content-generation-workflow: Starter → Research → Copywriter → Editor → Evaluator

## Multi-Agent Network Pattern

Networks dynamically route requests to appropriate agents based on LLM reasoning. Unlike static workflows, networks use non-deterministic routing where an LLM decides which agent should handle each request. Currently two main networks: Research Content Network (for multi-source research), Governed RAG Network (for cross-agent RAG coordination). Networks enable flexible, intelligent task routing while maintaining security governance. Each network can spawn multiple agents in parallel or sequence based on task requirements.

### Examples

- Research Content Network routes to web scraper, evaluator, learning extractor as needed
- Governed RAG Network coordinates between Identity, Policy, Retrieve, and security agents

## Security-First Pipeline Pattern

Security is enforced at multiple layers: (1) Identity layer validates user JWT and extracts permissions, (2) Policy layer enforces RBAC and document classification filtering, (3) Retrieval layer applies security-filtered vector search, (4) Output layer (Verifier) validates responses for compliance/PII. No agent can bypass security checks. All sensitive operations (JWT validation, access control, PII detection) are isolated in dedicated agents. Security parameters are read-only and cannot be modified by downstream agents.

### Examples

- User JWT → Identity Agent → Policy Agent (role check) → Retrieve Agent (filtered vector search with role-based tags) → Verifier Agent (PII check)
- Document access controlled via acl.yaml with role and tier requirements

## Zod Schema Validation Pattern

All agent inputs, outputs, and workflow data are validated using Zod schemas. Schemas are defined in src/mastra/schemas and provide runtime type safety beyond TypeScript compile-time checks. Every API endpoint validates incoming requests with Zod. Workflows validate outputs from each step. Services use schemas for database operations. This provides multi-layer data validation and enables consistent error handling.

### Examples

- ChatRequestSchema validates JWT, question, context
- WorkflowStepOutputSchema validates each step's return value
- DocumentSchema validates indexed documents with metadata

## Multi-Backend Vector Storage Pattern

System supports multiple vector database backends interchangeably: PostgreSQL + PgVector (primary), Qdrant, Pinecone, S3Vectors, OpenSearch. Configuration in src/mastra/config determines which backend is active. VectorStorageService and VectorQueryService abstract backend-specific operations. This enables flexibility for different deployment scenarios (cloud vs on-premise, scale requirements, cost optimization).

### Examples

- PostgreSQL + PgVector for on-premise/cloud-native deployments
- Pinecone for managed vector database
- S3Vectors for AWS-native setups

## Memory and Context Management Pattern

System maintains multiple memory layers: (1) Working memory for current task context, (2) Long-term memory stored in LibSQL/PostgreSQL for persistence across sessions, (3) Semantic memory for similarity-based recall of past interactions. Agents can create research memory templates for complex tasks. Memory is user-scoped and tenant-aware in multi-tenant scenarios. Supports memory decay and cleanup. Workflows can query memory to maintain context across multi-step operations.

### Examples

- ResearchMemory template stores research findings and insights
- Chat workflow retrieves conversation history from LibSQL memory
- Network agents share context through memory layer

## PostgreSQL + PgVector Storage Pattern (Not LibSQL)

PostgreSQL + PgVector for storage. pgMemory uses flat index (not HNSW) to support 3072 dimensions (gemini-embedding-001). Workable Memory template with user profile, context, long-term memory, session notes. Working memory enabled with scope='resource'. Semantic recall with topK=5. Thread generation disabled by default. TokenLimiter processor (1048576 tokens). PgVector stores vectors in separate indexed collection (governed_rag). Graph RAG and vector query tools both use PgVector with minScore 0.7.

### Examples

- pgMemory uses flat index for high-dimensional embeddings
- TokenLimiter(1048576) constrains memory processor
- graphQueryTool dimension: 3072
- pgQueryTool minScore: 0.7

## Mastra Agent/Workflow Registration Pattern

Mastra instance registers: 27 named agents (retrieve, rerank, answerer, verifier, identity, policy, starter, research, researcher, assist, assistant, report, copywriter, evaluation, learning, productRoadmap, editor, cryptoAnalysis, stockAnalysis, marketEducation, a2aCoordinator, csvToExcalidraw, imageToCsv, excalidrawValidator, research-content-network, governed-rag-network, financial-team-network). 9 workflows (governed-rag-index, governed-rag-answer, research-workflow, generate-report-workflow, chat-workflow, chat-workflow-1, content-generation, financial-analysis-workflow, financial-analysis-workflow-v2, financial-analysis-workflow-v3). 2 scorers (responseQuality, taskCompletion). 3 networks. 1 MCP server (a2aCoordinator). Storage: pgStore. Vectors: pgVector. Observability: Langfuse with SensitiveDataFilter.

### Examples

- 27 agents registered in agents object
- 9 workflows in workflows object
- SensitiveDataFilter redacts: password, token, secret, key, apikey, auth, jwt, etc.

## Cedar ReactFlow Component Library Pattern

Cedar is ReactFlow-based UI component library for "Cedar OS" product roadmap showcase. Core: RoadmapCanvas.tsx (main orchestration), FeatureNode.tsx (interactive node with inline editing/status/upvoting/comments/resizing), RoadmapNode.tsx (simpler node), SmartRelationshipRoadmap.tsx (AI relationship viz), useRoadmapData.ts (static demo data hook). Additional UI: ChatModeSelector.tsx (mode toggle), badge/button/dropdown-menu primitives. Subdirectory components (40+): chatComponents (CedarCaptionChat, EmbeddedCedarChat, FloatingCedarChat, SidePanelCedarChat), chatInput (ChatInput, ContextBadgeRow, FloatingChatInput, HumanInTheLoopIndicator), chatMessages (ChatBubbles, ChatRenderer, DialogueOptions, MarkdownRenderer, MultipleChoice, Storyline, StreamingText, TodoList), CommandBar, containers (3D and flat variants), debugger (DebuggerPanel, tabs), spells (QuestioningSpell, RadialMenuSpell, RangeSliderSpell, ResearchSpell, etc.), voice (VoiceIndicator), text effects (ShimmerText, TypewriterText), research (ResearchPanel, ResearchResults).

### Examples

- RoadmapCanvas orchestrates ReactFlow canvas
- FeatureNode enables inline editing and upvoting
- 40+ components across chatComponents, chatMessages, spells, containers, voice
- Cedar used by /app/cedar-os integration layer

## Cedar→Mastra Integration Pattern

Cedar UI components (under `/cedar`) are used by the Cedar integration (`/app/protected/cedar-os`). The server layout creates a `CedarCopilot` configured to use Mastra as the LLM provider and points to `{NEXT_PUBLIC_MASTRA_URL}/chat` for streaming. Cedar appends `/stream` and handles SSE. Use this pattern when integrating front-end chat UIs with Mastra.

### Examples

- `app/protected/cedar-os/layout.tsx` uses `CedarCopilot` with baseURL `NEXT_PUBLIC_MASTRA_URL` and `chatPath: '/chat'`
- Cedar chat components call POST {baseURL}/chat/stream and render streaming SSE chunks.

## API Mirror / OpenAPI Pattern

The repository includes a local `api.json` file that is a copy of the Mastra OpenAPI schema. The Next.js app's API routes under `app/api/` mirror Mastra-like endpoints (chat, agents, mcp, memory, etc.). This pattern allows the frontend to discover Mastra capabilities and aligns routing between the app and Mastra server. Use `lib/mastra/mastra-client.ts` to programmatically call Mastra endpoints or mirror them in API routes.

### Examples

- `api.json` is a copy of Mastra OpenAPI schema
- `app/api/chat/route.ts` and `app/api/*` implement endpoints consistent with Mastra routes
- `lib/mastra/mastra-client.ts` wraps Mastra client calls for logs, telemetry, agents, workflows

## Dashboard → Mastra Client Pattern

Protected dashboard pages in `app/protected/dash` call backend APIs and backend helpers (`lib/actions`) and use `lib/mastra/mastra-client.ts` to interact with Mastra (logs, telemetry, agent/workflow management). This centralizes Mastra interactions in `lib/mastra` to keep server code consistent.

### Examples

- `app/protected/dash` pages use `lib/mastra/mastra-client.ts` for fetching agent lists, traces, and logs
- `lib/actions/observability.ts` and `lib/actions/auth.ts` provide server-side utilities used by API routes and server components

## Agent Execution Pattern (async & multi-tool)

Agents are not constrained to a single tool call. Mastra agents can run asynchronously and may invoke multiple tools as needed; orchestration, tracing, and policy enforcement are handled by workflows and the Mastra runtime. Agents should still follow single-responsibility principles where practical, but the system supports multi-step asynchronous agent behavior for complex tasks.

### Examples

- `researchAgent` performs multi-phase scraping, evaluation and extraction steps (async tool calls)
- `a2aCoordinator` coordinates async actions across agents/networks
- Workflows chain agent outputs and use Langfuse tracing to maintain auditability.
