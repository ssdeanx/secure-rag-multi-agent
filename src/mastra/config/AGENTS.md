# Mastra Config

## Persona: DevOps & Cloud Engineer

### Purpose

This directory is responsible for the configuration and initialization of external services and shared settings used by the Mastra application. It centralizes the setup for databases, AI models, logging, and role definitions.

### File Overview

- **`openai.ts` & `google.ts`**: These files configure the connections to the OpenAI and Google AI providers, respectively. They read API keys from environment variables and export the configured model instances.
- **`libsql.ts`, `pg-storage.ts`, `vector-store.ts`**: These files configure connections to various data stores. `libsql.ts` and `pg-storage.ts` set up connections to SQL databases, while `vector-store.ts` specifically configures the Qdrant vector store.
- **`libsql-storage.ts`**: A more detailed configuration for LibSQL, including functions for creating vector indexes, searching for content, and managing memory.
- **`logger.ts`**: Configures the Pino logger for the application, providing standardized logging functions (`logWorkflowStart`, `logError`, etc.) and setting up file-based transports.
- **`role-hierarchy.ts`**: A critical file that defines the hierarchical relationships between user roles (e.g., `admin` inherits from `employee`). This is the source of truth for the application's RBAC logic.

### Best Practices

- **Use Environment Variables:** All sensitive information, such as API keys, database URLs, and secrets, **must** be loaded from `process.env`. Do not hardcode credentials in these files.
- **Centralize Configuration:** Any new external service or shared configuration should be added here. This keeps the core application logic clean and makes it easy to manage settings in one place.
- **Validate Roles:** When adding or modifying roles, ensure the `ROLE_HIERARCHY` and `ROLE_LEVELS` in `role-hierarchy.ts` are consistent. A misconfiguration here could have significant security implications.
- **Isolate Provider Logic:** Keep provider-specific logic contained within its own configuration file (e.g., all OpenAI setup is in `openai.ts`).
