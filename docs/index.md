# Mastra Governed RAG Documentation

## Overview

Mastra Governed RAG is a secure, role-based Retrieval-Augmented Generation (RAG) application built with Next.js and the Mastra AI orchestration framework. It enables controlled access to sensitive corporate knowledge bases while ensuring compliance with security policies through multi-agent workflows, document classification, and hierarchical role-based access control (RBAC).

The system processes documents from a corpus, indexes them with security metadata (classifications: public/internal/confidential; allowed roles; tags), and serves queries via a chat interface that filters results based on user authentication and authorization.

Beyond basic retrieval, this system employs agentic workflows leveraging Mastra's orchestration for dynamic security enforcement, enabling zero-trust RAG with real-time policy adaptation via Zod-structured tool calls and role-inherited filters. Agents like the policy agent generate access constraints inspired by ABAC principles, ensuring no external knowledge influences responses.

### Key Features

- **Governed RAG Pipeline**: Multi-agent workflow for secure document retrieval, reranking, answer generation, and verification.
- **Role-Based Security**: Hierarchical roles (public → employee → department viewer/admin → admin) with inheritance for access control.
- **Document Classification**: Automatic tagging of documents (e.g., HR confidential: confidential/hr.admin; Finance policy: internal/finance roles; Engineering handbook: internal/engineering roles).
- **Multi-Agent Orchestration**: Agents for identity verification, policy enforcement, retrieval, reranking, answering, and verification using Mastra.
- **Vector Storage**: Qdrant for embedding storage with security metadata.
- **API Endpoints**: `/api/chat` for streaming queries; `/api/index` for document indexing.
- **CLI Tools**: Commands for indexing, querying, and demo mode.
- **UI**: Next.js app with chat interface, authentication, and security indicators.

### Architecture Highlights

The system uses two main Mastra workflows:
- **Indexing Workflow**: Processes documents → chunks → embeds → stores in Qdrant with metadata.
- **Query Workflow**: Authenticate → Retrieve (filtered) → Rerank → Answer → Verify.

For detailed architecture, see [Architecture](./architecture.md).

### Quick Start

See [Quick Start](./quick-start.md) for setup instructions.

## Table of Contents

- [Quick Start](./quick-start.md): Installation and running the app.
- [Security](./security.md): Roles, classifications, and access policies.
- [API Reference](./api-reference.md): Endpoints, request/response formats.
- [Architecture](./architecture.md): Agent and workflow flows.
- [Demo Roles](./demo-roles.md): Example role-based interactions.
- [Advanced](./advanced.md): Multi-LLM, custom agents, scaling.
- [Contributing](..README.md#contributing): How to contribute to the project.

## Use Cases

- Secure corporate knowledge bases with department-specific access.
- Compliant AI assistants for finance, HR, engineering teams.
- Auditable RAG systems with citation tracking and policy enforcement.

For support and troubleshooting, refer to the [README](../README.md#troubleshooting).