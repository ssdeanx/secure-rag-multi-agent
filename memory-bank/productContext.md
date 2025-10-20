# Product Context

Describe the product.

## Overview

Provide a high-level overview of the project.

## Core Features

- Feature 1
- Feature 2

## Technical Stack

- Tech 1
- Tech 2

## Project Description

package.json confirms repository dependencies and versions: `@mastra/core` ^0.21.1, many @mastra/* packages, `cedar-os` dependency, `reactflow`, `tailwindcss`, `@mui/joy`, and Google/OpenAI SDKs. Dev dependencies include `mastra` CLI ^0.17.0 and TypeScript/Vitest tooling. This repo uses Mastra-related packages heavily and integrates Cedar frontend components. See `package.json` for the full authoritative list.



Authoritative product context (source-based):

This repository implements a Mastra-based multi-agent orchestration platform. Storage and vector operations use PostgreSQL with PgVector via `@mastra/pg` (see `src/mastra/config/pg-storage.ts` which exports `pgStore`, `pgVector`, and `pgMemory`). Vector/query tools include `pgQueryTool` and `graphQueryTool`, and embedding helpers include `generateEmbeddings`. The Mastra runtime is initialized in `src/mastra/index.ts` with `storage: pgStore` and `vectors: { pgVector }`; it registers agents, workflows, networks, scorers, and observability exporters (Langfuse with SensitiveDataFilter). Cedar UI components live under `/cedar` (ReactFlow-based roadmap and chat components). The Cedar integration at `app/protected/cedar-os/layout.tsx` configures `CedarCopilot` to call Mastra endpoints (baseURL from `NEXT_PUBLIC_MASTRA_URL`) using `chatPath: '/chat'` and Cedar's streaming suffix `/stream`. `api.json` is a local copy of the Mastra OpenAPI schema used by the application. `lib/mastra/mastra-client.ts` and `lib/actions/*` provide programmatic client helpers and server actions used by dashboard pages and API routes. Role hierarchy and ACL are authoritative in `src/mastra/config/role-hierarchy.ts` and `src/mastra/policy/acl.yaml` respectively. No LibSQL usage was found in the reviewed files.



Comprehensive multi-agent AI orchestration platform. Storage: PostgreSQL via @mastra/pg (PostgresStore) with PgVector for vector embeddings. `src/mastra/config/pg-storage.ts` exports `pgStore`, `pgVector`, `pgMemory` and vector tools (`pgQueryTool`, `graphQueryTool`) and embedding helpers (`generateEmbeddings`). No LibSQL is used in the reviewed files — Postgres + PgVector is authoritative.

Mastra Core: `src/mastra/index.ts` creates the Mastra instance using `storage: pgStore` and `vectors: { pgVector }`. It registers agents (dozens present, examples: retrieve, rerank, answerer, verifier, identity, policy, research, starter, a2aCoordinator, csvToExcalidraw, imageToCsv, excalidrawValidator), workflows (governed-rag-index, governed-rag-answer, research-workflow, chat-workflow, content-generation, financial-analysis-workflow variants, generate-report-workflow), networks (research-content-network, governed-rag-network, financial-team-network), scorers (responseQuality, taskCompletion), Langfuse tracing (with SensitiveDataFilter), and MCP server(s) (a2aCoordinator).

Cedar UI: `/cedar` is a ReactFlow-based component library (RoadmapCanvas, FeatureNode, RoadmapNode, many chat/spell components). The Cedar integration in `app/protected/cedar-os/layout.tsx` configures `CedarCopilot` to use Mastra as the provider with `chatPath: '/chat'` (Cedar auto-appends `/stream`). Cedar's chat components call `{baseURL}/chat/stream` and render SSE streaming chunks.

Frontend: Next.js App Router in `/app` and component library in `/components` (MUI Joy UI + local CSS). The protected dashboard under `/app/protected/dash` contains pages that interact with Mastra via `lib/mastra/mastra-client.ts` or server actions in `lib/actions`.

API surface & Client: `api.json` is a local copy of Mastra's OpenAPI schema used by the app. `lib/mastra/mastra-client.ts` provides a programmatic MastraClient wrapper used by API routes and dashboard code. `lib/actions` (`auth.ts`, `observability.ts`) contains server-side helper actions.

Policy & RBAC: Role hierarchy and numeric levels are defined in `src/mastra/config/role-hierarchy.ts`. Document ACLs and tier-based feature access are defined in `src/mastra/policy/acl.yaml` (public/internal/confidential classifications, tier-based features: free/pro/enterprise).

Tech summary (authoritative): PostgreSQL + PgVector, Mastra core, Google Gemini embeddings (gemini-embedding-001), Langfuse tracing, Next.js, React, TypeScript, MUI Joy UI, reactflow, framer-motion.

Notes: All statements above are sourced from the reviewed files: `src/mastra/config/pg-storage.ts`, `src/mastra/index.ts`, `/cedar` folder, `app/protected/cedar-os/layout.tsx`, `lib/mastra/mastra-client.ts`, `lib/actions/*`, `api.json`, `src/mastra/config/role-hierarchy.ts`, and `src/mastra/policy/acl.yaml`. No speculative technologies or stores were added.



Project uses PostgreSQL with PgVector via @mastra/pg. `src/mastra/config/pg-storage.ts` exports `pgStore` (PostgresStore), `pgVector` (PgVector), and `pgMemory` (Memory) configured with google.textEmbedding('gemini-embedding-001'). Embedding & vector tools: `pgQueryTool`, `graphQueryTool`, and `generateEmbeddings`. Mastra core (`src/mastra/index.ts`) initializes Mastra with `storage: pgStore` and `vectors: { pgVector }`. Observability uses Langfuse exporter with SensitiveDataFilter. Cedar UI (`/cedar`) is an independent ReactFlow-based component library used by the Cedar integration in `/app/protected/cedar-os/layout.tsx` which configures `CedarCopilot` to connect to Mastra at `NEXT_PUBLIC_MASTRA_URL` and uses `/chat` and `/chat/stream` endpoints. The `app` folder contains Next.js App Router routes including an API surface that mirrors Mastra endpoints; `api.json` is a copy of the Mastra OpenAPI schema used by the frontend for feature discovery and routing. `lib/mastra/mastra-client.ts` provides client wrappers to call the Mastra backend; `lib/actions` contains server-side helper actions (`auth.ts`, `observability.ts`). The protected dashboard (`/app/protected/dash`) contains UI pages for documents, monitoring, policy, settings and users that call backend APIs, often using `lib/mastra/mastra-client.ts` or `lib/actions` utilities. Role hierarchy is defined in `src/mastra/config/role-hierarchy.ts` and access rules in `src/mastra/policy/acl.yaml`. No LibSQL usage is present in the files reviewed; storage is Postgres-based.



Multi-agent AI system with PostgreSQL storage, extensive UI component library, and specialized tools. NOT LibSQL-based. Storage uses PostgreStore + PgVector for embeddings.



Multi-agent AI orchestration platform featuring secure RAG, advanced research, voice interactions, MCP integration, and sophisticated memory management using Mastra framework



## Architecture

**Storage Layer (pg-storage.ts)**: Uses PostgreSQL via @mastra/pg (PostgresStore). PgVector for vectors. Memory layer built on pgMemory with @mastra/memory using flat index (3072 dimensions for gemini-embedding-001). Tools: graphQueryTool (Graph RAG), pgQueryTool (vector query). Exports: pgStore, pgVector, pgMemory, generateEmbeddings, checkDatabaseHealth, initializeDatabase, shutdownDatabase. Masking utilities: createMaskedStream, maskSensitiveMessageData. **Mastra Core (index.ts)**: Registers 27 agents, 9 workflows, 2 scorers, 3 networks, MCP servers (a2aCoordinator). Storage: pgStore. Vectors: pgVector. Observability: Langfuse with SensitiveDataFilter. **Cedar Components**: ReactFlow-based canvas for roadmap UI. FeatureNode (main node with editing/upvoting/comments), RoadmapNode (simpler), RoadmapCanvas (orchestration). 40+ components across multiple subdirectories (chatComponents, chatMessages, chatInput, containers, spells, research, voice, etc.)



Multi-layer architecture with: Frontend Layer (/app, /components using Next.js App Router + React), Backend Layer (/src/mastra with AI orchestration), Data Layer (PostgreSQL + PgVector for vectors, LibSQL for memory), CLI Layer (/src/cli for document indexing and operations). 20+ specialized agents for research, analysis, content creation, security. 10+ workflows for RAG, research, content generation. 12 tools for web scraping, vector search, authentication, analysis. 13 services for core business logic. MCP integration for enhanced capabilities. Role-based access control with hierarchical permissions (admin > dept_admin > dept_viewer > employee > public). Three document classifications: public, internal, confidential.



## Technologies

- PostgreSQL + PgVector (primary vector store)
- Mastra core (`src/mastra`)
- Google Gemini embeddings (gemini-embedding-001)
- Langfuse tracing
- Next.js (App Router)
- React + ReactFlow (Cedar)
- MUI Joy UI
- TypeScript
- Framer Motion



- PostgreSQL + PgVector
- Mastra core (src/mastra/index.ts)
- Google Gemini embeddings (gemini-embedding-001)
- Langfuse tracing with SensitiveDataFilter
- React + Next.js App Router
- MUI Joy UI
- reactflow (Cedar)
- TypeScript
- Framer Motion



- PostgreSQL + PgVector via @mastra/pg
- Mastra core (registered in `src/mastra/index.ts`)
- Google Gemini embeddings (gemini-embedding-001)
- Langfuse for tracing
- React + Next.js App Router
- Cedar ReactFlow components for Cedar OS integration
- @mastra/memory for pgMemory
- TypeScript
- Tailwind/CSS for frontend styling (Cedar uses CSS; rest of frontend uses Joy + Tailwind)



- PostgreSQL + PgVector
- Mastra 0.21.1
- React
- TypeScript
- Next.js
- Langfuse (tracing)
- Google Gemini API



- Next.js 15.5.6
- TypeScript 5.9.3
- Mastra 0.21.1
- PostgreSQL 18 + PgVector
- LibSQL (SQLite)
- MUI Joy UI 5.0.0-beta.52
- Tailwind CSS 4.1
- Framer Motion
- Zod validation
- Vitest 3.2.4
- Node.js >=20.19.5
- Google AI (Gemini)
- OpenAI API
- OpenRouter API
- SerpAPI
- Docker/Docker-Compose



## Libraries and Dependencies

- @mastra/core
- @mastra/pg
- @mastra/memory
- @mastra/rag
- @mastra/mcp
- @ai-sdk/google
- reactflow
- @mui/joy
- framer-motion
- zod
- next
- react



- @mastra/core
- @mastra/pg
- @mastra/rag
- @mastra/memory
- @mastra/mcp
- @mastra/ai-sdk/google
- framer-motion
- @mui/joy
- reactflow
- ai



- @mastra/core
- @mastra/pg
- @mastra/rag
- @mastra/memory
- @mastra/mcp
- @mastra/voice-google-gemini-live
- @mastra/auth-supabase
- @ai-sdk/google
- @ai-sdk/openai
- @openrouter/ai-sdk-provider
- zod
- next
- react
- framer-motion
- tailwindcss
- @mui/joy
- lucide-react
- @radix-ui/*
- supabase-js

