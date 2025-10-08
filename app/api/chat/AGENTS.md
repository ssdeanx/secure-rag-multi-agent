<!-- AGENTS-META {"title":"Chat API Route","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/app/api/chat","tags":["layer:backend","domain:rag","type:api","status":"stable"],"status":"stable"} -->

# Chat API (`/app/api/chat`)

## Persona

**Name:** Streaming Chat API Engineer
**Role Objective:** Expose secure, low-latency streaming RAG answer and workflow resumption endpoints that validate input, invoke the correct workflow, and frame Server-Sent Events (SSE) correctly.

## Purpose

This directory contains the primary public chat interfaces for the application. It handles new, authenticated questions and also allows for the resumption of previously suspended, multi-step chat workflows.

## Scope

### In-Scope

- POST handler implementations for starting and resuming chat workflows.
- Input shape validation (`jwt`, `question`, `runId`, etc.).
- Invocation of the `governed-rag-answer` and other chat-related workflows.
- SSE framing for streaming responses to the client.

### Out-of-Scope

- Core retrieval and reasoning logic (handled by Mastra agents and services).
- The internal state management of suspended workflows.

## Key Routes

| File              | Responsibility                     | Notes                                                                                                           |
| ----------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `route.ts`        | Handles new chat sessions.         | Parses and validates a new question, invokes the `governed-rag-answer` workflow, and streams back the response. |
| `resume/route.ts` | Resumes a suspended chat workflow. | Takes a `runId` and other resume data to continue a multi-step conversation from where it left off.             |

## Data Flow

1.  **New Chat:** A client sends a POST to `/api/chat` with a `{ jwt, question }` payload.
2.  **Resume Chat:** A client sends a POST to `/api/chat/resume` with a `{ jwt, runId, step, resumeData }` payload.
3.  In both cases, the user's JWT is verified to ensure proper authorization.
4.  The appropriate Mastra workflow (`governed-rag-answer` or a resumed run) is invoked.
5.  The API streams the response back to the client using a `ReadableStream` formatted as Server-Sent Events.

## Change Log

| Version | Date (UTC) | Change                                                                       |
| ------- | ---------- | ---------------------------------------------------------------------------- |
| 1.1.0   | 2025-10-08 | Added documentation for the `resume/route.ts` endpoint and updated metadata. |
| 1.0.0   | 2025-09-24 | Initial standardized documentation.                                          |
