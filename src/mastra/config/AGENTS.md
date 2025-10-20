<!-- AGENTS-META {"title":"Mastra Config","version":"1.2.0","last_updated":"2025-10-15T12:58:00Z","applies_to":"/src/mastra/config","tags":["layer:backend","domain:infra","type:config","status":"stable"],"status":"stable"} -->

# Config Directory (`/src/mastra/config`)

## Persona

**Name:** DevOps & Cloud Engineer
**Role Objective:** Centralize secure initialization of external services (models, vector store, databases, logging, role hierarchy) with environment-driven configuration.

## Purpose

Establish consistent, testable, and secure entry points for all external dependencies consumed by Mastra agents, tools, and workflows.

## Key Files

| File                | Responsibility                            | Notes                                           |
| ------------------- | ----------------------------------------- | ----------------------------------------------- |
| `openai.ts`         | OpenAI model provider client setup        | API keys pulled from env                        |
| `google.ts`         | Google AI model provider client setup     | API keys pulled from env                        |
| `anthropic.ts`      | Anthropic model provider client setup     | API keys pulled from env                        |
| `gemini-cli.ts`     | Gemini CLI provider setup                 | For local development and testing               |
| `openrouter.ts`     | OpenRouter model provider client setup    | For routing to various models                   |
| `vertex.ts`         | Google Vertex AI model provider setup     | For Google Cloud-based models                   |
| `pg-storage.ts`     | PostgreSQL storage & vector client config | **CRITICAL**: Main storage backend with PgVector for 1568-dimension embeddings, semantic recall, working memory, and conversation threads. Manages PostgreSQL connections, pooling, and serves as the central data persistence layer for all Mastra operations. |
| `logger.ts`         | Structured logging (Pino)                 | Standard log helpers & transports               |
| `role-hierarchy.ts` | RBAC inheritance model                    | Drives policy & access filters                  |

## Initialization Pattern

```ts
const required = (name: string) => {
    const v = process.env[name]
    if (!v) throw new Error(`Missing required env: ${name}`)
    return v
}

export const OPENAI_API_KEY = required('OPENAI_API_KEY')
```

## Change Log

| Version | Date (UTC) | Change                                                  |
| ------- | ---------- | ------------------------------------------------------- |
| 1.2.0   | 2025-10-15 | Enhanced pg-storage.ts description to reflect its critical role as main storage backend with PgVector for 1568-dimension embeddings, semantic recall, working memory, and conversation threads |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata.         |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |
