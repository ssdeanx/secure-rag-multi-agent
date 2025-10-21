# MemoriPilot: System Architect

## Overview
This file contains the architectural decisions and design patterns for the MemoriPilot project.

## Architectural Decisions

- Decision: Agent Execution & Async Pattern — Agents are permitted to run asynchronously and make multiple tool calls when required. Rationale: Real-world research, scraping, and multi-source analysis require multi-step operations. Workflows and observability (Langfuse) ensure operations are auditable and secure.



- Decision: Use PostgreSQL + PgVector as primary vector store; documented in `pg-storage.ts`.
- Decision: Cedar UI connects to Mastra via `/chat` endpoints configured in `app/protected/cedar-os/layout.tsx`.
- Decision: `lib/mastra/mastra-client.ts` is the canonical programmatic client for dashboard/API code calling Mastra.



- Decision 1: Single-Tool-Call Agent Pattern - Each agent calls exactly one tool to ensure predictable, auditable behavior. Rationale: Prevents cascading errors, simplifies security analysis, makes agent behavior transparent.
- Decision 2: Multi-Layer Security Architecture - Enforce security at Identity→Policy→Retrieval→Verification layers, never bypass. Rationale: Defense-in-depth approach, multiple enforcement points catch failures.
- Decision 3: Zod Schema Validation Everywhere - All inputs validated with Zod at API, workflow, and service boundaries. Rationale: Runtime type safety beyond TypeScript, consistent error handling, API contract enforcement.
- Decision 4: Multi-Backend Vector Storage - Abstract vector storage behind interfaces supporting PostgreSQL+PgVector, Qdrant, Pinecone, S3Vectors, OpenSearch. Rationale: Flexibility for different deployment scenarios, no vendor lock-in.
- Decision 5: Workflow-Based Orchestration - Complex tasks decomposed into workflows that chain agents. Rationale: Separation of concerns, easier to test/debug, clearer business logic representation.
- Decision 6: Network-Based Dynamic Routing - Use LLM-powered networks for non-deterministic multi-agent routing. Rationale: Flexible task assignment, enables emerging behaviors, better than hard-coded workflows for complex scenarios.
- Decision 7: Hierarchical RBAC with Document Classification - Roles inherit permissions, documents tagged with classifications and tier requirements. Rationale: Scales to enterprise, supports multiple access levels, clear security model.
- Decision 8: Persistent Memory with Semantic Recall - Support working, long-term, and semantic memory layers. Rationale: Enables context across sessions, learning from interactions, sophisticated reasoning.
- Decision 9: Comprehensive Tracing with Langfuse - All workflows traced, all agent executions logged. Rationale: Production observability, compliance auditability, debugging support.
- Decision 10: Voice Integration with Google Gemini Live - Support real-time voice interactions via Gemini Live API. Rationale: Emerging user preference for voice, competitive feature.



1. **Decision 1**: Description of the decision and its rationale.
2. **Decision 2**: Description of the decision and its rationale.
3. **Decision 3**: Description of the decision and its rationale.



## Design Considerations

- NO LibSQL usage — storage is Postgres + PgVector (pg-storage.ts)
- Cedar uses streaming via /chat/stream (Cedar appends /stream automatically)
- `api.json` is a copy of Mastra OpenAPI used for feature discovery and to mirror endpoints
- Dash and other server pages use `lib/mastra/mastra-client.ts` and `lib/actions` to call Mastra
- Frontend styling is mixed (MUI Joy UI + local CSS/Tailwind in Cedar)



- Agents must follow single-tool-call pattern for security and auditability
- Security cannot be bypassed - enforce at multiple layers (Identity, Policy, Retrieval, Verification)
- All data validated with Zod schemas before processing
- Multi-tenant support required for enterprise deployments
- Tracing and audit trails mandatory for compliance
- Vector storage abstraction allows backend switching without code changes
- Memory management complex - balance working memory vs long-term persistence
- 20+ agents creates coordination complexity - networks help with routing
- Voice integration adds real-time constraints vs batch processing
- MCP integration introduces external tool management complexity



