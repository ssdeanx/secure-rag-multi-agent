------
goal: Implement Cedar-OS and Mastra AI Backend Integration
title: "feature-cedar-mastra-integration"
version: 1.0
component: "cedar-mastra-integration"
date_created: 2025-09-30
last_updated: 2025-09-30
purpose: "feature"
owner: Backend Team
component: "cedar-mastra-integration"
status: 'Planned'
version: 1
tags: [feature, architecture, integration, cedar-os, mastra, api, streaming]
authors: - sam
created: "2025-09-23"
---
## Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

## REQ-000: Implementation Plan - Cedar ↔ Mastra Integration (v1)

This implementation plan establishes the complete Cedar-OS and Mastra AI backend integration for the Governed RAG application. The plan is derived from the technical spike analysis (`/docs/spikes/backend-cedar-mastra-integration-spike.md`) and architectural specification (`/spec/spec-architecture-cedar-mastra-integration.md`), providing a phased approach to implement all critical endpoints, workflow consolidation, and Cedar provider configuration.Overview

**Implementation Timeline**: 5-7 business days  Deterministic, machine-readable implementation plan to integrate Cedar OS frontend with Mastra agent workflows for the Product Roadmap use-case.

**Priority**: HIGH - Blocking frontend Cedar-OS development

**Complexity**: Medium-HighSource spec: `spec/spec-architecture-cedar-mastra-integration.md`.

## 1. Requirements & Constraints

- Files: referenced are absolute repository paths and exact function/signature suggestions so an automated agent or human can perform edits without ambiguity

### Functional Requirements

- Phases: Each phase is atomic. Tasks inside phases are parallelizable only when explicitly marked

- **REQ-001**: Implement `/api/chat/resume` endpoint for human-in-the-loop workflows---

- **REQ-002**: Add Cedar provider wrapper in application layout

- **REQ-003**: Remove direct MastraClient usage from React components## PHASE 1 — Scaffolding API & Contracts (completion criteria: all files created/updated and compile typecheck passes)

- **REQ-004**: Consolidate chatWorkflow and chatWorkflow1 into single registered workflow

- **REQ-005**: Register consolidated workflow in Mastra instance- PH-1-TASK-1 (REQ-101)

- **REQ-006**: Implement streaming support with Server-Sent Events (SSE)

- **REQ-007**: Support ActionSchema for UI state updates  title: "Add server API endpoint: /api/roadmap/sync"

- **REQ-008**: Validate JWT tokens in all API endpoints

  description: Create a Next.js Server Route at `app/api/roadmap/sync/route.ts` that accepts a POST body with JWT and an initial canvas state, validates JWT via existing `lib/auth.ts` functions, and forwards the payload to Mastra workflow `productRoadmap` via `lib/mastra/mastra-client.ts`.

### Security Requirements

  file: `/home/sam/mastra-governed-rag/app/api/roadmap/sync/route.ts`

- **SEC-001**: All API routes MUST validate JWT before processing

- **SEC-002**: JWT tokens MUST pass from Cedar → API → Mastra  exact function signature to implement (TypeScript, Next.js route handler):

- **SEC-003**: No secrets or tokens SHALL be exposed in client-side code

- **SEC-004**: Implement proper CORS headers for Cedar frontend access  ```ts

  export async function POST(req: Request): Promise<Response>

### Performance Requirements  ```

- **PERF-001**: Chat endpoints SHALL complete within 60 seconds (maxDuration)  Implementation notes:

- **PERF-002**: Streaming responses SHALL emit within 50ms chunks

- **PERF-003**: Resume endpoint SHALL respond within 2 seconds  - Read JSON body: { jwt: string, canvasState: any, threadId?: string }

- **PERF-004**: First byte latency SHALL be under 100ms  - Validate JWT with `lib/auth.ts` -> function `verifyJwt(token: string): { sub: string; roles: string[]; tenant?: string }` (if actual export differs, the agent should use `lib/auth.ts` exported names).

  - Instantiate Mastra client from `lib/mastra/mastra-client.ts` by calling `createMastraClient()`; call client.workflow or client.executeWorkflow with id `productRoadmap` and input:

### Constraints

  ```json

- **CON-001**: Must maintain backward compatibility with existing `governed-rag-answer` workflow  {

- **CON-002**: Cannot break existing RAG security features    "userId": "verified.sub",

- **CON-003**: Must use Next.js 15.5.4 App Router patterns (no default exports)    "roles": "verified.roles",

- **CON-004**: Must use Zod schemas for all validation    "canvasState": "canvasState",

- **CON-005**: TypeScript strict mode must pass    "threadId": "threadId"

- **CON-006**: All changes must pass existing test suite  }

  ```

### Guidelines

- Return 200 with JSON { status: 'ok', workflowId: '<id-or-null>' } on success; 401 on JWT failure; 500 on other errors.

- **GUD-001**: Use `createMastraClient(token)` factory for all client instantiation

- **GUD-002**: Implement structured logging (`logStepStart`, `logStepEnd`, `logError`)  validation (automatable):

- **GUD-003**: Write JSDoc comments for all public functions

- **GUD-004**: Follow existing code style (Prettier + ESLint)  - Typecheck: `npx tsc --noEmit`

- **GUD-005**: Add unit tests for all new functions

- **GUD-006**: Add integration tests for API endpoints  - Curl test (replace JWT):

### Integration Patterns  
    ```bash

  curl -X POST "<http://localhost:3000/api/roadmap/sync>" -H "Content-Type: application/json" -d '{"jwt":"<JWT>","canvasState":{}}'
    ```

