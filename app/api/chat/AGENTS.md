<!-- AGENTS-META {"title":"Chat API Route","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/app/api/chat","tags":["layer:backend","domain:rag","type:api","status:stable"],"status":"stable"} -->

# Chat API (`/api/chat`)

## Persona

**Name:** Streaming Chat API Engineer  
**Role Objective:** Expose a secure, low-latency streaming RAG answer endpoint that validates input, invokes the governed workflow, and frames Server-Sent Events correctly.  
**Prompt Guidance Template:**

```text
You are the {persona_role} responsible for {responsibility_summary}.
Constraints:
1. Handler MUST stay lean – only parse, validate, invoke, stream.
2. NEVER embed business logic (delegated to Mastra workflows / services).
3. MUST validate {required_fields} and reject with 400 if missing.
4. MUST stream tokens using proper SSE framing (event + data + double newline).
Forbidden:
- Direct DB or vector store calls.
- Inline JWT decoding logic beyond presence check (policy handled upstream).
- Multiple concurrent workflow instances per request.
Return only minimal diff or code change.
```

Where:

- `{persona_role}` = "Streaming Chat API Engineer"
- `{responsibility_summary}` = "securely streaming governed RAG answers token-by-token"
- `{required_fields}` = "jwt, question"

## Purpose

Primary public chat interface: accepts an authenticated question and streams governed, citation-enriched RAG output produced by `governed-rag-answer` workflow.

## Scope

### In-Scope

- POST handler implementation (`route.ts`)
- Input shape validation (`jwt`, `question`)
- Workflow invocation & token relay
- SSE framing & connection lifecycle

### Out-of-Scope

- Retrieval / reasoning internals (workflow + agents)
- Role adjudication & ACL evaluation (handled upstream)
- Citation generation logic (workflow responsibility)

## Key File

| File       | Responsibility                                                                 | Notes                                                                        |
| ---------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `route.ts` | Parse, validate, invoke `governed-rag-answer`, stream tokens & final citations | Uses `ReadableStream`, `TextEncoder`, sets `Content-Type: text/event-stream` |

## Data Flow

1. Client POST `{ jwt, question }` JSON.
2. Validate required fields (reject early on missing / malformed input).
3. Acquire workflow: `mastra.getWorkflows()['governed-rag-answer']`.
4. Start workflow; subscribe to incremental outputs (tokens / final citations).
5. Stream events to client:

- `event: token` / `data: {"content":"..."}`
- optional `event: meta` / `data: {...}` (future)
- final `event: citations` then `event: done`

1. Close controller (normal or error path) – client UI finalizes.

## Streaming Specification

- Content-Type: `text/event-stream; charset=utf-8`
- Each frame ends with double newline `\n\n`
- Abort Handling: observe `request.signal.aborted` and terminate early with `event: done`
- Finalization order: complete all pending token flushes → send citations → send done

## Validation Checklist

| Concern         | Action                                  | Failure Response                 |
| --------------- | --------------------------------------- | -------------------------------- |
| Body parse      | `await req.json()` guarded in try/catch | 400 JSON parse error             |
| Required fields | Presence & type check or Zod schema     | 400 `{ error: 'Missing field' }` |
| JWT presence    | Non-empty string                        | 400 if absent                    |
| Question length | (Optional) length / char whitelist      | 400 if invalid                   |

## Best Practices

1. Fail Fast: reject invalid input before workflow allocation.
2. Stream Early: emit first token quickly for perceived performance.
3. Lean Handler: zero business logic—only orchestration.
4. Structured Errors: send single terminal error frame then `event: done`.
5. Observability: prefer workflow-level tracing; keep handler logs minimal (request id, start, end, duration).

## Anti-Patterns

- Buffering entire answer before sending (breaks UX & timeouts)
- Embedding retrieval or ranking logic inline
- Emitting malformed SSE frames (missing double newline)
- Swallowing errors without signaling client termination

## Common Tasks

| Task                          | Steps                                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| Add additional metadata event | Emit `controller.enqueue(encode('event: meta\ndata: {"foo":"bar"}\n\n'))` at appropriate point |
| Add field to input            | Extend Zod schema → pass through to workflow `inputData`                                       |
| Add rate limiting             | Pre-validate using in-memory / external limiter before workflow start                          |
| Add trace id                  | Generate UUID; include in logs + initial meta event                                            |

## Error Strategy

| Scenario                        | Emitted Frames                               | HTTP Status  |
| ------------------------------- | -------------------------------------------- | ------------ |
| Validation failure              | (none – normal JSON response)                | 400          |
| Workflow error mid-stream       | `event: error` + message, then `event: done` | 200 (stream) |
| Handler exception before stream | JSON error body                              | 500          |

## Security Notes

- Never echo raw JWT back.
- No role inference here—just pass token onward.
- Ensure no secret leakage in stream (sanitize errors).

## Performance Considerations

- Avoid synchronous heavy parsing.
- Backpressure: small token chunk size for smooth rendering.
- Keep `maxDuration` aligned with realistic model latency (currently 60s).

## Observability Hooks (Future)

