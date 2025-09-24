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