- **PAT-001**: Cedar Provider → API Route → Mastra Workflow → Agent  ```

- **PAT-002**: Use Server-Sent Events for streaming, not WebSockets

- **PAT-003**: Centralize Mastra client in `/lib/mastra/mastra-client.ts`  - Expected response: HTTP 200 and JSON with status 'ok'.

- **PAT-004**: Use ActionSchema for UI state synchronization

- **PAT-005**: Implement resume pattern for HITL workflows- PH-1-TASK-2 (REQ-102)

## 2. Implementation Steps

- title: "Add streaming endpoint: /api/roadmap/stream"

### Implementation Phase 1:

- Critical Endpoints (Priority: HIGH, Duration: 1-2 days)  description: Create SSE streaming route at `app/api/roadmap/stream/route.ts` which proxies Mastra nested streaming events to the frontend using `src/utils/streamUtils.ts` utilities and returns an `EventStream` Response

**GOAL-001**: Implement missing resume endpoint and Cedar provider configuration to unblock human-in-the-loop workflows  file: `/home/sam/mastra-governed-rag/app/api/roadmap/stream/route.ts`

| Task | Description | Completed | Date |  exact function signature:

|------|-------------|-----------|------|

| TASK-001 | Create `/app/api/chat/resume/route.ts` with POST handler supporting streaming and non-streaming responses | | |  ```ts

| TASK-002 | Implement resume endpoint schema validation using Zod (`ResumeRequestSchema`) | | |  export async function POST(req: Request): Promise<Response>

| TASK-003 | Add JWT validation to resume endpoint using existing `verifyJWT` helper | | |  ```

| TASK-004 | Implement workflow retrieval via `mastra.getWorkflows()` and `workflow.getRunAsync(runId)` | | |

| TASK-005 | Implement streaming resume response using `ReadableStream` API | | |  Implementation notes:

| TASK-006 | Implement non-streaming resume response returning JSON | | |

| TASK-007 | Add error handling for invalid runId (HTTP 404) and resume failures (HTTP 400) | | |  - Accept body { jwt: string, prompt: string, threadId?: string }

| TASK-008 | Create Cedar provider wrapper component in `/app/cedar-os/layout.tsx` or `/app/layout.tsx` | | |  - Validate JWT same as above

| TASK-009 | Configure Cedar provider with `baseURL`, `chatPath`, and `resumePath` from environment variables | | |  - Create Mastra client and call workflow `chatWorkflow` or `productRoadmap` with streaming enabled by passing `streamController` or using client's stream API.

| TASK-010 | Add `NEXT_PUBLIC_MASTRA_URL` environment variable to `.env.example` | | |  - Use `createSSEStream` from `src/utils/streamUtils.ts` to bridge Mastra text/tool events to SSE format. Emit event objects with shape: { type: 'mastra_event', eventType: string, payload: any }

| TASK-011 | Update `/app/cedar-os/page.tsx` to remove direct `createMastraClient()` usage | | |

| TASK-012 | Remove `useEffect` hook that calls `client.chat()` directly from Cedar components | | |  validation:

### Implementation Phase 2:

- Workflow Consolidation (Priority: HIGH, Duration: 2-3 days)  - Typecheck

- Manual SSE test using `curl --no-buffer` against endpoint

**GOAL-002**: Consolidate duplicate chat workflows into single Cedar-compatible workflow with proper registration

- PH-1-TASK-3 (REQ-103)

| Task | Description | Completed | Date |

|------|-------------|-----------|------|  title: "Define input/output Zod contracts for roadmap workflows"

| TASK-013 | Create new `/src/mastra/workflows/cedar-chat.workflow.ts` based on `chatWorkflow1.ts` structure | | |

| TASK-014 | Define `CedarChatInputSchema` with prompt, context, temperature, maxTokens, streamController fields | | |  description: Add a new file `src/mastra/workflows/roadmapWorkflowSchemas.ts` containing Zod schemas for `RoadmapSyncInput`, `RoadmapStreamInput`, and `RoadmapOutput`.

| TASK-015 | Define `CedarChatOutputSchema` with content, action (ActionSchema), and usage fields | | |

| TASK-016 | Implement `fetchContext` step to process Cedar-provided context (mentions, subscriptions) | | |  file: `/home/sam/mastra-governed-rag/src/mastra/workflows/roadmapWorkflowSchemas.ts`

| TASK-017 | Implement `buildAgentContext` step to construct message array for agent | | |

| TASK-018 | Implement `callAgent` step using `starterAgent.generate()` with `experimental_output` | | |  exact content (sketch):

| TASK-019 | Add streaming support in `callAgent` step using `streamController` if provided | | |

| TASK-020 | Add structured logging to all workflow steps (`logStepStart`, `logStepEnd`, `logError`) | | |  ```ts

| TASK-021 | Register `cedar-chat` workflow in `/src/mastra/index.ts` workflows object | | |  import { z } from 'zod';

| TASK-022 | Update `/app/api/chat/route.ts` to use new `cedar-chat` workflow instead of `governed-rag-answer` for Cedar routes | | |

