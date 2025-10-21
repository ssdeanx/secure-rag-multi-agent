<!-- META {"title":"Project Brief","version":"1.0","last_updated":"2025-10-20T12:07:45Z","source":"src/mastra/index.ts","tags":["memory-bank","project","brief"]} -->

# Governed Mastra Multi-Agent Platform (Finalized)

## Purpose

Define the main purpose of this project.

## Target Users

Describe who will use this.

## Project Summary

A Mastra-powered, enterprise-focused multi-agent orchestration platform. Storage and vector search are implemented using PostgreSQL + PgVector configured in `src/mastra/config/pg-storage.ts`. The Mastra runtime is initialized in `src/mastra/index.ts` (pgStore + pgVector), registers agents/workflows/networks, and configures tracing via Langfuse. Cedar UI components (ReactFlow) are under `/cedar` and connected by `app/protected/cedar-os/layout.tsx` which configures Cedar to call Mastra at `{NEXT_PUBLIC_MASTRA_URL}/chat` (streaming via `/chat/stream`). `api.json` is a local copy of Mastra's OpenAPI schema used for capability discovery and routing. `lib/mastra/mastra-client.ts` is the canonical programmatic client; `lib/actions` contains server-side helper actions. Role hierarchy and ACL are maintained in `src/mastra/config/role-hierarchy.ts` and `src/mastra/policy/acl.yaml`. No LibSQL usage detected in reviewed files.

An enterprise-grade multi-agent orchestration platform built on Mastra. Uses PostgreSQL + PgVector for vector storage (configured in `src/mastra/config/pg-storage.ts`). Mastra instance is initialized in `src/mastra/index.ts` with `pgStore` and `pgVector`, registers agents, workflows, networks, and configures Langfuse tracing. Cedar (`/cedar`) is a ReactFlow UI component library used by the Cedar integration in `app/protected/cedar-os/layout.tsx`, which connects Cedar to Mastra at `{NEXT_PUBLIC_MASTRA_URL}/chat` and relies on SSE at `/chat/stream`. The app's API surface mirrors Mastra endpoints (local `api.json` is a copy of Mastra OpenAPI). `lib/mastra/mastra-client.ts` is the programmatic client used by server actions and dashboard pages. `lib/actions` contains server-side helper actions (auth, observability). Role hierarchy and ACL are defined at `src/mastra/config/role-hierarchy.ts` and `src/mastra/policy/acl.yaml`. No LibSQL usage is present in reviewed files.

Comprehensive multi-agent AI orchestration platform combining secure Retrieval-Augmented Generation (RAG) with advanced research capabilities, voice interactions, MCP integration, and sophisticated memory management. Built with enterprise-grade security featuring hierarchical RBAC, document classification, and multi-agent security pipelines to ensure users only access authorized corporate knowledge while enabling powerful AI-driven research and analysis workflows.

## Goals

- Secure, auditable RAG and multi-agent orchestration
- Expose Mastra endpoints to frontend and Cedar integration
- Enforce role-based access control and document classification
- Provide observability for agent/workflow runs via Langfuse
- Support vector search and graph RAG using PgVector

- Provide secure, auditable RAG and multi-agent orchestration
- Expose Mastra endpoints to frontend and Cedar integration
- Enforce role-based access control and document classification
- Provide observability for agent/workflow runs via Langfuse
- Support vector search and graph RAG with PgVector

- Enable secure, governed AI-powered information retrieval with role-based access control
- Provide 20+ specialized agents for research, analysis, content creation, and security
- Support advanced multi-phase research workflows with web scraping and content evaluation
- Integrate voice capabilities for conversational AI interactions
- Implement sophisticated memory management with semantic recall and working memory templates
- Enforce hierarchical RBAC with zero-trust security architecture
- Support MCP (Model Context Protocol) for extended agent capabilities
- Ensure audit trails, compliance validation, and citation generation
- Enable seamless multi-agent orchestration through Mastra framework
- Provide both REST API and CLI interfaces for different use cases

## Constraints

- Storage is PostgreSQL + PgVector (no LibSQL)
- Role hierarchy and ACL are authoritative sources of access control
- Mastra client wrappers in `lib/mastra` are canonical for programmatic access
- Cedar stream integration uses `/chat` + `/chat/stream` endpoints

- Storage is PostgreSQL + PgVector (no LibSQL)
- Mastra agents follow single-responsibility patterns (one tool per agent) enforced in codebase conventions
- All security policies are authoritative in `acl.yaml` and enforced by policy/identity agents
- Use Langfuse (or configured tracing) for observability

- Strict TypeScript with no 'any' types
- All agent tools must be single-call (one tool per agent execution) ** NOT TRUE **
- Security parameters must never be modified by agents
- All access control enforced at retrieval level
- Support PostgreSQL + PgVector as primary vector store with support for alternatives (Qdrant, Pinecone, S3Vectors, OpenSearch)
- Node.js >=20.19.5 required
- Supabase for authentication
- Hierarchical role system: admin(100) > dept_admin(80) > dept_viewer(60) > employee(40) > public(10)
- Document classifications: public, internal, confidential with tier-based access (free, pro, enterprise)

## Stakeholders

- Developers
- Security/Compliance
- Product Managers
- Enterprise Customers
- End Users

- Developers
- Security/Compliance
- Product Managers
- Enterprise Customers
- End Users

- Development team
- Security team (for ACL/policy enforcement)
- Enterprise customers (for RAG/research capabilities)
- End users (via web and CLI interfaces)
