# Project Brief: Mastra Governed RAG

## Overview

This is a Next.js application implementing a governed Retrieval-Augmented Generation (RAG) system using Mastra framework. The system provides secure, role-based access to document indexing and querying with AI-powered chat interfaces.

## Key Components

- **Frontend**: Next.js app with React components, including Cedar UI components for chat interfaces
- **Backend**: Mastra agents, tools, services, and workflows for document processing and RAG
- **Data Layer**: Vector stores (Qdrant), document indexing, ACL-based access control
- **Security**: JWT authentication, role-based access, data classification (public/internal/confidential)

## Architecture

- Agents handle specific tasks (retrieval, answering, verification)
- Tools perform network I/O and filesystem operations with explicit approvals
- Services manage vector storage, document processing, and authentication
- Workflows orchestrate multi-step RAG processes
- ACL governs data access and classification

## Critical Security Features

- Least privilege access control
- Data classification enforcement
- Audit logging for all operations
- Fail-safe validation at startup
- Sanitization of external content

## Development Context

- TypeScript throughout
- Zod schemas for validation
- Tracing and observability
- Docker-based infrastructure
- Corpus documents with YAML frontmatter metadata