| TASK-023 | Add fallback logic to use `governed-rag-answer` for RAG-specific queries | | |  export const RoadmapSyncInput = z.object({

| TASK-024 | Export workflow types from `/src/mastra/workflows/cedar-chat.workflow.ts` | | |    userId: z.string(),

    roles: z.array(z.string()),

### Implementation Phase 3:

- API Route Enhancement (Priority: MEDIUM, Duration: 1-2 days)

    ```ts
    canvasState: z.any() // replace `any` with exact type if available
    threadId: z.string().optional(),
    ```

**GOAL-003**: Enhance existing chat API route to support Cedar integration patterns and improve error handling  });

| Task | Description | Completed | Date |  export const RoadmapStreamInput = z.object({

|------|-------------|-----------|------|    userId: z.string(),

| TASK-025 | Update `/app/api/chat/route.ts` to detect Cedar vs RAG requests based on request headers or parameters | | |    roles: z.array(z.string()),

| TASK-026 | Implement workflow routing logic: Cedar requests → `cedar-chat`, RAG requests → `governed-rag-answer` | | |    prompt: z.string(),

| TASK-027 | Add support for `context` parameter in chat request schema for Cedar state | | |    threadId: z.string().optional(),

| TASK-028 | Implement ActionSchema emission in streaming response (new event type: `action`) | | |    streamController: z.any().optional(),

| TASK-029 | Add proper SSE event types: `message`, `action`, `done`, `error` | | |  });

| TASK-030 | Implement connection abort detection using `request.signal.addEventListener('abort')` | | |

| TASK-031 | Add request timeout validation to prevent token expiration mid-stream | | |  export const RoadmapOutput = z.object({ content: z.string(), actions: z.array(z.any()).optional() });

| TASK-032 | Implement workflow not found error handling with descriptive messages | | |  ```

| TASK-033 | Add CORS headers for Cedar frontend access: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods` | | |

| TASK-034 | Create helper function `streamJSONEvent(controller, data)` for consistent SSE formatting | | |  validation:

### Implementation Phase 4:

- Testing & Validation (Priority: HIGH, Duration: 1-2 days)  - `npx tsc --noEmit` and import these schemas in planned routes to ensure they typecheck

**GOAL-004**: Implement comprehensive test coverage for all new endpoints and workflows---

| Task | Description | Completed | Date |## PHASE 2 — Mastra Backend & Workflow Wiring (completion criteria: workflows registered, tools configured, simple integration test passes)

|------|-------------|-----------|------|

| TASK-035 | Create unit test for `/app/api/chat/resume/route.ts` in `__tests__/api/chat/resume.test.ts` | | |- PH-2-TASK-1 (REQ-201)

| TASK-036 | Test resume endpoint with valid runId returns 200 and correct response | | |

| TASK-037 | Test resume endpoint with invalid runId returns 404 error | | |  title: "Register productRoadmap workflow"

| TASK-038 | Test resume endpoint with expired JWT returns 401 error | | |

| TASK-039 | Test resume endpoint streaming vs non-streaming responses | | |  description: Ensure there is a Mastra workflow with id `productRoadmap` in `src/mastra/workflows/` that accepts `RoadmapSyncInput` and emits `RoadmapOutput`. If missing, add `productRoadmap.workflow.ts` implementing the input/output schema and calling existing steps: fetchContext, buildAgentContext, callAgent (use pattern in `chatWorkflow.ts`).

| TASK-040 | Create unit test for `cedar-chat.workflow.ts` in `src/mastra/workflows/__tests__/cedar-chat.test.ts` | | |

| TASK-041 | Test workflow with valid input returns expected output schema | | |  - `/home/sam/mastra-governed-rag/src/mastra/workflows/productRoadmap.workflow.ts`

| TASK-042 | Test workflow handles missing context gracefully | | |

| TASK-043 | Test workflow emits proper streaming events with mock streamController | | |  exact createWorkflow skeleton (use existing `chatWorkflow` pattern):

| TASK-044 | Create integration test for full Cedar flow in `tests/integration/cedar-integration.test.ts` | | |

| TASK-045 | Test Cedar component → chat API → workflow → agent → response cycle | | |  ```ts

| TASK-046 | Test HITL workflow pause and resume functionality end-to-end | | |  export const productRoadmap = createWorkflow({

| TASK-047 | Test concurrent resume attempts return 409 conflict | | |    id: 'productRoadmap',

| TASK-048 | Test JWT expiration during streaming returns proper error event | | |    inputSchema: RoadmapSyncInput,

| TASK-049 | Run existing test suite to ensure no regressions: `npm test` | | |    outputSchema: RoadmapOutput,

| TASK-050 | Verify test coverage meets 80% threshold: `npm run test:coverage` | | |    description: 'Product roadmap orchestration workflow for Cedar canvas sync',

  })

### Implementation Phase 5:

- Documentation & Cleanup (Priority: MEDIUM, Duration: 1 day)

  .then(fetchContext)
  .then(buildAgentContext)

**GOAL-005**: Document new integration patterns and clean up deprecated code

  .then(callAgent)
  .commit();

| Task | Description | Completed | Date |  ```

|------|-------------|-----------|------|

| TASK-051 | Update `/docs/architecture.md` with Cedar-Mastra integration architecture diagram | | |  validation:

| TASK-052 | Document Cedar provider configuration in `/docs/cedar-integration.md` | | |

| TASK-053 | Add JSDoc comments to all new API routes with parameter descriptions | | |  - Unit test (Vitest): create a lightweight test in `src/mastra/workflows/__tests__/productRoadmap.spec.ts` which calls the workflow with a mock Mastra client and asserts output shape matches RoadmapOutput schema.

| TASK-054 | Add JSDoc comments to workflow steps with input/output schemas | | |

