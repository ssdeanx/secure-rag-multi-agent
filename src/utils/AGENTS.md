<!-- AGENTS-META {"title":"Backend Utility Layer","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/src/utils","tags":["layer:backend","domain:shared","type:utilities","status":"stable"],"status":"stable"} -->

# Utilities Directory (`/src/utils`)

## Persona

**Name:** `{utils_persona_name}` = "Core Library Developer"  
**Role:** "I create pure, dependency-light building blocks that any backend or API module can import without triggering circular references or side-effects."

## Purpose

Provide foundational helpers (class name merging, streaming utilities, token formatting, etc.) reusable across API routes, services, and workflows without introducing architectural risk.

## Current Notable Files

| File             | Purpose                                                           | Notes                                    |
| ---------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| `streamUtils.ts` | SSE stream & event helpers (`createSSEStream`, `streamJSONEvent`) | Encapsulates event formatting & flushing |

## Streaming Pattern Overview

```ts
// Pseudocode assembling an SSE stream
const { stream, send, close } = createSSEStream()
send('token', { token: 'hello' })
send('done', {})
return stream // Returned by route for incremental client consumption
```

## Change Log

| Version | Date (UTC) | Change                                                 |
| ------- | ---------- | ------------------------------------------------------ |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata.        |
| 1.0.0   | 2025-09-24 | Standardized utilities documentation; legacy preserved |
