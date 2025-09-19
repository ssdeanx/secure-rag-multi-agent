# Mastra Governed RAG: Project Overview

This document provides a high-level overview of the Mastra Governed RAG project.

## 1. Purpose

This project is a secure, enterprise-grade Retrieval-Augmented Generation (RAG) application. It uses the Mastra AI orchestration framework to provide role-based access control (RBAC) for a chat interface that answers questions based on a corpus of documents.

The key goal is to prevent data leakage by ensuring users can only receive answers generated from documents they are authorized to see.

## 2. Core Technologies

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Backend:** Next.js API Routes
- **AI Orchestration:** Mastra
- **LLM & Embeddings:** OpenAI
- **Vector Database:** Qdrant
- **Schema Validation:** Zod
- **Testing:** Vitest
- **Containerization:** Docker

## 3. Architecture

The system follows a multi-agent RAG pipeline orchestrated by a Mastra workflow:

1.  **User Interaction:** A user sends a query through the Next.js frontend.
2.  **Authentication:** A JWT is passed with the query to a Next.js API route.
3.  **Mastra Workflow:** The API route triggers the `governed-rag-answer` workflow.
4.  **Agent Pipeline:**
    - **Identity Agent:** Validates the JWT.
    - **Policy Agent:** Determines access rights based on the user's role.
    - **Retrieve Agent:** Queries the Qdrant vector database, applying the access filters.
    - **Rerank Agent:** Scores the retrieved documents for relevance.
    - **Answerer Agent:** Generates an answer using only the filtered, reranked documents.
    - **Verifier Agent:** Performs a final compliance and security check on the answer.
5.  **Response:** A secure, streaming response is sent back to the UI with citations.

For a visual representation, see the diagrams in the main `README.md`.