| TASK-055 | Create example usage in `/docs/examples/cedar-chat-example.md` | | |- PH-2-TASK-2 (REQ-202)

| TASK-056 | Document resume endpoint usage in `/docs/examples/hitl-workflow-example.md` | | |

| TASK-057 | Update `README.md` with Cedar setup instructions | | |  title: "Ensure tools are available to productRoadmap agent"

| TASK-058 | Add environment variable documentation to `.env.example` | | |

| TASK-059 | Mark `chatWorkflow.ts` as deprecated with comment linking to `cedar-chat.workflow.ts` | | |  description: Verify `src/mastra/tools/roadmapTool.ts` exists and exports functions `queryGraph` and `mutateCanvas`. If not present, create `roadmapTool.ts` with these named exports and TypeScript signatures.

| TASK-060 | Mark `chatWorkflow1.ts` as deprecated with comment linking to `cedar-chat.workflow.ts` | | |

| TASK-061 | Update `/app/cedar-os/AGENTS.md` with implementation details | | |  file: `/home/sam/mastra-governed-rag/src/mastra/tools/roadmapTool.ts`

| TASK-062 | Create changelog entry in `/CHANGELOG.md` for Cedar integration | | |

  function signatures:

### Implementation Phase 6:

- Environment & Configuration (Priority: LOW, Duration: 0.5 days)


**GOAL-006**: Configure environment variables and deployment settings for Cedar integration

  ```ts  // No anys
  export async function queryGraph(query: { nodeId?: string; text?: string; filters?: any }, opts?: { limit?: number }): Promise<any[]> {
  export async function mutateCanvas(canvasId: string, patch: any, meta?: any): Promise<{ success: boolean; id?: string }>

  ```

| Task | Description | Completed | Date |  ```

|------|-------------|-----------|------|

| TASK-063 | Add `NEXT_PUBLIC_MASTRA_URL` to `.env.example` with default `http://localhost:3000` | | |  validation:

| TASK-064 | Add `MASTRA_BASE_URL` to `.env.example` with default `http://localhost:4111` | | |

| TASK-065 | Document environment variable separation: `NEXT_PUBLIC_*` for frontend, others for backend | | |  - `npx tsc --noEmit`

| TASK-066 | Update `next.config.mjs` to validate required environment variables at build time | | |  - Add a small unit test mocking calls to these functions and asserting return shapes.

| TASK-067 | Add environment variable validation in `/lib/mastra/mastra-client.ts` | | |

| TASK-068 | Create development environment setup script in `/scripts/setup-cedar-dev.sh` | | |- PH-2-TASK-3 (REQ-203)

| TASK-069 | Update Docker Compose configuration if needed for Cedar development | | |

| TASK-070 | Update deployment documentation with Cedar-specific environment variables | | |  title: "Agent configuration: productRoadmapAgent"

## 3. Alternatives

- description: Add or update `src/mastra/agents/productRoadmapAgent.ts` which instantiates an Agent with id `productRoadmap` and ensures it uses `roadmapTool` and `vector-query.tool.ts` as tools, and that the agent's instructions include MANDATORY steps to filter by role tags.

### Alternative Approaches Considered

- file: `/home/sam/mastra-governed-rag/src/mastra/agents/productRoadmapAgent.ts`

- **ALT-001**: **Use WebSockets instead of SSE for streaming**  required exports:

  - **Rejected**: SSE is simpler, better HTTP infrastructure compatibility, automatic reconnection. WebSockets add unnecessary complexity for unidirectional server-to-client communication.

  ```ts

  - **ALT-002**: **Keep chatWorkflow.ts and chatWorkflow1.ts separate instead of consolidating**  
  export const productRoadmapAgent = new Agent({

  - **Rejected**: Creates confusion about which workflow to use, harder to maintain, duplicates logic. Single consolidated workflow provides clear interface and reduces maintenance burden.    id: 'productRoadmap',

    tools: [roadmapTool, vectorQueryTool],

  - **ALT-003**: **Allow direct MastraClient usage in React components**    // include zod-based settings and instruction text

  - **Rejected**: Violates separation of concerns, makes testing difficult, exposes backend details to frontend, harder to change backend implementation. API routes provide proper abstraction layer.  });

  ```

- **ALT-004**: **Implement custom integration layer instead of using Cedar provider**

  - **Rejected**: Reinvents wheel, harder to maintain, loses Cedar framework benefits. Cedar provider is battle-tested and provides standard patterns.  validation:

- **ALT-005**: **Modify governed-rag-answer workflow instead of creating separate cedar-chat workflow**  - Lint/typecheck

  - **Rejected**: Risks breaking existing RAG security features, mixes concerns (secure RAG vs generic chat), harder to maintain. Separate workflows provide clear boundaries.  - Add integration test that simulates a minimal agent run using the existing Mastra test harness

- **ALT-006**: **Use GraphQL subscriptions for real-time updates**---

  - **Rejected**: Adds unnecessary dependency, more complex setup, overkill for current requirements. SSE meets all needs with simpler implementation.

## PHASE 3 — Frontend Integration (completion criteria:

- UI sends sync, receives streamed events, and updates Cedar canvas state locally)

## 4. Dependencies

- PH-3-TASK-1 (REQ-301)

### Package Dependencies

  title: "Wire `/app/cedar-os/page.tsx` to call sync endpoint on mount"

- **DEP-001**: `cedar-os@0.1.21` - Cedar OS UI framework (already installed)

