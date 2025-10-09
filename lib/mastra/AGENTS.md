<!-- AGENTS-META {"title":"Mastra Browser Client","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/lib/mastra","tags":["layer:frontend","domain:rag","type:client","status:stable"],"status":"stable"} -->

# Mastra Client (`/lib/mastra`)

## Persona

**Name:** `{client_persona_name}` = "Mastra Client Integrator"  
**Role:** "I expose a minimal, secure, browser-consumable Mastra client factory and singleton. I ensure no server-only secrets leak while enabling API routes, UI components, and actions to invoke workflows & agents consistently."  
**Primary Goals:**

1. Provide a safe default `mastraClient` for read / query flows.
2. Offer `createMastraClient(token)` to attach per-request auth.
3. Centralize base URL & header policy (avoid duplication).
4. Enable future instrumentation (metrics, tracing wrappers) in one place.

**MUST:**

- Use `getMastraBaseUrl()` everywhere (single source).
- Keep the file small, auditable, dependency-light.
- Preserve browser compatibility (no Node core modules).
- Allow injection of Authorization only when provided.

**FORBIDDEN:**

- Embedding long-lived secrets or API keys.
- Adding business logic (belongs in tools/services/workflows).
- Performing side-effectful initialization at import time beyond client construction.
- Mutating global state outside this module.

## Purpose & Scope

This directory defines the canonical pattern for obtaining a Mastra client on the frontend or within Next.js route handlers. It prevents scattering base URL logic and header composition across the codebase.

| Concern                     | Implemented Here? | Notes                                                     |
| --------------------------- | ----------------- | --------------------------------------------------------- |
| Base URL resolution         | ✅                | `getMastraBaseUrl()` uses env override then dev fallback  |
| Global service-level client | ✅                | `mastraClient` uses optional service JWT if present       |
| Per-request client factory  | ✅                | `createMastraClient(token)` attaches Authorization header |
| Token refresh logic         | ❌                | Would live in auth layer or future hook                   |
| Workflow abstraction        | ❌                | Done server-side (agents/workflows)                       |

## API Surface

```ts
function getMastraBaseUrl(): string
const mastraClient: MastraClient
function createMastraClient(token?: string): MastraClient
```

### `getMastraBaseUrl`

Resolution order:

1. `process.env.MASTRA_BASE_URL` (explicit)
2. Fallback: `http://localhost:4111`

### `mastraClient`

Singleton for generic (usually read) operations. Adds Authorization header only if `process.env.JWT_TOKEN` is defined at build/runtime.

### `createMastraClient(token)`

Ephemeral client for user-scoped or request-scoped operations. Pass the JWT you validated elsewhere.

## Change Log

| Version | Date (UTC) | Change                                          |
| ------- | ---------- | ----------------------------------------------- |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata. |
| 1.0.0   | 2025-09-24 | Initial standardized documentation added        |
