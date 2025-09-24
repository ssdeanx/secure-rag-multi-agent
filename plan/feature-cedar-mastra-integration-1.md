---
title: "feature-cedar-mastra-integration"
component: "cedar-mastra-integration"
title: "feature-cedar-mastra-integration"
purpose: "feature"
component: "cedar-mastra-integration"
version: 1
authors:
  - sam
created: "2025-09-23"


# REQ-000: Implementation Plan - Cedar ↔ Mastra Integration (v1)

Overview

Deterministic, machine-readable implementation plan to integrate Cedar OS frontend with Mastra agent workflows for the Product Roadmap use-case.

Source spec: `spec/spec-architecture-cedar-mastra-integration.md`.

Files referenced are absolute repository paths and exact function/signature suggestions so an automated agent or human can perform edits without ambiguity.

Phases: Each phase is atomic. Tasks inside phases are parallelizable only when explicitly marked.

---

## PHASE 1 — Scaffolding API & Contracts (completion criteria: all files created/updated and compile typecheck passes)

- PH-1-TASK-1 (REQ-101)

  title: "Add server API endpoint: /api/roadmap/sync"

  description: Create a Next.js Server Route at `app/api/roadmap/sync/route.ts` that accepts a POST body with JWT and an initial canvas state, validates JWT via existing `lib/auth.ts` functions, and forwards the payload to Mastra workflow `productRoadmap` via `lib/mastra/mastra-client.ts`.

  file: `/home/sam/mastra-governed-rag/app/api/roadmap/sync/route.ts`

  exact function signature to implement (TypeScript, Next.js route handler):

  ```ts
  export async function POST(req: Request): Promise<Response>
  ```

  Implementation notes:

  - Read JSON body: { jwt: string, canvasState: any, threadId?: string }
  - Validate JWT with `lib/auth.ts` -> function `verifyJwt(token: string): { sub: string; roles: string[]; tenant?: string }` (if actual export differs, the agent should use `lib/auth.ts` exported names).
  - Instantiate Mastra client from `lib/mastra/mastra-client.ts` by calling `createMastraClient()`; call client.workflow or client.executeWorkflow with id `productRoadmap` and input:

  ```json
  {
    "userId": "verified.sub",
    "roles": "verified.roles",
    "canvasState": "canvasState",
    "threadId": "threadId"
  }
  ```

  - Return 200 with JSON { status: 'ok', workflowId: '<id-or-null>' } on success; 401 on JWT failure; 500 on other errors.

  validation (automatable):

  - Typecheck: `npx tsc --noEmit`

  - Curl test (replace JWT):

  ```bash
  curl -X POST "http://localhost:3000/api/roadmap/sync" -H "Content-Type: application/json" -d '{"jwt":"<JWT>","canvasState":{}}'
  ```

  - Expected response: HTTP 200 and JSON with status 'ok'.

- PH-1-TASK-2 (REQ-102)

  title: "Add streaming endpoint: /api/roadmap/stream"

  description: Create SSE streaming route at `app/api/roadmap/stream/route.ts` which proxies Mastra nested streaming events to the frontend using `src/utils/streamUtils.ts` utilities and returns an `EventStream` Response.

  file: `/home/sam/mastra-governed-rag/app/api/roadmap/stream/route.ts`

  exact function signature:

  ```ts
  export async function POST(req: Request): Promise<Response>
  ```

  Implementation notes:

  - Accept body { jwt: string, prompt: string, threadId?: string }
  - Validate JWT same as above
  - Create Mastra client and call workflow `chatWorkflow` or `productRoadmap` with streaming enabled by passing `streamController` or using client's stream API.
  - Use `createSSEStream` from `src/utils/streamUtils.ts` to bridge Mastra text/tool events to SSE format. Emit event objects with shape: { type: 'mastra_event', eventType: string, payload: any }

  validation:

  - Typecheck
  - Manual SSE test using `curl --no-buffer` against endpoint

