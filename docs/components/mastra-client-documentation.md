---
title: Mastra Client - Technical Documentation
component_path: `lib/mastra/mastra-client.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra Integration / Backend
tags: [mastra, client, api, docs]
---

# Mastra Client Documentation

Lightweight factory and singleton wrapper around the `@mastra/client-js` Mastra client. Provides convenience helpers for creating service-level and per-user clients with correct base URL and authorization headers.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide canonical Mastra client creation and configuration surface used by frontend and server code.
- OVR-002: Scope covers `getMastraBaseUrl()`, `mastraClient` singleton (service-level client), and `createMastraClient(token?)` factory for per-user clients. It explicitly avoids exposing secrets; it reads `process.env.MASTRA_BASE_URL` and `process.env.JWT_TOKEN`.
- OVR-003: Context: Used in API routes, pages that need to call Mastra, and server-side code that must authenticate to Mastra.

## 2. Architecture Section

- ARC-001: Design patterns: Factory (createMastraClient) + Singleton (`mastraClient`) pattern for a default service client.
- ARC-002: Dependencies: `@mastra/client-js` (Mastra client library), Node process environment for configuration, and local code that consumes the returned client.
- ARC-003: Interactions: The client is thin — composing HTTP headers and base URL. Consumers call methods on the `MastraClient` instance to interact with Mastra services.

### Component Structure and Behavior

```mermaid
graph TD
  A[getMastraBaseUrl] --> B[mastraClient]
  A --> C[createMastraClient(token)]
  subgraph External
    D[Mastra Server]
  end
  B --> D
  C --> D
```

## 3. Interface Documentation

| Function/Export | Purpose | Parameters | Return Type | Notes |
|-----------------|---------|------------|-------------|-------|
| `getMastraBaseUrl()` | Determine the configured Mastra base URL | none | `string` | Prefers `MASTRA_BASE_URL` env var, falls back to `http://localhost:4111` for dev |
| `mastraClient` | Pre-configured service-level Mastra client | none | `MastraClient` | Adds Authorization header if `JWT_TOKEN` env var is present |
| `createMastraClient(token?)` | Factory to create a client for a specific user token | `token?: string` | `MastraClient` | Caller-provided token is added as Bearer header |

## 4. Implementation Details

- IMP-001: `getMastraBaseUrl()` returns configured URL with local dev fallback.
- IMP-002: `mastraClient` includes service-level Authorization header only when `JWT_TOKEN` is available in environment. This makes it safe to include in server-side contexts but avoids leaking credentials to browsers.
- IMP-003: `createMastraClient(token?)` allows creating client instances per request or per user session (useful in API routes).

## 5. Usage Examples

```ts
import { mastraClient, createMastraClient } from '@/lib/mastra/mastra-client';

// service client usage (server-side)
await mastraClient.doSomething();

// per-request client in an API route
const client = createMastraClient(userToken);
await client.chat({ message: 'hello' });
```

## 6. Quality Attributes

- QUA-001 Security: Avoid exposing `mastraClient` in client bundles. Use `createMastraClient` in server contexts or add request-level tokens. Environment-configured `JWT_TOKEN` is used for server-to-server auth only.
- QUA-002 Reliability: The fallback `http://localhost:4111` is convenient for local development but ensure production `MASTRA_BASE_URL` is set.

## 7. Reference Info

- REF-001: Related code: `src/mastra/index.ts` (Mastra server bootstrap), API routes that call Mastra.
- REF-002: Change history: 1.0 (2025-09-23)