- **DEP-002**: `@mastra/core@0.18.0` - Mastra AI orchestration (already installed)  description: Update `app/cedar-os/page.tsx` to call the new `/api/roadmap/sync` endpoint on mount, passing the user's JWT (from existing auth client) and canvas state. The file already contains a client initialiser call — replace the current `sendCanvasState` body with a POST to `/api/roadmap/sync` using fetch.

- **DEP-003**: `@mastra/client-js@0.13.2` - Mastra client library (already installed)

- **DEP-004**: `zod@4.1.11` - Schema validation (already installed)  file: `/home/sam/mastra-governed-rag/app/cedar-os/page.tsx`

- **DEP-005**: `jose@^6.1.0` - JWT verification (already installed)

- **DEP-006**: `next@15.5.4` - Next.js framework (already installed)  exact code replacement region (JSX client useEffect):

### Service Dependencies

  ```ts

  // inside useEffect -> sendCanvasState

  - **DEP-007**: Mastra backend server running on port 4111 (`npm run dev:mastra`)  const res = await fetch('/api/roadmap/sync', {

  - **DEP-008**:  development server running on port 3000 (`npm run dev:next`)    method: 'POST',

  - **DEP-009**: Qdrant vector database running on port 6333 (Docker Compose)    headers: { 'Content-Type': 'application/json' },

  - **DEP-010**: LibSQL storage for workflow state persistence 

 body: JSON.stringify({ jwt: JWT_FROM_LIB_AUTH, canvasState: initialCanvasState }),

  });
  ```

### Environment Variable Dependencies

- **DEP-011**: `JWT_SECRET` - Required for token signing/verification  validation:

- **DEP-012**: `OPENAI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY` - Required for LLM inference

- **DEP-013**: `NEXT_PUBLIC_MASTRA_URL` - New variable for Cedar frontend configuration  - Browser manual test: open `/cedar-os` in the dev server and confirm network POST occurred and returned status 200

- **DEP-014**: `MASTRA_BASE_URL` - Backend Mastra server URL

- PH-3-TASK-2 (REQ-302)

### Code Dependencies

  title: "Add SSE client in Cedar chat components"

- **DEP-015**: `/lib/mastra/mastra-client.ts` - Mastra client factory (existing)

- **DEP-016**: `/lib/jwt-utils.ts` - JWT verification helpers (existing)  description: Add a streaming client utility `cedar/clients/roadmapStreamClient.ts` (frontend) that connects to `/api/roadmap/stream` and emits parsed Mastra events to existing Cedar components (CedarCaptionChat, FloatingCedarChat, SidePanelCedarChat). Components should accept an optional prop `onMastraEvent(event)`.

- **DEP-017**: `/src/mastra/agents/starterAgent.ts` - Default chat agent (existing)

- **DEP-018**: `/src/mastra/config/logger.ts` - Structured logging (existing)  file(s):

- **DEP-019**: `/src/mastra/workflows/chatWorkflowSharedTypes.ts` - Shared type definitions (existing)

  - `/home/sam/mastra-governed-rag/cedar/components/chatComponents/CedarCaptionChat.tsx` (modify to accept optional onMastraEvent prop and hook it into UI update cycle)

### Testing Dependencies  - `/home/sam/mastra-governed-rag/cedar/components/chatComponents/FloatingCedarChat.tsx` (same)

- `/home/sam/mastra-governed-rag/cedar/components/chatComponents/SidePanelCedarChat.tsx` (same)

- **DEP-020**: `vitest@^3.2.4` - Unit test framework (already installed)  - `/home/sam/mastra-governed-rag/cedar/clients/roadmapStreamClient.ts` (new file)

- **DEP-021**: `@testing-library/react@^16.3.0` - React component testing (already installed)

- **DEP-022**: `playwright@^1.55.1` - E2E testing (already installed)  exact streaming client signature (frontend TypeScript):