- PH-1-TASK-3 (REQ-103)

  title: "Define input/output Zod contracts for roadmap workflows"

  description: Add a new file `src/mastra/workflows/roadmapWorkflowSchemas.ts` containing Zod schemas for `RoadmapSyncInput`, `RoadmapStreamInput`, and `RoadmapOutput`.

  file: `/home/sam/mastra-governed-rag/src/mastra/workflows/roadmapWorkflowSchemas.ts`

  exact content (sketch):

  ```ts
  import { z } from 'zod';

  export const RoadmapSyncInput = z.object({
    userId: z.string(),
    roles: z.array(z.string()),
    canvasState: z.any(),
    threadId: z.string().optional(),
  });

  export const RoadmapStreamInput = z.object({
    userId: z.string(),
    roles: z.array(z.string()),
    prompt: z.string(),
    threadId: z.string().optional(),
    streamController: z.any().optional(),
  });

  export const RoadmapOutput = z.object({ content: z.string(), actions: z.array(z.any()).optional() });
  ```

  validation:

  - `npx tsc --noEmit` and import these schemas in planned routes to ensure they typecheck

---

## PHASE 2 — Mastra Backend & Workflow Wiring (completion criteria: workflows registered, tools configured, simple integration test passes)

- PH-2-TASK-1 (REQ-201)

  title: "Register productRoadmap workflow"

  description: Ensure there is a Mastra workflow with id `productRoadmap` in `src/mastra/workflows/` that accepts `RoadmapSyncInput` and emits `RoadmapOutput`. If missing, add `productRoadmap.workflow.ts` implementing the input/output schema and calling existing steps: fetchContext, buildAgentContext, callAgent (use pattern in `chatWorkflow.ts`).

  - `/home/sam/mastra-governed-rag/src/mastra/workflows/productRoadmap.workflow.ts`

  exact createWorkflow skeleton (use existing `chatWorkflow` pattern):

  ```ts
  export const productRoadmap = createWorkflow({
    id: 'productRoadmap',
    inputSchema: RoadmapSyncInput,
    outputSchema: RoadmapOutput,
    description: 'Product roadmap orchestration workflow for Cedar canvas sync',
  })
  .then(fetchContext)
  .then(buildAgentContext)
  .then(callAgent)
  .commit();
  ```

  validation:

  - Unit test (Vitest): create a lightweight test in `src/mastra/workflows/__tests__/productRoadmap.spec.ts` which calls the workflow with a mock Mastra client and asserts output shape matches RoadmapOutput schema.

- PH-2-TASK-2 (REQ-202)

  title: "Ensure tools are available to productRoadmap agent"

  description: Verify `src/mastra/tools/roadmapTool.ts` exists and exports functions `queryGraph` and `mutateCanvas`. If not present, create `roadmapTool.ts` with these named exports and TypeScript signatures.

  file: `/home/sam/mastra-governed-rag/src/mastra/tools/roadmapTool.ts`

  function signatures:

  ```ts
  export async function queryGraph(query: { nodeId?: string; text?: string; filters?: any }, opts?: { limit?: number }): Promise<any[]>
  export async function mutateCanvas(canvasId: string, patch: any, meta?: any): Promise<{ success: boolean; id?: string }>
  ```

  validation:

  - `npx tsc --noEmit`
  - Add a small unit test mocking calls to these functions and asserting return shapes.

- PH-2-TASK-3 (REQ-203)

  title: "Agent configuration: productRoadmapAgent"

  description: Add or update `src/mastra/agents/productRoadmapAgent.ts` which instantiates an Agent with id `productRoadmap` and ensures it uses `roadmapTool` and `vector-query.tool.ts` as tools, and that the agent's instructions include MANDATORY steps to filter by role tags.

  file: `/home/sam/mastra-governed-rag/src/mastra/agents/productRoadmapAgent.ts`

  required exports:

  ```ts
  export const productRoadmapAgent = new Agent({
    id: 'productRoadmap',
    tools: [roadmapTool, vectorQueryTool],
    // include zod-based settings and instruction text
  });
  ```

  validation:

  - Lint/typecheck
  - Add integration test that simulates a minimal agent run using the existing Mastra test harness

