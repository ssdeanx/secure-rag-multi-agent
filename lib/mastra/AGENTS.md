<!-- AGENTS-META {"title":"Mastra Browser Client","version":"1.0.0","last_updated":"2025-09-24T12:45:00Z","applies_to":"/lib/mastra","tags":["layer:frontend","domain:rag","type:client","status:stable"],"status":"stable"} -->

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

## Usage Examples

```ts
// 1. Simple query (shared singleton)
import { mastraClient } from '@/lib/mastra/mastra-client'
const result = await mastraClient.query({
    workflow: 'governed-rag-answer',
    input: { question },
})

// 2. Authenticated per-request client in a Route Handler
import { createMastraClient } from '@/lib/mastra/mastra-client'
export async function POST(req: Request) {
    const token = await extractAndValidateJWT(req) // your auth logic
    const client = createMastraClient(token)
    return Response.json(
        await client.invoke({ agent: 'some-agent', input: { foo: 'bar' } })
    )
}
```

## Extension Pattern

Add lightweight wrappers without breaking importers:

```ts
// Example instrumentation wrapper (future idea)
export function instrumentedClient(token?: string) {
    const base = createMastraClient(token)
    return new Proxy(base, {
        get(target, prop, receiver) {
            const orig = Reflect.get(target, prop, receiver)
            if (typeof orig === 'function') {
                return async (...args: any[]) => {
                    const start = performance.now()
                    try {
                        return await (orig as any).apply(target, args)
                    } finally {
                        console.debug(
                            `[mastra-client] ${String(prop)} ${(performance.now() - start).toFixed(1)}ms`
                        )
                    }
                }
            }
            return orig
        },
    })
}
```

## Best Practices

- Keep exports flat & intentional.
- Avoid re-exporting Mastra types widely from here (import from `@mastra/...` directly when needed).
- Fail fast if misconfigured base URL causes network errors (surface clearly in logs).
- Consider SSR/edge constraints—avoid dynamic features not supported in edge runtimes if you plan to deploy there.

## Common Mistakes & Anti-Patterns

| Pattern                               | Why It's Bad          | Preferred Alternative                      |
| ------------------------------------- | --------------------- | ------------------------------------------ |
| Recomputing base URL in many files    | Drift & inconsistency | Always call `getMastraBaseUrl()`           |
| Adding feature flags here             | Bloats client layer   | Use dedicated config module                |
| Embedding fetch wrappers with retries | Hidden complexity     | Create a separate utility if needed        |
| Mixing server auth validation         | Layer violation       | Perform validation upstream, pass token in |

## Troubleshooting

| Symptom                       | Likely Cause                                     | Resolution                                  |
| ----------------------------- | ------------------------------------------------ | ------------------------------------------- |
| 401 responses using singleton | Missing `process.env.JWT_TOKEN` or expired token | Use `createMastraClient(userToken)` instead |
| Network error in browser      | Wrong `MASTRA_BASE_URL`                          | Check env variable or fallback port running |
| Authorization header absent   | Forgot to pass token                             | Call `createMastraClient(token)`            |

## Change Log

| Version | Date (UTC) | Change                                   |
| ------- | ---------- | ---------------------------------------- |
| 1.0.0   | 2025-09-24 | Initial standardized documentation added |

## Future Enhancements (Non-Blocking)

- Optional typed helper for frequently invoked workflows.
- Built-in tracing wrapper when Langfuse configured.
- Token auto-refresh injection hook (separate module).

## Legacy Content

No prior file existed; nothing to preserve.
