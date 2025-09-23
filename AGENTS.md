# Gemini Project Guide: Mastra Governed RAG & Cedar OS

This document provides a comprehensive overview and development guide for the project, based on the current file structure and code. It is intended to be a central source of truth for any developer or AI agent working on this repository.

## 1. Project Overview

This is a Next.js application with two primary functionalities:

1. **Governed RAG System:** A secure, Retrieval-Augmented Generation (RAG) chat application that uses Mastra to provide role-based access control (RBAC). It answers user questions based on a corpus of documents, ensuring users only see information they are authorized to access.
2. **Cedar OS Showcase:** An interactive application builder demonstrating the capabilities of the Cedar OS library for creating AI-powered user interfaces. This includes features like a dynamic product roadmap canvas, multiple chat UI modes, and agent-managed state.

## 2. Core Technologies

- **Framework:** Next.js
- **Language:** TypeScript
- **AI Orchestration:** Mastra
- **Interactive AI UI:** Cedar OS
- **Vector Database:** Qdrant
- **Database/Storage:** LibSQL
- **Styling:** Tailwind CSS, shadcn/ui
- **Schema Validation:** Zod
- **Testing:** Vitest
- **Containerization:** Docker

## 3. Getting Started

1. **Install Dependencies:**

    ```bash
    npm install
    ```

2. **Configure Environment:** Copy `.env.example` to a new `.env` file and populate it with your API keys (OpenAI, Langfuse) and secrets (JWT).
3. **Start Services:** Launch the Qdrant vector database using Docker.

    ```bash
    docker-compose up -d
    ```

4. **Index Documents:** Process the files in the `/corpus` directory and load them into the Qdrant vector store.

    ```bash
    npm run cli index
    ```

5. **Run Development Server:** Start the Next.js application + Mastra backend.

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

---

## 4. Directory Structure & Responsibilities

@**/gemini.md
@/**/components/GEMINI.md
@/**/app/GEMINI.md
@/**/corpus/GEMINI.md
@/**/cedar/GEMINI.md
@/**/app/api/GEMINI.md
@/**/src/mastra/GEMINI.md
@/**/src/mastra/config/GEMINI.md
@/**/src/mastra/services/GEMINI.md
@/**/src/mastra/tools/GEMINI.md
@/**/src/mastra/agents/GEMINI.md
@/**/src/mastra/policy/GEMINI.md
@/**/src/mastra/schemas/GEMINI.md
@/**/src/mastra/workflows/GEMINI.md
@/**/src/utils/GEMINI.md
@/**/src/types/GEMINI.md
@/**/src/lib/GEMINI.md
@/**/cli/GEMINI.md
@/**/src/GEMINI.md

The project is organized into several key directories, each with a specific responsibility:

1. **`/app`**: Contains the Next.js application code, including pages, API routes, and server-side logic.
2. **`/components`**: Reusable React components used throughout the application.
3. **`/corpus`**: The document corpus used for the RAG system, stored as Markdown files.
4. **`/cedar`**: The Cedar OS interactive application showcase.
5. **`/src`**: The core backend logic, including:
   - **`/mastra`**: All Mastra-related code, including agents, tools, workflows, services, and configuration.
   - **`/utils`**: Shared utility functions.
   - **`/types`**: TypeScript type definitions.
   - **`/lib`**: Library code for interacting with external services (e.g., database clients).
6. **`src/cli`**: Command-line interface scripts for tasks like indexing documents.

Each subdirectory contains its own `GEMINI.md` file that provides detailed information about its purpose, key files, best practices, and development guidelines. Refer to these files for in-depth understanding of each module.

---

## 5. Best Practices

- **Separation of Concerns:** Maintain a clear separation between frontend (`/app`, `/components`, `/cedar`) and backend (`/src`, `/mastra`) code.
- **Type Safety:** Use TypeScript types defined in `/src/types` consistently across the code
- **Modularity:** Break down complex features into smaller, manageable modules or functions.
- **Documentation:** Keep the `GEMINI.md` files up to date with any architectural changes or new features.
- **Security:** Follow RBAC principles strictly, ensuring that all data access is mediated through Mastra agents and policies.base.
- **Testing:** Write unit tests for critical functions and workflows using Vitest.
- **Version Control:** Use Git branches for feature development and pull requests for code reviews.
- **Environment Management:** Use environment variables for configuration and secrets, avoiding hardcoding sensitive information.
- **Performance:** Optimize AI model usage by selecting appropriate models for different tasks (e.g., smaller models for simple tasks).
- **Error Handling:** Implement robust error handling and logging, especially in API routes and Mastra workflows.
- **Code Reviews:** Regularly review code for adherence to best practices and project standards.
- **Continuous Integration:** Set up CI/CD pipelines to automate testing and deployment processes.
- **Accessibility:** Design and develop user interfaces with accessibility in mind, following WCAG guidelines.
- **Internationalization:** Support multiple languages and locales for a global user base.