## Components

### Agent Execution Model

Agents can execute asynchronously and may call multiple tools. Responsibility for sequencing, retries, and auditability lies with workflows and Mastra's orchestration/tracing. This model enables complex research agents and networks to run multi-phase operations while preserving observability.

**Responsibilities:**

- Allow agents to run async and call multiple tools
- Ensure workflows orchestrate and validate outputs
- Use Langfuse tracing and SensitiveDataFilter for audit and redaction
- Enforce policy checks at Identity/Policy/Retrieve/Verifier stages





### Storage / Vector Layer (pg-storage.ts)

PostgreSQL PostgresStore and PgVector config. Exposes `pgStore`, `pgVector`, `pgMemory`, vector/query tools (`pgQueryTool`, `graphQueryTool`) and embedding helpers (`generateEmbeddings`).

**Responsibilities:**

- Store and query vectors
- Provide embedding generation helper
- Expose health checks and initialization routines

### Mastra Core Initialization (src/mastra/index.ts)

Creates the Mastra instance using `storage: pgStore`, `vectors: { pgVector }`, registers agents, workflows, networks, scorers, observability (Langfuse exporter), and MCP servers (a2aCoordinator).

**Responsibilities:**

- Register agents and workflows
- Wire storage and vectors
- Configure observability and tracing
- Expose apiRoutes for Mastra server endpoints

### Cedar UI Integration (app/protected/cedar-os/layout.tsx + /cedar)

`/cedar` provides a ReactFlow-based UI component library (RoadmapCanvas, FeatureNode, chat components, spells, etc.). `app/protected/cedar-os/layout.tsx` configures `CedarCopilot` to use Mastra as the LLM provider with `chatPath: '/chat'` (Cedar appends `/stream` for streaming).

**Responsibilities:**

- Provide UI primitives for Cedar OS
- Connect live chat UI to Mastra backend
- Render roadmap canvas and chat interfaces

### Frontend App (app/ & components/)

Next.js App Router pages and UI components (MUI Joy and Tailwind/CSS). API routes under `app/api` implement auth, chat, document operations, monitoring, policies, and more (mirroring Mastra endpoints).

**Responsibilities:**

- Serve the web UI
- Host API endpoints
- Use `lib/mastra/mastra-client.ts` and `lib/actions` to interact with Mastra backend when necessary
- Provide protected dashboard pages under `/app/protected/dash`

### Mastra Client & Server Actions (lib/mastra, lib/actions)

`lib/mastra/mastra-client.ts` wraps Mastra client operations (logs, telemetry, agents, workflows). `lib/actions` contains server-side helpers for auth & observability used by API routes and server components.

**Responsibilities:**

- Offer convenient server/client wrappers for Mastra API
- Provide authenticated client creation utilities
- Implement server-side actions for endpoints

### Policy & RBAC (role-hierarchy.ts + acl.yaml)

Role inheritance and levels defined in `src/mastra/config/role-hierarchy.ts`. Document access policies and tier-based features defined in `src/mastra/policy/acl.yaml`.

**Responsibilities:**

- Define role inheritance and numeric levels
- Define document classification rules and feature tiers
- Serve as authoritative source for access enforcement in agents/workflows

### Dashboard (app/protected/dash)

Protected admin/dashboard UI pages that call backend APIs and Mastra client wrappers to manage documents, monitoring, policies, settings, and users.

**Responsibilities:**

- Display and manage documents
- Show monitoring/traces/logs
- Expose admin controls for policies and roles





### Frontend Application Layer

Next.js App Router with React components, pages, and API routes. Serves UI for chat, authentication, indexing, and documentation. Uses MUI Joy UI for components.

**Responsibilities:**

- Render pages and layouts
- Handle client-side state with React hooks
- Manage user interactions and navigation
- Stream API responses for real-time updates
- Provide authentication UI

### Backend API Layer

Next.js API routes in /app/api that handle HTTP requests. Validates requests, invokes Mastra workflows, and returns responses. Includes chat, indexing, and authentication endpoints.

**Responsibilities:**