---

## PHASE 3 — Frontend Integration (completion criteria: UI sends sync, receives streamed events, and updates Cedar canvas state locally)

- PH-3-TASK-1 (REQ-301)

  title: "Wire `/app/cedar-os/page.tsx` to call sync endpoint on mount"

  description: Update `app/cedar-os/page.tsx` to call the new `/api/roadmap/sync` endpoint on mount, passing the user's JWT (from existing auth client) and canvas state. The file already contains a client initialiser call — replace the current `sendCanvasState` body with a POST to `/api/roadmap/sync` using fetch.

  file: `/home/sam/mastra-governed-rag/app/cedar-os/page.tsx`

  exact code replacement region (JSX client useEffect):

  ```ts
  // inside useEffect -> sendCanvasState
  const res = await fetch('/api/roadmap/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jwt: JWT_FROM_LIB_AUTH, canvasState: initialCanvasState }),
  });
  ```

  validation:

  - Browser manual test: open `/cedar-os` in the dev server and confirm network POST occurred and returned status 200

- PH-3-TASK-2 (REQ-302)

  title: "Add SSE client in Cedar chat components"

  description: Add a streaming client utility `cedar/clients/roadmapStreamClient.ts` (frontend) that connects to `/api/roadmap/stream` and emits parsed Mastra events to existing Cedar components (CedarCaptionChat, FloatingCedarChat, SidePanelCedarChat). Components should accept an optional prop `onMastraEvent(event)`.

  file(s):

  - `/home/sam/mastra-governed-rag/cedar/components/chatComponents/CedarCaptionChat.tsx` (modify to accept optional onMastraEvent prop and hook it into UI update cycle)
  - `/home/sam/mastra-governed-rag/cedar/components/chatComponents/FloatingCedarChat.tsx` (same)
  - `/home/sam/mastra-governed-rag/cedar/components/chatComponents/SidePanelCedarChat.tsx` (same)
  - `/home/sam/mastra-governed-rag/cedar/clients/roadmapStreamClient.ts` (new file)

  exact streaming client signature (frontend TypeScript):

  ```ts
  export function connectRoadmapStream(opts: { jwt: string; threadId?: string; onEvent: (evt: any) => void; onError?: (err: Error) => void }) : { close: () => void }
  ```

  - Implementation: create EventSource-like connection using Fetch + ReadableStream, parse lines emitted by `src/utils/streamUtils.ts` bridge (data-only event lines), JSON.parse each `data: ...` chunk and call onEvent.

  validation:

  - Unit tests for parser utility to parse data-only SSE chunks
  - Dev server manual test: open Cedar UI and trigger a chat/stream; observe UI events

---

## PHASE 4 — Tests, Observability, and Security (completion criteria: tests passing, basic metrics/logs in workflow log)

- PH-4-TASK-1 (REQ-401)

  title: "Unit & Integration Tests"

  description: Create vitest tests for the new schemas, routes, and the `connectRoadmapStream` parser. Add integration test that runs productRoadmap workflow with sample input.

  files:

  - `src/mastra/workflows/__tests__/productRoadmap.spec.ts`
  - `app/api/roadmap/__tests__/sync.route.spec.ts`
  - `cedar/clients/__tests__/roadmapStreamClient.spec.ts`

  validation:

  - `npm test` and ensure new tests pass locally

- PH-4-TASK-2 (REQ-402)

  title: "Logging & Langfuse tracing"

  description: Ensure `productRoadmap` workflow emits `logStepStart`, `logStepEnd`, and `logError` calls consistent with existing `chatWorkflow` conventions. Produce at least one dashboard-friendly log line when sync endpoint is invoked.

  files to update: `src/mastra/workflows/productRoadmap.workflow.ts` and `src/mastra/workflows/WorkflowDecorators.ts` if needed

  validation: Check `logs/workflow.log` for entries after an end-to-end test run