- **DEP-023**: `msw` - API mocking library (may need installation: `npm install -D msw`)

  ```ts

## 5. Files

  // cedar/clients/roadmapStreamClient.ts

  ```ts
  export function connectRoadmapStream(opts: { jwt: string; threadId?: string; onEvent: (evt: any) => void; onError?: (err: Error) => void }) : { close: () => void }

  ```

### New Files to Create

  - Implementation: create EventSource-like connection using Fetch + ReadableStream, parse lines emitted by `src/utils/streamUtils.ts` bridge (data-only event lines), JSON.parse each `data: ...` chunk and call onEvent.

- **FILE-001**: `/app/api/chat/resume/route.ts` - Resume endpoint for HITL workflows (POST handler with streaming support)

- **FILE-002**: `/src/mastra/workflows/cedar-chat.workflow.ts` - Consolidated Cedar-compatible chat workflow  validation:

- **FILE-003**: `/app/cedar-os/layout.tsx` - Cedar provider wrapper component

- **FILE-004**: `/docs/examples/cedar-chat-example.md` - Cedar integration usage examples  - Unit tests for parser utility to parse data-only SSE chunks

- **FILE-005**: `/docs/examples/hitl-workflow-example.md` - Human-in-the-loop workflow documentation  - Dev server manual test: open Cedar UI and trigger a chat/stream; observe UI events

- **FILE-006**: `/docs/cedar-integration.md` - Comprehensive Cedar integration guide

- **FILE-007**: `/scripts/setup-cedar-dev.sh` - Development environment setup script---

- **FILE-008**: `/__tests__/api/chat/resume.test.ts` - Unit tests for resume endpoint

- **FILE-009**: `/src/mastra/workflows/__tests__/cedar-chat.test.ts` - Unit tests for Cedar chat workflow## PHASE 4 — Tests, Observability, and Security (completion criteria: tests passing, basic metrics/logs in workflow log)

- **FILE-010**: `/tests/integration/cedar-integration.test.ts` - Integration tests for full Cedar flow

- PH-4-TASK-1 (REQ-401)

### Files to Modify

  title: "Unit & Integration Tests"

- **FILE-011**: `/app/api/chat/route.ts` - Add Cedar workflow routing and ActionSchema support

- **FILE-012**: `/app/cedar-os/page.tsx` - Remove direct MastraClient usage  description: Create vitest tests for the new schemas, routes, and the `connectRoadmapStream` parser. Add integration test that runs productRoadmap workflow with sample input.

- **FILE-013**: `/src/mastra/index.ts` - Register cedar-chat workflow in workflows object

- **FILE-014**: `/lib/mastra/mastra-client.ts` - Add environment variable validation  files:

- **FILE-015**: `.env.example` - Add NEXT_PUBLIC_MASTRA_URL and document all Cedar variables

- **FILE-016**: `/docs/architecture.md` - Add Cedar-Mastra integration architecture section  - `src/mastra/workflows/__tests__/productRoadmap.spec.ts`

- **FILE-017**: `/README.md` - Update with Cedar setup instructions  - `app/api/roadmap/__tests__/sync.route.spec.ts`

- **FILE-018**: `/app/cedar-os/AGENTS.md` - Document Cedar integration implementation  - `cedar/clients/__tests__/roadmapStreamClient.spec.ts`

- **FILE-019**: `/CHANGELOG.md` - Add entry for Cedar integration feature

- **FILE-020**: `next.config.mjs` - Add environment variable validation  validation:



### Files to Deprecate

- Must use `npx vitest` to run vitest tests.

- **FILE-021**: `/src/mastra/workflows/chatWorkflow.ts` - Mark as deprecated, add comment linking to cedar-chat.workflow.ts- PH-4-TASK-2 (REQ-402)

- **FILE-022**: `/src/mastra/workflows/chatWorkflow1.ts` - Mark as deprecated, add comment linking to cedar-chat.workflow.ts

  title: "Logging & Langfuse tracing"

## 6. Testing

- - Must use `npx vitest` to run vitest tests.

  description: Ensure `productRoadmap` workflow emits `logStepStart`, `logStepEnd`, and `logError` calls consistent with existing `chatWorkflow` conventions. Produce at least one dashboard-friendly log line when sync endpoint is invoked.

### Unit Tests

  files to update: `src/mastra/workflows/productRoadmap.workflow.ts` and `src/mastra/workflows/WorkflowDecorators.ts` if needed

- **TEST-001**: `/app/api/chat/resume/route.ts` - Test resume endpoint POST handler

  - Test valid runId returns 200 with workflow result  validation: Check `logs/workflow.log` for entries after an end-to-end test run

  - Test invalid runId returns 404 with error message

  - Test expired JWT returns 401 unauthorized- PH-4-TASK-3 (REQ-403)

  - Test missing required fields returns 400 validation error

  - Test streaming response returns proper SSE format  title: "Security Review Checklist"

  - Test non-streaming response returns JSON format

  description: Add a checklist file `/plan/security-checklist-cedar-mastra-integration-1.md` that the CI will verify. Include JWT validation, role/tag enforcement at vector-query, and no client-exposed secrets.

- **TEST-002**: `/src/mastra/workflows/cedar-chat.workflow.ts` - Test Cedar chat workflow

  - Test workflow accepts valid input schema  validation: Ensure CI linter or custom script verifies presence of JWT validation calls and that no `NEXT_PUBLIC_` variables are added.

  - Test workflow returns valid output schema

  - Test workflow handles missing optional fields---

  - Test workflow emits streaming events when controller provided

  - Test workflow includes ActionSchema in output when agent generates it## Rollout & Acceptance Criteria (deterministic pass/fail rules)

  - Test workflow logs steps with logStepStart/logStepEnd

- Unit & integration tests added for all new code, run with `npm test`.

- **TEST-003**: `/lib/mastra/mastra-client.ts` - Test client factory- TypeScript typecheck passes (`npx tsc --noEmit`).

  - Test createMastraClient() without token returns client with no auth header- End-to-end smoke: Start dev server `npm run dev` and run the curl POST to `/api/roadmap/sync` returning status 'ok'.

  - Test createMastraClient(token) returns client with Authorization header- SSE smoke: run a curl command against the stream endpoint and confirm the stream emits parseable JSON objects with `type: 'mastra_event'`.

  - Test getMastraBaseUrl() returns MASTRA_BASE_URL env var if set- Logs: `logs/workflow.log` contains `productRoadmap` workflow start/finish events.

  - Test getMastraBaseUrl() falls back to localhost:4111 if env var not set

---

### Integration Tests

## Machine-parsable Task List (JSON)

- **TEST-004**: Full Cedar chat flow integration test

  - Test Cedar component can send message through /api/chat```json

  - Test streaming response is received and parsed correctly{

  - Test ActionSchema events trigger state updates  "plan_id": "feature-cedar-mastra-integration-1",

  - Test error events are handled gracefully  "phases": [

  - Test JWT authentication works end-to-end    {"id":"PH1","tasks":["REQ-101","REQ-102","REQ-103"]},

    {"id":"PH2","tasks":["REQ-201","REQ-202","REQ-203"]},

- **TEST-005**: Human-in-the-loop workflow integration test    {"id":"PH3","tasks":["REQ-301","REQ-302"]},

  - Test workflow pauses at waitForInput step    {"id":"PH4","tasks":["REQ-401","REQ-402","REQ-403"]}

  - Test resume endpoint successfully resumes paused workflow  ]

  - Test resume with approved=true continues workflow}

  - Test resume with approved=false cancels workflow```

  - Test concurrent resume attempts return 409 conflict

---

### End-to-End Tests

## Automated Verification Commands

- **TEST-006**: Cedar UI to Mastra agent E2E test (Playwright)

  - User sends message in Cedar chat component- Typecheck: `npx tsc --noEmit`

  - Message is routed through /api/chat endpoint- Run unit tests: `npm test -- -w 1`

  - Workflow executes and streams response- Smoke sync endpoint (replace <JWT>):

  - Response appears in Cedar UI in real-time

  - ActionSchema updates trigger UI state changes```bash