- Validate incoming requests with Zod schemas
- Authenticate users via JWT
- Invoke appropriate Mastra workflows
- Stream responses via SSE or JSON
- Handle errors and return proper status codes

### Mastra Core Orchestration

Central orchestration engine at /src/mastra that manages agents, workflows, networks, tools, and configuration. Registers agents, executes workflows, maintains tracing, manages memory.

**Responsibilities:**

- Register and manage 20+ agents
- Orchestrate 10+ workflows
- Route requests through networks
- Manage Langfuse tracing
- Configure external services (models, databases, APIs)

### Agent Layer (20+ Agents)

Specialized single-responsibility agents in /src/mastra/agents. Each agent calls exactly one tool. Includes core RAG agents (Identity, Policy, Retrieve, Rerank, Answerer, Verifier), research agents, analysis agents, content agents.

**Responsibilities:**

- Execute single tool calls
- Return structured results to workflows
- Implement specific business logic
- Maintain strict security constraints
- Handle errors and logging

### Tool Layer (12+ Tools)

Reusable callable functions in /src/mastra/tools that agents invoke. Includes vector search, JWT auth, web scraping, document chunking, graph RAG, web search, weather, roadmap, evaluation, copywriting.

**Responsibilities:**

- Perform specific operations (vector search, web scraping, etc.)
- Return structured data
- Handle external API calls
- Implement security filtering
- Provide comprehensive logging

### Workflow Layer (10+ Workflows)

Multi-step orchestrations in /src/mastra/workflows that chain agents. Examples: governed-rag-answer, governed-rag-index, research, content generation, financial analysis, report generation.

**Responsibilities:**

- Define step sequences
- Chain agent outputs to inputs
- Implement error handling
- Maintain tracing and logging
- Manage workflow context and memory

### Network Layer (2+ Networks)

Non-deterministic multi-agent routing at /src/mastra/agents/network. Research Content Network and Governed RAG Network dynamically route requests to appropriate agents.

**Responsibilities:**

- Route requests based on LLM reasoning
- Spawn multiple agents in parallel or sequence
- Aggregate results from multiple agents
- Maintain security constraints across routing

### Service Layer (13 Services)

Business logic modules in /src/mastra/services. Provides core functionality: authentication, roles, validation, rate limiting, document processing, chunking, embedding, vector operations, tier management.

**Responsibilities:**

- Implement business logic
- Interact with databases
- Provide reusable abstractions
- Handle cross-cutting concerns
- Maintain consistency

### Vector Storage Layer

Multi-backend vector database support. Primary: PostgreSQL + PgVector. Also supports: Qdrant, Pinecone, S3Vectors, OpenSearch. Configured in /src/mastra/config.

**Responsibilities:**

- Store document embeddings
- Perform similarity search
- Apply security filtering
- Manage vector collections
- Support backend switching

### Data & Memory Layer

Persistent storage: PostgreSQL for vectors/documents, LibSQL (SQLite) for memory/metadata. Supports user-scoped, tenant-aware memory with semantic recall.

**Responsibilities:**

- Store embeddings and documents
- Maintain conversation history
- Persist research memory
- Support multi-tenant isolation
- Provide ACID transactions

### Policy & Access Control

Security enforcement through /src/mastra/policy. Hierarchical RBAC (admin>dept_admin>dept_viewer>employee>public). Document classifications (public/internal/confidential). Feature tiers (free/pro/enterprise).

**Responsibilities:**

- Define role hierarchy
- Classify documents
- Enforce tier-based access
- Validate permissions
- Audit access attempts

### CLI Layer

Command-line interface at /src/cli for server-side operations. Supports document indexing, query testing, demo mode.

**Responsibilities:**

- Index documents with classification
- Support command-line queries
- Provide interactive demo
- Invoke workflows outside HTTP context

### Documentation & Content

Comprehensive documentation in /docs (MDX files) and sample corpus in /corpus. Architecture guides, API references, agent documentation, demo roles.

**Responsibilities:**

- Provide usage guides
- Document architecture
- Maintain API reference
- Supply sample data
- Track agent capabilities



