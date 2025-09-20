# API Reference

The Mastra Governed RAG provides two main API endpoints for document indexing and secure querying. Both use Mastra workflows under the hood and enforce security policies.

All endpoints are under `/api/` and use JSON for requests/responses. Authentication via JWT in request body (optional for indexing).

## Endpoints

### POST /api/chat

**Description**: Processes a user question through the governed RAG workflow: authenticate → retrieve filtered docs → rerank → generate answer → verify. Streams the response as Server-Sent Events (SSE).

**Path**: `POST /api/chat`

**Request Body** (JSON, required):

```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // JWT token with role claims
  "question": "What is the expense reimbursement policy?"  // User query
}
```

- `jwt`: Required for authentication. Contains role (e.g., "finance.viewer"). Missing → 400 error.
- `question`: Required. The natural language query.

**Response**: Streaming SSE (text/event-stream). Chunks of answer streamed every ~50ms, followed by final metadata.

**Stream Format**:

- Data chunks: `data: {"content": "Answer chunk here"}\n\n`
- Final: `data: {"done": true, "citations": [...], "contexts": []}\n\n`

**Example Request** (using curl):

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "jwt": "YOUR_JWT",
    "question": "What is our finance policy?"
  }'
```

**Example Stream Response**:

```
data: {"content": "The expense reimbursement policy requires..."}\n\n
data: {"content": "submission within 30 days."}\n\n
...
data: {"done": true, "citations": [
  {"docId": "finance-policy-001", "source": "Finance Department Policy Manual"}
], "contexts": []}\n\n
```

**Error Responses**:

- **400 Bad Request**: Missing `jwt` or `question`.

  ```json
  {"error": "Missing required fields"}
  ```

- **500 Internal Server Error**: Workflow failure (e.g., auth error, no contexts).

  ```json
  {"error": "Internal server error", "message": "Authentication failed"}
  ```

- Stream errors: `data: {"content": "⚠️ Error message", "done": true}\n\n`

**Status Codes**:

- 200: Streaming response.
- 400: Validation error.
- 500: Server error.

**Notes**:

- Max duration: 60 seconds.
- Citations: Only from authorized docs; includes `docId` and `source`.
- If no authorized docs: Answer explains "No authorized documents found."

### POST /api/index

**Description**: Indexes documents from `./corpus/` with security metadata. Runs the indexing workflow: process → chunk → embed → store in Qdrant. JWT optional (runs as system).

**Path**: `POST /api/index`

**Request Body** (JSON, optional):

```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // Optional for admin users
}
```

- `jwt`: Optional. If provided, logs under user context.

**Response** (JSON):

```json
{
  "success": true,
  "indexed": 3,
  "failed": 0,
  "documents": [
    {
      "docId": "finance-policy-001",
      "status": "success",
      "chunks": 12
    },
    {
      "docId": "hr-conf-001",
      "status": "failed",
      "error": "Indexing error message"
    }
  ]
}
```

**Example Request** (using curl):

```bash
curl -X POST http://localhost:3000/api/index \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Default Behavior**:

- Indexes all `.md` files in `./corpus/`.
- Auto-classifies:
  - `finance-policy.md`: internal, allowedRoles: ["finance.viewer", "finance.admin", "employee"]
  - `engineering-handbook.md`: internal, ["engineering.admin", "engineering.viewer", "employee"]
  - `hr-confidential.md`: confidential, ["hr.admin"]
- Tenant: "acme" (from .env).
- Source: Filename-based.

**Error Responses**:

- **500 Internal Server Error**: No docs or workflow failure.

  ```json
  {"error": "No documents found to index"}
  ```

  Or: `{"error": "Indexing workflow failed"}`

**Status Codes**:

- 200: Success with summary.
- 500: Error (e.g., Qdrant connection).

**Notes**:

- Max duration: 300 seconds (5 min).
- Overwrites existing docs with same `docId`.
- Logs to `logs/mastra.log`. Failed docs include error details.
- For custom docs: Extend the route or use CLI with payload.

## Authentication

- JWTs generated via UI (AuthPanel) or `scripts/make-jwt.js`.
- Claims: `{ role: "finance.viewer", tenant: "acme", ... }`.
- Validated in `AuthenticationService` against [role-hierarchy](../src/mastra/config/role-hierarchy.ts).

## Rate Limits and Headers

- No explicit limits; Mastra handles concurrency.
- Headers: `Content-Type: application/json`.
- CORS: Enabled for localhost dev.

For usage in UI, see [Quick Start](./quick-start.md). Extend via Mastra agents/tools in `src/mastra/`.