curl -X POST "<http://localhost:3000/api/roadmap/sync>" -H "Content-Type: application/json" -d '{"jwt":"<JWT>","canvasState":{}}'

- **TEST-007**: HITL workflow E2E test (Playwright)```

  - User triggers action requiring approval

  - Workflow pauses and displays approval prompt- Smoke stream endpoint (replace <JWT>):

  - User clicks approve button

  - Resume endpoint called with approval data```bash

  - Workflow continues and completescurl --no-buffer -N -X POST "<http://localhost:3000/api/roadmap/stream>" -H "Content-Type: application/json" -d '{"jwt":"<JWT>","prompt":"hello"}'

  - Final result displayed in UI```



### Performance Tests---



- **TEST-008**: Load test chat endpoint## Notes, Assumptions, and Next Steps

  - Send 100 concurrent requests to /api/chat

  - Verify all requests complete within 60 seconds- ASSUMPTION-1: `lib/auth.ts` exposes a JWT verification function named `verifyJwt` or similar; if the name differs, substitute the exported name. The plan points to `lib/auth.ts` as canonical auth.

  - Verify no workflow state corruption- ASSUMPTION-2: Mastra client in `lib/mastra/mastra-client.ts` exposes workflow execution methods (e.g., `client.executeWorkflow` or `client.workflow(...)`). If names differ, adapt accordingly.

  - Measure average response time- NEXT-STEPS: Implement PHASE 1 tasks in order, run typecheck, then PHASE 2 and PHASE 3 in parallel where possible. PHASE 4 is final verification.



- **TEST-009**: Streaming latency test---

  - Measure first byte latency (target: <100ms)

  - Measure chunk emission frequency (target: <50ms between chunks)EOF

  - Verify smooth UI updates during streaming  ]

}

### Validation Tests```



- **TEST-010**: Schema validation tests---

  - Test Zod schemas reject invalid inputs

  - Test TypeScript types match Zod schemas## Automated Verification Commands

  - Test all API endpoints validate requests

  - Test workflows validate input/output data- Typecheck: `npx vitest run`

- Run unit tests: `npx vitest run -- -w 1`

## 7. Risks & Assumptions- Smoke sync endpoint:

### High Priority Risks

  ```bash
  curl -X POST "http://localhost:3000/api/roadmap/sync" -H "Content-Type: application/json" -d '{"jwt":"<JWT>","canvasState":{}}'
  ```

- **RISK-001**: **Breaking existing RAG workflows during chat API modifications**- Smoke stream endpoint:

  - **Mitigation**: Create separate cedar-chat workflow, add routing logic, extensive testing of both workflows

  - **Contingency**: Rollback plan ready, feature flag to disable Cedar integration

  ```bash
  curl --no-buffer -N -X POST "http://localhost:3000/api/roadmap/stream" -H "Content-Type: application/json" -d '{"jwt":"<JWT>","prompt":"hello"}'
  ```

- **RISK-002**: **JWT token expiration during long-running workflows**---

  - **Mitigation**: Validate token expiration before starting stream, implement token refresh mechanism

  - **Contingency**: Return early error if token expires within 60 seconds## Notes, Assumptions, and Next Steps

- **RISK-003**: **Streaming connection loss mid-response**- ASSUMPTION-1: `lib/auth.ts` exposes a JWT verification function named `verifyJwt` or similar; if the name differs, substitute the exported name. The plan points to `lib/auth.ts` as canonical auth.

  - **Mitigation**: Implement abort detection, cleanup on disconnect, client-side reconnection- ASSUMPTION-2: Mastra client in `lib/mastra/mastra-client.ts` exposes workflow execution methods (e.g., `client.executeWorkflow` or `client.workflow(...)`). If names differ, adapt accordingly.

  - **Contingency**: Fall back to non-streaming mode on repeated failures- NEXT-STEPS: Implement PHASE 1 tasks in order, run typecheck, then PHASE 2 and PHASE 3 in parallel where possible. PHASE 4 is final verification.

- **RISK-004**: **Workflow state corruption from concurrent resume attempts**---

  - **Mitigation**: Implement workflow lock using Map<runId, boolean>, return 409 on concurrent access

  - **Contingency**: Workflow state recovery mechanism, replay from last checkpointEOF

### Medium Priority Risks

- **RISK-005**: **Performance degradation with high concurrent requests**
  - **Mitigation**: Load testing before production, connection pooling, rate limiting
  - **Contingency**: Horizontal scaling, queue-based processing

