# Quick Start

This guide provides step-by-step instructions to set up and run the Mastra Governed RAG application locally.

## Prerequisites

- Node.js >=20.9.0
- Docker and Docker Compose (for vector store and database services)
- Git
- An OpenAI API key (for embeddings and LLM; add to `.env`)
- Optional: Qdrant cloud URL or run locally via Docker

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mastra-ai/governed-rag-template.git  # Or your fork
   cd mastra-governed-rag
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Copy the example environment file and fill in required values:
   ```bash
   cp .env.example .env
   ```
   
   Key variables to set:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `QDRANT_URL`: Qdrant server URL (e.g., `http://localhost:6333` for local)
   - `QDRANT_API_KEY`: If using cloud Qdrant
   - `TENANT`: Default tenant ID (e.g., `acme`)
   - `JWT_SECRET`: Secret for JWT signing (generate a strong one)

   For local development, the `docker-compose.yml` will start Qdrant and other services.

4. **Start Services**
   Launch the required backend services (Qdrant vector store, LibSQL database):
   ```bash
   docker-compose up -d
   ```
   
   Verify services are running:
   - Qdrant: `curl http://localhost:6333` (should return version info)
   - Wait 30 seconds for initialization.

5. **Index Sample Documents**
   Use the CLI to index the corpus documents (finance-policy.md, engineering-handbook.md, hr-confidential.md) with classifications:
   ```bash
   npm run build-cli  # Build CLI if needed
   npm run cli index
   ```
   
   Expected output:
   - Logs showing 3 documents found and indexed.
   - Success: `✅ finance-policy-001: X chunks indexed` (internal classification, finance roles).
   - `✅ engineering-handbook-001: Y chunks indexed` (internal, engineering roles).
   - `✅ hr-conf-001: Z chunks indexed` (confidential, hr.admin only).
   
   If no documents: Ensure `corpus/` files exist.

6. **Run the Development Server**
   Start the Next.js app and Mastra dev server:
   ```bash
   npm run dev
   ```
   
   - Next.js: http://localhost:3000
   - Mastra dev: Watches src/mastra/ for changes
   
   The app opens with a chat interface. Use the auth panel to generate a JWT for a role (e.g., finance.viewer).

## Testing the Setup

1. **Generate a JWT** (via UI or scripts/make-jwt.js):
   - Select role: e.g., `finance.viewer` (inherits employee/public).
   - Copy the JWT token.

2. **Query via Chat UI**:
   - Paste JWT in auth panel.
   - Ask: "What is the expense reimbursement policy?" (should return from finance-policy.md with citations).
   - For hr-confidential.md: As `employee`, expect "No authorized documents"; as `hr.admin`, full access.

3. **Query via CLI** (optional):
   ```bash
   npm run cli query "YOUR_JWT" "What is our finance policy?"
   ```
   
   Expected: Answer with citations to finance-policy.

## Troubleshooting

- **Docker services fail**: Check `docker-compose logs`. Ensure ports 6333 (Qdrant), 8000 (LibSQL) free.
- **Indexing errors**: Verify `.env` QDRANT_URL. Check logs/mastra.log.
- **No contexts in query**: Ensure indexing completed successfully; re-run `npm run cli index`.
- **Auth fails**: Validate JWT with role in src/mastra/config/role-hierarchy.ts.
- **Dev server issues**: Run `npm run mastra-dev` separately if concurrently fails.

For more details, see [Security](./security.md) and [API Reference](./api-reference.md).

## Next Steps

- Customize corpus in `./corpus/` with your documents.
- Extend roles in `src/mastra/config/role-hierarchy.ts`.
- Deploy: See [README](../README.md#deployment).