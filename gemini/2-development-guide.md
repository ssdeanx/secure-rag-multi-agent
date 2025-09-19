# Mastra Governed RAG: Development Guide

This guide covers the setup, conventions, and processes for developing on this project.

## 1. Initial Setup

1.  **Clone the repository.**
2.  **Install dependencies:** `npm install`
3.  **Configure Environment:** Copy `.env.example` to `.env` and fill in the required keys (`OPENAI_API_KEY`, `JWT_SECRET`, etc.).
4.  **Start Services:** Run `docker-compose up -d` to start the Qdrant vector database.
5.  **Index Corpus:** Run `npm run cli index` to process and embed the documents in `corpus/` into Qdrant.

## 2. Running the Application

Use the following command to run the development server:

```bash
npm run dev
```

This command concurrently starts:
- The Next.js frontend (`next dev --turbopack`)
- The Mastra development server (`mastra dev --dir src/mastra`), which provides hot-reloading for agents and workflows.

The application will be available at `http://localhost:3000`.

## 3. Code Style & Linting

- **Language:** TypeScript is used for all code.
- **Formatting:** Prettier is used for code formatting. Run `npx prettier --write .` to format the entire project.
- **Linting:** ESLint is configured to enforce code quality. Run `npm run lint` to check for issues.
- **Naming Conventions:**
    - Components: `PascalCase.tsx` (e.g., `ChatInterface.tsx`)
    - Mastra Workflows: `*.workflow.ts` (e.g., `governed-rag-answer.workflow.ts`)
    - Mastra Agents/Tools/Services: Use descriptive names in camelCase or PascalCase as appropriate (e.g., `retrievalAgent.ts`, `QdrantService.ts`).

## 4. Project Structure

- `app/`: Next.js page routes and global styles.
- `components/`: Shared React components, especially the main UI layout.
- `cedar/`: Core UI components, likely from the Cedar design system or shadcn/ui.
- `corpus/`: The source documents for the RAG system.
- `src/mastra/`: The heart of the AI logic. All Mastra agents, workflows, tools, and services are located here.
- `lib/`: Utility functions and client-side code.
- `scripts/`: Standalone scripts for tasks like generating JWTs.
