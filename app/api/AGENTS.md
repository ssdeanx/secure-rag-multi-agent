<!-- AGENTS-META {"title":"Next.js API Routes","version":"1.0.1","last_updated":"2025-09-24T22:52:25Z","applies_to":"/app/api","tags":["layer:backend","domain:rag","type:api","status:stable"],"status":"stable"} -->

# API Routes Directory (`/app/api`)

## Persona

**Name:** Backend API Developer  
**Role Objective:** Provide thin, reliable HTTP boundaries that validate input, invoke Mastra workflows, and stream structured outputs to the frontend.  
**Prompt Guidance Template:**

```text
You are the {persona_role} responsible for {responsibility_summary}.
Constraints:
1. Handlers MUST remain lean (no embedded business logic).
2. All external calls MUST route through registered Mastra workflows or services.
3. Input MUST be validated (prefer Zod) before invocation.
4. Streaming MUST preserve event framing (event: <type> / data: <json>).
Forbidden:
- Direct database queries here.
- Bypassing security filters.
Return only the minimal diff or code snippet required.
```

Where:

- `{persona_role}` = "Backend API Developer"
- `{responsibility_summary}` = "exposing secure, streaming endpoints for governed RAG and indexing"

## Directory Purpose

Bridge frontend interactions (chat, indexing, auth flows) to backend Mastra workflows with secure validation, response shaping, and streaming capabilities.

## Scope

### In-Scope

- Route handler definitions via `route.ts`
- Request parsing & validation
- Workflow invocation & streaming serialization
- HTTP status & error normalization

### Out-of-Scope

- Core retrieval, ranking, or generation logic (Mastra workflows/services)
- Agent orchestration details
- Low-level token cryptography (handled in `lib/auth.ts` & agents)

## Key Routes

| Route                    | Method(s) | Workflow / Action     | Output Mode              | Notes                        |
| ------------------------ | --------- | --------------------- | ------------------------ | ---------------------------- |
| `/api/chat`              | POST      | `governed-rag-answer` | Streaming SSE            | Secure RAG answer pipeline   |
| `/api/index`             | POST      | `governed-rag-index`  | JSON (progress optional) | Triggers corpus ingestion    |
| (future) `/api/research` | POST      | `researchWorkflow`    | Streaming / staged       | Multi-phase research pattern |

## Handler Pattern

```ts
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        // 1. validate body (zod.parse)
        // 2. auth / jwt presence check
        // 3. invoke mastra workflow
        // 4. stream or return structured response
    } catch (err) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
```

## Streaming Guidelines

- Use `ReadableStream` + `controller.enqueue(TextEncoder().encode(...))` for SSE
- Frame events: `event: token` / `data: {"content":"..."}` + double newline
- Final event: `event: done` to signal completion
- Abort: Honor `req.signal` to close long-lived streams

## Validation Checklist

| Concern                               | Enforcement                                 |
| ------------------------------------- | ------------------------------------------- |
| JWT present                           | 400 if missing                              |
| Role claims                           | Provided to identity/policy agents upstream |
| Required fields (`question` for chat) | 400 if absent                               |
| Body size                             | (Optional) reject large payloads early      |

## Error Handling Strategy

- 400: Validation / missing fields
- 401: Missing or invalid auth (if added)
- 429: Optional rate limiting hook (future)
- 500: Unhandled exceptions (never leak stack trace)

## Security Notes

- Never trust client-provided role claims without agent/policy verification
- Keep secret environment variables server-side only
- Avoid echoing raw JWTs back to clients

## Observability

- Integrate tracing via Mastra / Langfuse when configured
- Log step boundaries in workflows (already instrumented) instead of duplicating log noise here

## Common Tasks

1. Add New Route:
    - Create `app/api/<name>/route.ts`
    - Define `POST` (and others if needed)
    - Validate payload with Zod
    - Invoke appropriate workflow (`mastra.getWorkflow(...)`)
2. Add Streaming Support:
    - Wrap workflow stream in `ReadableStream`
    - Forward incremental tokens/events
3. Add Input Field:
    - Extend Zod schema
    - Pass through to workflow invocation object

## Performance Considerations

- Keep handlers stateless & ephemeral
- Avoid synchronous CPU-heavy parsing; offload to workflows/services
- Stream early—flush first token quickly for perceived latency reduction

## Known Pitfalls

- Forgetting double newline between SSE events
- Performing business logic directly in handler
- Returning unvalidated passthrough fields to client

## Change Log

| Version | Date (UTC) | Change                                                  |
| ------- | ---------- | ------------------------------------------------------- |
| 1.0.1   | 2025-09-24 | Formatting fixes & fenced code languages added          |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)

```markdown
### Persona: Backend API Developer

### Purpose

This directory contains the backend API endpoints for the Next.js application. Following the App Router convention, each subdirectory with a `route.ts` file defines an API route that can be accessed by the frontend.

### Route Overview

- **`/api/chat`**: This is the primary endpoint for the RAG application. The frontend sends user questions and JWTs to this route. It then initiates the `governed-rag-answer` Mastra workflow and streams the response back to the client.
- **`/api/index`**: This endpoint is used to trigger the document indexing process. It calls the `governed-rag-index` Mastra workflow to process the files in the `/corpus` directory.

### Best Practices

- **Use Route Handlers:** API routes are defined by exporting functions named after HTTP methods (e.g., `export async function POST(request: NextRequest)`).
- **Streaming Responses:** For interactive experiences like chat, use streaming responses. The `/api/chat/route.ts` file provides an excellent example of how to use a `ReadableStream` and `TextEncoder` to stream Server-Sent Events (SSE) to the client.
- **Error Handling:** Wrap your route handler logic in `try...catch` blocks to gracefully handle unexpected errors and return appropriate HTTP status codes (e.g., 500 for internal server errors).
- **Input Validation:** Always validate the incoming request body to ensure it contains the required fields. The `/api/chat/route.ts` file demonstrates this by checking for the presence of `jwt` and `question`. For more complex validation, use a library like Zod.
- **Keep Handlers Lean:** Route handlers should be lightweight. Their primary job is to receive a request, call the appropriate service or workflow, and format the response. Complex business logic should be delegated to the `/src/mastra/services` or `/src/mastra/workflows` directories.
```

```

```
