<!-- AGENTS-META {"title":"Next.js API Routes","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/app/api","tags":["layer:backend","domain:rag","type:api","status":"stable"],"status":"stable"} -->

# API Routes Directory (`/app/api`)

## Persona

**Name:** Backend API Developer
**Role Objective:** Provide thin, reliable HTTP boundaries that validate input, invoke Mastra workflows, and stream structured outputs to the frontend.

## Directory Purpose

This directory contains all backend API endpoints for the Next.js application. It serves as the bridge between frontend interactions (like chat, authentication, or data indexing) and the backend Mastra workflows, handling request validation, response shaping, and streaming.

## Scope

### In-Scope

- Route handler definitions (`route.ts`) for all API endpoints.
- Request parsing, input validation, and security checks (e.g., JWT verification).
- Invocation of Mastra workflows and services.
- Serialization and streaming of responses back to the client.

### Out-of-Scope

- Core business logic, which resides in `/src/mastra/services`.
- AI agent and workflow orchestration, which is defined in `/src/mastra/agents` and `/src/mastra/workflows`.
- Low-level cryptographic operations, which are handled by libraries like `jose`.

## Key Routes

| Route               | Method | Description                                                                                 |
| ------------------- | ------ | ------------------------------------------------------------------------------------------- |
| `/api/auth/login`   | POST   | Proxies login credentials to the Mastra backend and sets a session cookie.                  |
| `/api/auth/signup`  | POST   | Proxies signup information to the Mastra backend and sets a session cookie.                 |
| `/api/auth/signout` | POST   | Placeholder for clearing a user's session.                                                  |
| `/api/chat`         | POST   | Handles the main governed RAG chat, verifying the user's JWT and streaming answers.         |
| `/api/chat/resume`  | POST   | Resumes a suspended chat workflow, allowing for interactive, multi-step conversations.      |
| `/api/index`        | POST   | Triggers the indexing of documents from the `/corpus` directory into the vector store.      |
| `/api/docs-index`   | GET    | Scans the `/docs` directory and returns a structured JSON index of all documentation pages. |

## Change Log

| Version | Date (UTC) | Change                                                                                |
| ------- | ---------- | ------------------------------------------------------------------------------------- |
| 1.1.0   | 2025-10-08 | Updated to accurately reflect all existing API routes, including auth and docs-index. |
| 1.0.1   | 2025-09-24 | Formatting fixes.                                                                     |
| 1.0.0   | 2025-09-24 | Initial standardized documentation.                                                   |