- PH-4-TASK-3 (REQ-403)

  title: "Security Review Checklist"

  description: Add a checklist file `/plan/security-checklist-cedar-mastra-integration-1.md` that the CI will verify. Include JWT validation, role/tag enforcement at vector-query, and no client-exposed secrets.

  validation: Ensure CI linter or custom script verifies presence of JWT validation calls and that no `NEXT_PUBLIC_` variables are added.

---

## Rollout & Acceptance Criteria (deterministic pass/fail rules)

- Unit & integration tests added for all new code, run with `npm test`.
- TypeScript typecheck passes (`npx tsc --noEmit`).
- End-to-end smoke: Start dev server `npm run dev` and run the curl POST to `/api/roadmap/sync` returning status 'ok'.
- SSE smoke: run a curl command against the stream endpoint and confirm the stream emits parseable JSON objects with `type: 'mastra_event'`.
- Logs: `logs/workflow.log` contains `productRoadmap` workflow start/finish events.

---

## Machine-parsable Task List (JSON)

```json
{
  "plan_id": "feature-cedar-mastra-integration-1",
  "phases": [
    {"id":"PH1","tasks":["REQ-101","REQ-102","REQ-103"]},
    {"id":"PH2","tasks":["REQ-201","REQ-202","REQ-203"]},
    {"id":"PH3","tasks":["REQ-301","REQ-302"]},
    {"id":"PH4","tasks":["REQ-401","REQ-402","REQ-403"]}
  ]
}
```

---

## Automated Verification Commands

- Typecheck: `npx tsc --noEmit`
- Run unit tests: `npm test -- -w 1`
- Smoke sync endpoint (replace <JWT>):

```bash
curl -X POST "<http://localhost:3000/api/roadmap/sync>" -H "Content-Type: application/json" -d '{"jwt":"<JWT>","canvasState":{}}'
```

- Smoke stream endpoint (replace <JWT>):

```bash
curl --no-buffer -N -X POST "<http://localhost:3000/api/roadmap/stream>" -H "Content-Type: application/json" -d '{"jwt":"<JWT>","prompt":"hello"}'
```

---

## Notes, Assumptions, and Next Steps

- ASSUMPTION-1: `lib/auth.ts` exposes a JWT verification function named `verifyJwt` or similar; if the name differs, substitute the exported name. The plan points to `lib/auth.ts` as canonical auth.
- ASSUMPTION-2: Mastra client in `lib/mastra/mastra-client.ts` exposes workflow execution methods (e.g., `client.executeWorkflow` or `client.workflow(...)`). If names differ, adapt accordingly.
- NEXT-STEPS: Implement PHASE 1 tasks in order, run typecheck, then PHASE 2 and PHASE 3 in parallel where possible. PHASE 4 is final verification.

---

EOF
  ]
}
```

---

## Automated Verification Commands

- Typecheck: `npx tsc --noEmit`
- Run unit tests: `npm test -- -w 1`
- Smoke sync endpoint:

  curl -X POST "http://localhost:3000/api/roadmap/sync" -H "Content-Type: application/json" -d '{"jwt":"<JWT>","canvasState":{}}'

- Smoke stream endpoint:

  curl --no-buffer -N -X POST "http://localhost:3000/api/roadmap/stream" -H "Content-Type: application/json" -d '{"jwt":"<JWT>","prompt":"hello"}'

---

## Notes, Assumptions, and Next Steps

- ASSUMPTION-1: `lib/auth.ts` exposes a JWT verification function named `verifyJwt` or similar; if the name differs, substitute the exported name. The plan points to `lib/auth.ts` as canonical auth.
- ASSUMPTION-2: Mastra client in `lib/mastra/mastra-client.ts` exposes workflow execution methods (e.g., `client.executeWorkflow` or `client.workflow(...)`). If names differ, adapt accordingly.
- NEXT-STEPS: Implement PHASE 1 tasks in order, run typecheck, then PHASE 2 and PHASE 3 in parallel where possible. PHASE 4 is final verification.

---

EOF