- **RISK-006**: **Cedar provider configuration errors**
  - **Mitigation**: Environment variable validation at build time, clear error messages
  - **Contingency**: Fallback to default configuration, detailed debugging logs

- **RISK-007**: **Incompatibility between Cedar and Mastra versions**
  - **Mitigation**: Pin exact versions in package.json, integration testing
  - **Contingency**: Version compatibility matrix, upgrade/downgrade procedures

### Low Priority Risks

- **RISK-008**: **Documentation becomes outdated quickly**
  - **Mitigation**: Link docs to code, automated documentation generation where possible
  - **Contingency**: Regular documentation review cycle, community feedback

### Assumptions

- **ASSUMPTION-001**: Mastra backend server is reliable and available during development
- **ASSUMPTION-002**: Cedar-OS v0.1.21 API is stable and won't change during implementation
- **ASSUMPTION-003**: JWT_SECRET is consistent across frontend and backend
- **ASSUMPTION-004**: Next.js 15.5.4 App Router patterns remain stable
- **ASSUMPTION-005**: Qdrant and LibSQL services are running and accessible
- **ASSUMPTION-006**: Development environment has Node.js >= 20.9.0
- **ASSUMPTION-007**: Existing test suite is comprehensive and accurate
- **ASSUMPTION-008**: Team members are familiar with Mastra workflow patterns
- **ASSUMPTION-009**: No major security vulnerabilities in dependencies
- **ASSUMPTION-010**: Network latency between services is negligible in development

## 8. Related Specifications / Further Reading

### Internal Documentation

- [Technical Spike Document](/docs/spikes/backend-cedar-mastra-integration-spike.md) - Analysis and gap identification
- [Architecture Specification](/spec/spec-architecture-cedar-mastra-integration.md) - Complete requirements and interfaces
- [AGENTS.md](/AGENTS.md) - Project architecture overview
- [/docs/architecture.md](/docs/architecture.md) - System architecture documentation
- [/docs/security.md](/docs/security.md) - Security model and authentication
- [/app/cedar-os/AGENTS.md](/app/cedar-os/AGENTS.md) - Cedar OS integration details
- [/src/mastra/workflows/AGENTS.md](/src/mastra/workflows/AGENTS.md) - Workflow patterns

### External Resources

- [Cedar-OS Documentation](https://cedar-os.com/docs) - Cedar framework reference
- [Cedar-Mastra Integration Guide](https://cedar-os.com/docs/mastra-integration) - Official integration patterns
- [Mastra Documentation](https://mastra.ai/docs) - Mastra framework reference
- [Mastra Workflows](https://mastra.ai/docs/workflows/overview) - Workflow orchestration
- [Mastra Streaming](https://mastra.ai/blog/nested-streaming-support) - Streaming implementation
- [Next.js App Router](https://nextjs.org/docs/app) - Next.js routing patterns
- [Server-Sent Events Spec](https://html.spec.whatwg.org/multipage/server-sent-events.html) - SSE protocol
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725) - JWT security

---

## Implementation Checklist

### Pre-Implementation

- [ ] Review technical spike document
- [ ] Review architecture specification
- [ ] Verify all dependencies are installed
- [ ] Ensure Mastra backend is running (port 4111)
- [ ] Ensure Qdrant is running (port 6333)
- [ ] Verify JWT_SECRET is configured

### Phase 1 Completion Criteria

- [ ] Resume endpoint responds to POST requests
- [ ] Resume endpoint validates JWT tokens
- [ ] Resume endpoint supports streaming and non-streaming
- [ ] Cedar provider wrapper is configured in layout
- [ ] Direct MastraClient usage removed from components
- [ ] Environment variables documented in .env.example

### Phase 2 Completion Criteria

- [ ] cedar-chat.workflow.ts created and functional
- [ ] All workflow steps have logging
- [ ] Workflow registered in Mastra instance
- [ ] Chat API route uses cedar-chat workflow
- [ ] Fallback to governed-rag-answer works
- [ ] ActionSchema output is supported

### Phase 3 Completion Criteria

- [ ] Chat API route detects Cedar vs RAG requests
- [ ] ActionSchema events emitted in streaming
- [ ] Connection abort detection implemented
- [ ] Proper error handling for all edge cases
- [ ] CORS headers configured

### Phase 4 Completion Criteria

- [ ] All unit tests written and passing
- [ ] All integration tests written and passing
- [ ] E2E tests written and passing
- [ ] No regressions in existing tests
- [ ] Code coverage meets 80% threshold

### Phase 5 Completion Criteria

- [ ] Architecture documentation updated
- [ ] Cedar integration guide created
- [ ] Example documentation complete
- [ ] JSDoc comments added
- [ ] README updated
- [ ] Deprecated files marked

### Phase 6 Completion Criteria

- [ ] All environment variables documented
- [ ] Environment validation implemented
- [ ] Development setup script created
- [ ] Deployment documentation updated

### Post-Implementation

- [ ] Code review completed
- [ ] All tests passing in CI/CD
- [ ] Documentation reviewed
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Merge to develop branch
- [ ] Deploy to staging environment
- [ ] Verify integration in staging
- [ ] Update implementation plan status to "Completed"

---

**Implementation Status**: ![Status: Planned](https://img.shields.io/badge/status-Planned-blue)
**Estimated Completion**: October 7, 2025
**Last Updated**: 2025-09-30