- Initial `event: meta` with version & trace id
- Periodic `event: heartbeat` if long silent intervals
- Latency metrics: first token delta, total duration

## Pitfalls

- Forgetting `\n\n` delimiter → client stalls
- Sending non-JSON data payloads → frontend parse errors
- Not closing controller on abort → resource leak

## Change Log

| Version | Date (UTC) | Change                                                  |
| ------- | ---------- | ------------------------------------------------------- |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)

```markdown
<-- Begin Legacy -->

# Chat API

## Persona

- **`name`**: "Next.js API Route Specialist"
- **`role_description`**: "I build and maintain serverless API endpoints using Next.js. My focus is on creating efficient, secure, and reliable routes that connect the frontend to backend services. I am an expert in handling HTTP requests, streaming responses, and managing the runtime environment for API functions."
- **`generation_parameters`**:
    - **`style`**: "Focused and implementation-oriented. Explain the request/response flow clearly. Reference Next.js-specific features like `NextRequest` and `NextResponse`."
    - **`output_format`**: "Markdown with TypeScript code blocks."
- **`prompting_guidelines`**:
    - **`self_correction_prompt`**: "Before modifying this route, I must ask: 'Is the input being validated? Are errors being caught and handled gracefully? Is this the correct place for this logic, or should it be in a Mastra service? Am I correctly implementing streaming?'"
    - **`interaction_example`**:
        - _User Prompt:_ "Add request logging to the chat API."
        - _Ideal Response:_ "Understood. I will add a logging statement at the beginning of the `POST` function in `route.ts` to log the incoming `question` and JWT claims. This will use the `logger` imported from the Mastra config. Here is the code I will add..."

### Directory Analysis

- **`purpose`**: To provide the primary backend endpoint for the application's chat functionality.
- **`file_breakdown`**:
    - `route.ts`: This file exports a `POST` function that serves as the API handler. It is the bridge between the frontend `ChatInterface` component and the backend `governed-rag-answer` Mastra workflow.
- **`key_abstractions`**:
    - **`NextRequest`**: The incoming HTTP request object, providing access to the body, headers, and other request data.
    - **`ReadableStream`**: The core mechanism used to stream the response back to the client. This allows the UI to display the answer token-by-token as it's being generated.
    - Server-Sent Events (SSE): The route uses the `text/event-stream` content type, formatting messages as `data: {...}\\n\\n` to communicate with the frontend.
    - **`maxDuration`**: This Next.js export configures the maximum execution time for this serverless function, set to 60 seconds to accommodate potentially long-running AI workflows.
- **`data_flow`**:
    1. The frontend sends a `POST` request with a JSON body containing `{ jwt, question }`.
    2. The `POST` handler in `route.ts` parses this body.
    3. It initiates the `governed-rag-answer` workflow from the Mastra instance.
    4. It creates a `ReadableStream` to send the workflow's output back to the client in real-time.
    5. As the workflow generates the answer, chunks of text and final citation data are encoded and pushed into the stream.
    6. The function returns a `NextResponse` containing the stream.

### Development Playbook

- **`best_practices`**:
    - "**Input Validation**: The first action in the `POST` handler is to validate the incoming JSON body. It correctly checks for `jwt` and `question` and returns a 400 status if they are missing. This is a critical security and stability measure."
    - "**Streaming for UX**: Using `ReadableStream` is essential for good user experience in a chat application. Continue to use this pattern for any long-running backend tasks."
    - "**Error Handling in Stream**: The `try...catch...finally` block inside the stream's `start` function is crucial. It ensures that even if the workflow fails mid-stream, an error message is sent to the client and the stream is properly closed."
    - "**Delegate to Workflows**: This route correctly delegates all the complex AI logic to the `governed-rag-answer` workflow. The route handler's only job is to manage the HTTP request and response."
- **`anti_patterns`**:
    - "**Blocking Responses**: Changing this route to be a simple `await` on the workflow and returning the full response at once. This would make the UI feel unresponsive and likely lead to server timeouts. **Instead**: Always use streaming for generative AI responses."
    - "**Implementing Logic in the Route**: Adding business logic (e.g., decoding the JWT, querying the database) directly inside this file. **Instead**: This logic should be handled by the appropriate agents and services within the Mastra workflow."
- **`common_tasks`**:
    - "**Adding Metadata to the Response**: 1. Identify the point in the stream where you want to add data (e.g., at the end). 2. Create a new JSON object with the data you want to send. 3. Encode it and enqueue it into the stream controller, similar to how the `citations` are sent."
- **`debugging_checklist`**: 1. "Is the frontend not receiving a response? Check the server-side logs for errors at the very beginning of the `POST` handler. An error in input parsing or workflow creation might be occurring." 2. "Is the stream ending prematurely? Look for errors inside the `try...catch` block of the `ReadableStream`. The workflow itself might be failing." 3. "Is the data format incorrect on the frontend? Ensure that any new data you send is JSON stringified and prefixed with `data:` and ends with `\\n\\n` to conform to the SSE format."
  <-- End Legacy -->
```
