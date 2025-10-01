---
title: Cedar-OS and Mastra AI Backend Integration Architecture Specification
version: 1.0
date_created: 2025-09-30
last_updated: 2025-09-30
owner: Backend Team
tags: [architecture, cedar-os, mastra, integration, api, streaming, workflows]
---

# Introduction

This specification defines the architectural requirements, constraints, and interfaces for integrating Cedar-OS frontend components with Mastra AI backend orchestration in the Governed RAG application. The integration must support real-time streaming, human-in-the-loop workflows, JWT authentication, and state synchronization between frontend and backend systems.

## 1. Purpose & Scope

**Purpose**: Establish a standardized integration pattern between Cedar-OS (frontend UI framework) and Mastra (AI agent orchestration) that enables seamless communication, streaming responses, workflow management, and state synchronization.

**Scope**: This specification covers:
- API endpoint structure and contracts
- Authentication flow between systems
- Streaming response patterns
- Workflow registration and execution
- State management and synchronization
- Error handling and resilience patterns

**Intended Audience**: Backend developers, frontend developers, AI engineers, and system architects working on the Governed RAG application.

**Assumptions**:
- Next.js 15.5.4 App Router is the application framework
- Cedar-OS v0.1.21 is installed and configured
- Mastra Core v0.18.0 is the AI orchestration layer
- Node.js >= 20.9.0 runtime environment
- JWT-based authentication is the security model

## 2. Definitions

**Cedar-OS**: Frontend UI framework providing chat components, state management, and agent interaction patterns.

**Mastra**: AI agent orchestration framework that manages workflows, agents, tools, and memory.

**SSE**: Server-Sent Events - HTTP streaming protocol for server-to-client real-time communication.

**HITL**: Human-In-The-Loop - Workflow pattern where agent execution pauses for human approval or input.

**Workflow**: A Mastra primitive that orchestrates multiple steps, agents, and tools in a directed acyclic graph.

**Agent**: A Mastra primitive representing a single-responsibility AI reasoning unit with specific instructions and tools.

**MastraClient**: JavaScript/TypeScript client library for communicating with Mastra backend API.

**Provider Config**: Cedar-OS configuration object defining how the frontend communicates with backend services.

**Action Schema**: Structured output format for agent responses that trigger UI state updates.

**Resume Endpoint**: API endpoint that allows paused workflows to continue execution with human-provided data.

**Stream Controller**: Readable stream controller used to emit Server-Sent Events in API routes.

## 3. Requirements, Constraints & Guidelines

### Functional Requirements

- **REQ-001**: The system SHALL provide a `/api/chat` endpoint that accepts chat messages and returns streaming responses
- **REQ-002**: The system SHALL provide a `/api/chat/resume` endpoint for resuming paused workflows
- **REQ-003**: All API endpoints SHALL validate JWT authentication tokens before processing requests
- **REQ-004**: Workflows SHALL support streaming responses using Server-Sent Events (SSE) protocol
- **REQ-005**: Cedar components SHALL communicate with backend exclusively through API routes (no direct Mastra client usage in components)
- **REQ-006**: The system SHALL support structured output format (ActionSchema) for UI state updates
- **REQ-007**: Chat workflows SHALL be registered in the Mastra instance with unique identifiers
- **REQ-008**: API routes SHALL use the Mastra client factory pattern with user-specific authentication tokens
- **REQ-009**: The system SHALL provide a Cedar provider wrapper that configures all backend communication
- **REQ-010**: Streaming responses SHALL handle errors gracefully and emit error events to the client

### Security Requirements

- **SEC-001**: All API endpoints SHALL verify JWT tokens using the configured JWT_SECRET
- **SEC-002**: User authentication tokens SHALL be passed from Cedar provider through API routes to Mastra backend
- **SEC-003**: Service-level authentication SHALL use a separate JWT_TOKEN for backend-to-backend communication
- **SEC-004**: JWT tokens SHALL contain role and tenant claims for access control
- **SEC-005**: Expired or invalid tokens SHALL result in HTTP 401 Unauthorized responses
- **SEC-006**: Sensitive data in streaming responses SHALL be filtered according to user permissions

### Performance Requirements

- **PERF-001**: Chat API endpoints SHALL have a maximum duration of 60 seconds
- **PERF-002**: Streaming responses SHALL emit data within 50ms chunks for smooth UI updates
- **PERF-003**: Resume endpoints SHALL retrieve and resume workflows within 2 seconds
- **PERF-004**: The system SHALL support concurrent workflow executions without blocking

### Constraints

- **CON-001**: API routes MUST NOT use default exports (Next.js App Router requirement)
- **CON-002**: Streaming responses MUST use `ReadableStream` API with proper encoder configuration
- **CON-003**: Workflow IDs MUST be unique across the Mastra instance
- **CON-004**: Cedar provider configuration MUST use environment variables for base URL configuration
- **CON-005**: Direct MastraClient usage MUST NOT occur in React components
- **CON-006**: All schemas MUST use Zod for runtime validation
- **CON-007**: Workflow steps MUST have unique IDs within their workflow
- **CON-008**: API routes MUST set proper CORS headers for Cedar frontend access

### Guidelines

- **GUD-001**: Use `createMastraClient(token)` factory function for all Mastra client instantiation
- **GUD-002**: Prefer `chatWorkflow1.ts` pattern (simple with ActionSchema) over complex event emission
- **GUD-003**: Implement structured logging using `logStepStart`, `logStepEnd`, and `logError`
- **GUD-004**: Use Zod schemas to define input/output contracts for all workflows and API endpoints
- **GUD-005**: Implement error boundaries in Cedar components to handle streaming failures
- **GUD-006**: Document all workflow inputs and outputs with JSDoc comments
- **GUD-007**: Use consistent naming: `workflow-name.workflow.ts` for workflow files
- **GUD-008**: Separate concerns: API routes orchestrate, workflows execute, agents reason

### Integration Patterns

- **PAT-001**: Cedar Provider → API Route → Mastra Workflow → Agent (no direct Cedar-to-Mastra communication)
- **PAT-002**: Use Server-Sent Events for streaming, not WebSockets
- **PAT-003**: Implement resume pattern for human-in-the-loop workflows
- **PAT-004**: Use structured output (ActionSchema) for UI state synchronization
- **PAT-005**: Centralize Mastra client configuration in `/lib/mastra/mastra-client.ts`

## 4. Interfaces & Data Contracts

### 4.1 Cedar Provider Configuration Interface

```typescript
interface CedarProviderConfig {
  provider: 'mastra';
  baseURL: string;           // e.g., 'http://localhost:3000'
  chatPath: string;          // e.g., '/api/chat'
  resumePath: string;        // e.g., '/api/chat/resume'
  apiKey?: string;           // Optional for additional auth
}
```

### 4.2 Chat API Request Schema

```typescript
// POST /api/chat
{
  jwt: string;               // Required: User authentication token
  question: string;          // Required: User's chat message
  context?: any;             // Optional: Additional context from Cedar
  temperature?: number;      // Optional: LLM temperature (0.0-1.0)
  maxTokens?: number;        // Optional: Maximum response tokens
  stream?: boolean;          // Optional: Enable streaming (default: true)
}
```

### 4.3 Chat API Response Schema (Streaming)

```typescript
// Server-Sent Events format
event: message
data: { "content": "partial response text..." }

event: message
data: { "content": "more text..." }

event: action
data: {
  "type": "action",
  "stateKey": "nodes",
  "setterKey": "addNode",
  "args": [{ "id": "node-1", "data": {...} }]
}

event: done
data: { "usage": { "promptTokens": 100, "completionTokens": 200 } }

event: error
data: { "error": "Error message", "code": "ERROR_CODE" }
```

### 4.4 Resume API Request Schema

```typescript
// POST /api/chat/resume
{
  jwt: string;               // Required: User authentication token
  runId: string;             // Required: Workflow run identifier
  stepPath: string[][];      // Required: Path to the paused step
  resumeData: {              // Required: Data to resume with
    approved?: boolean;
    feedback?: string;
    [key: string]: any;
  };
  stream?: boolean;          // Optional: Enable streaming (default: true)
}
```

### 4.5 Workflow Input Schema

```typescript
// Workflow input contract
{
  prompt: string;            // Required: User message
  context?: any;             // Optional: Cedar context
  temperature?: number;      // Optional: LLM temperature
  maxTokens?: number;        // Optional: Token limit
  streamController?: any;    // Optional: Stream controller for SSE
  resourceId?: string;       // Optional: Memory resource ID
  threadId?: string;         // Optional: Conversation thread ID
}
```

### 4.6 Workflow Output Schema

```typescript
// Workflow output contract
{
  content: string;           // Required: Generated response text
  action?: {                 // Optional: UI state update action
    type: 'action';
    stateKey: string;
    setterKey: string;
    args: any[];
  };
  usage?: {                  // Optional: Token usage statistics
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

### 4.7 Action Schema for UI State Updates

```typescript
// Structured output for Cedar state management
{
  type: 'action';
  stateKey: string;          // Cedar state key (e.g., 'nodes', 'edges')
  setterKey: string;         // Setter function name (e.g., 'addNode')
  args: any[];               // Arguments to pass to setter
}
```

### 4.8 MastraClient Factory Interface

```typescript
// Factory function signature
function createMastraClient(token?: string): MastraClient

// Returns configured client with:
interface MastraClient {
  baseUrl: string;
  headers: {
    Authorization?: string;  // Bearer token if provided
  };
}
```

## 5. Acceptance Criteria

### Chat Endpoint

- **AC-001**: Given a valid JWT token and question, When POST /api/chat is called, Then the system SHALL return a streaming SSE response with status 200
- **AC-002**: Given an invalid JWT token, When POST /api/chat is called, Then the system SHALL return HTTP 401 with error message "Invalid or expired token"
- **AC-003**: Given a missing question parameter, When POST /api/chat is called, Then the system SHALL return HTTP 400 with validation error details
- **AC-004**: Given a valid request with stream=true, When POST /api/chat is called, Then the response SHALL include Content-Type: text/event-stream header
- **AC-005**: Given a valid request, When the workflow completes successfully, Then the final SSE event SHALL be "done" with usage statistics

### Resume Endpoint

- **AC-006**: Given a valid runId and resumeData, When POST /api/chat/resume is called, Then the system SHALL retrieve the paused workflow and resume execution
- **AC-007**: Given an invalid runId, When POST /api/chat/resume is called, Then the system SHALL return HTTP 404 with error "Workflow run not found"
- **AC-008**: Given valid resume parameters with stream=true, When the workflow resumes, Then responses SHALL stream via SSE format
- **AC-009**: Given a workflow that cannot be resumed, When POST /api/chat/resume is called, Then the system SHALL return HTTP 400 with descriptive error message

### Cedar Integration

- **AC-010**: Given a Cedar component within CedarCopilot provider, When a user sends a message, Then the message SHALL be routed through /api/chat endpoint
- **AC-011**: Given a streaming response from Mastra, When Cedar receives SSE events, Then the UI SHALL update in real-time with partial responses
- **AC-012**: Given an ActionSchema response, When Cedar receives the action event, Then the specified state setter SHALL be invoked with provided arguments
- **AC-013**: Given a paused workflow requiring human input, When the user approves/rejects, Then the resume endpoint SHALL be called with user's decision

### Authentication Flow

- **AC-014**: Given a user JWT token in the request body, When API routes call Mastra, Then the token SHALL be passed via createMastraClient(token)
- **AC-015**: Given an expired JWT token, When any API endpoint validates it, Then the system SHALL return HTTP 401 before calling Mastra
- **AC-016**: Given a JWT with missing role claims, When validation occurs, Then the system SHALL return HTTP 401 with error "Invalid user claims"

### Workflow Registration

- **AC-017**: Given a new workflow definition, When Mastra instance initializes, Then the workflow SHALL be registered with a unique ID
- **AC-018**: Given a registered workflow, When queried via mastra.getWorkflows(), Then the workflow SHALL be retrievable by its ID
- **AC-019**: Given multiple workflows with the same ID, When Mastra instance initializes, Then an error SHALL be thrown indicating duplicate workflow ID

### Error Handling

- **AC-020**: Given a workflow execution error, When streaming is enabled, Then an SSE error event SHALL be emitted before closing the stream
- **AC-021**: Given a network timeout during workflow execution, When maxDuration is exceeded, Then the API route SHALL terminate with HTTP 504
- **AC-022**: Given an invalid Zod schema validation, When parsing input data, Then the system SHALL return HTTP 400 with detailed validation errors

## 6. Test Automation Strategy

### Test Levels

**Unit Tests**:
- Mastra client factory function
- Workflow step logic
- Schema validation
- Authentication helpers
- Stream encoding utilities

**Integration Tests**:
- Chat API endpoint with mock Mastra instance
- Resume API endpoint with workflow state management
- JWT verification flow
- Streaming response format
- Error handling paths

**End-to-End Tests**:
- Full Cedar → API → Mastra → Agent flow
- Human-in-the-loop workflow pause and resume
- Multi-step workflow execution
- Concurrent request handling

### Frameworks

- **Vitest**: Unit and integration testing framework
- **@testing-library/react**: Cedar component testing
- **msw**: Mock Service Worker for API mocking
- **Playwright**: End-to-end browser testing
- **supertest**: HTTP assertion library for API routes

### Test Data Management

- Use factories for generating valid JWT tokens (helper functions in `/lib/jwt-utils`)
- Mock Mastra client responses using MSW handlers
- Create reusable workflow fixtures for testing different scenarios
- Isolate test database instances for workflow state storage

### CI/CD Integration

- Run unit tests on every commit (GitHub Actions)
- Run integration tests on pull requests
- Run E2E tests on staging deployment
- Generate coverage reports and enforce 80% minimum threshold
- Fail builds on ESLint or TypeScript errors

### Coverage Requirements

- Minimum 80% code coverage for `/lib/mastra/` directory
- Minimum 90% coverage for API route handlers
- 100% coverage for authentication and security functions
- Branch coverage for all error handling paths

### Performance Testing

- Load test chat endpoint with 100 concurrent requests
- Measure streaming latency (target: <100ms first byte)
- Test workflow execution under memory constraints
- Monitor token usage and cost per request

## 7. Rationale & Context

### Why Cedar-OS?

Cedar-OS provides production-ready UI components for AI chat interfaces with built-in support for streaming, state management, and human-in-the-loop patterns. Using Cedar reduces frontend development time and ensures consistent UX patterns.

### Why Mastra?

Mastra offers a robust AI orchestration layer with workflow management, agent composition, tool integration, and memory persistence. It abstracts the complexity of LLM interactions and provides a unified interface for multiple AI providers.

### Why SSE over WebSockets?

Server-Sent Events provide simpler implementation for unidirectional server-to-client streaming, better compatibility with HTTP infrastructure (proxies, load balancers), and automatic reconnection handling. WebSockets add unnecessary complexity for this use case.

### Why Workflow Registration Pattern?

Registering workflows in the Mastra instance (rather than importing directly in API routes) enables:
- Centralized workflow management
- Runtime workflow discovery and introspection
- Consistent error handling and logging
- Easier testing and mocking

### Why Factory Pattern for MastraClient?

The factory pattern centralizes client configuration, ensures consistent authentication header injection, and simplifies testing by providing a single mocking point. It prevents scattered client instantiation throughout the codebase.

### Why ActionSchema for UI Updates?

Structured output enables deterministic UI state updates, reduces frontend logic complexity, supports undo/redo patterns, and provides a clear contract between backend agents and frontend components.

## 8. Dependencies & External Integrations

### External Systems

- **EXT-001**: Mastra Backend Server - Runs on port 4111, provides agent execution and workflow orchestration. Must be accessible from Next.js API routes.

### Third-Party Services

- **SVC-001**: OpenAI API - Required for LLM inference, embeddings, and chat completions. Must provide API key via OPENAI_API_KEY environment variable.
- **SVC-002**: Google Gemini API - Alternative LLM provider for cost-effective inference. Requires GOOGLE_GENERATIVE_AI_API_KEY environment variable.
- **SVC-003**: Langfuse - Optional observability service for tracing agent executions and monitoring token usage. Requires public and secret keys.

### Infrastructure Dependencies

- **INF-001**: Node.js Runtime - Version >= 20.9.0 required for ES modules support and performance optimizations.
- **INF-002**: Next.js App Router - Version 15.5.4, requires specific routing patterns and API route structure.
- **INF-003**: Qdrant Vector Database - Runs on port 6333, stores document embeddings for RAG workflows.
- **INF-004**: LibSQL/PostgreSQL Storage - Persistent storage for workflow state, agent memory, and conversation history.

### Data Dependencies

- **DAT-001**: JWT Secret - Shared secret for token signing/verification, must be consistent across frontend and backend.
- **DAT-002**: User Claims Schema - JWT payload must include `roles: string[]` and `tenant: string` for access control.
- **DAT-003**: Workflow State - Persistent storage of workflow run IDs and step paths for resume functionality.

### Technology Platform Dependencies

- **PLT-001**: Cedar-OS Framework - Version 0.1.21, provides UI components and provider patterns. Must be compatible with React 19.1.1.
- **PLT-002**: Mastra Core - Version 0.18.0, provides workflow orchestration primitives. Must support streaming and auth middleware.
- **PLT-003**: Zod Validation Library - Version 4.1.11, required for schema validation across all interfaces.
- **PLT-004**: TypeScript - Version 5.9.2 with strict mode enabled, required for type safety guarantees.

### Compliance Dependencies

- **COM-001**: GDPR Data Processing - User conversations and agent responses must be anonymizable and deletable on request.
- **COM-002**: SOC 2 Audit Logging - All agent interactions must be logged with timestamps, user IDs, and action types.
- **COM-003**: JWT Expiration - Tokens must expire within 24 hours to minimize security risk window.

## 9. Examples & Edge Cases

### Example 1: Basic Chat Request

```typescript
// Client-side Cedar component
import { useCedarChat } from 'cedar-os';

function ChatComponent() {
  const { sendMessage } = useCedarChat();
  
  const handleSubmit = async (message: string) => {
    await sendMessage(message);
    // Cedar handles streaming response automatically
  };
}
```

```typescript
// API Route: /app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mastra } from '@/src/mastra';
import { createMastraClient } from '@/lib/mastra/mastra-client';
import { z } from 'zod';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const ChatRequestSchema = z.object({
  jwt: z.string().min(1),
  question: z.string().min(1),
  stream: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jwt, question, stream } = ChatRequestSchema.parse(body);
    
    // Validate JWT (implementation details omitted)
    const claims = await verifyJWT(jwt);
    
    if (stream) {
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            const workflow = mastra.getWorkflows()['cedar-chat'];
            const run = await workflow.createRunAsync();
            
            const result = await run.start({
              inputData: {
                prompt: question,
                streamController: controller,
              },
            });
            
            controller.close();
          } catch (error) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
            );
            controller.close();
          }
        },
      });
      
      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Non-streaming response
      const workflow = mastra.getWorkflows()['cedar-chat'];
      const run = await workflow.createRunAsync();
      const result = await run.start({ inputData: { prompt: question } });
      
      return NextResponse.json(result);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Example 2: Human-in-the-Loop Resume Pattern

```typescript
// Workflow with pause step
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

const approvalStep = createStep({
  id: 'waitForApproval',
  inputSchema: z.object({ action: z.string() }),
  outputSchema: z.object({ approved: z.boolean(), feedback: z.string() }),
  execute: async ({ inputData, waitForInput }) => {
    // Pause workflow and wait for user input
    const userResponse = await waitForInput({
      prompt: `Approve this action: ${inputData.action}?`,
      schema: z.object({
        approved: z.boolean(),
        feedback: z.string(),
      }),
    });
    
    return userResponse;
  },
});
```

```typescript
// Resume API Route: /app/api/chat/resume/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { jwt, runId, stepPath, resumeData, stream } = body;
  
  // Validate JWT
  await verifyJWT(jwt);
  
  const workflow = mastra.getWorkflows()['cedar-chat'];
  const run = await workflow.getRunAsync(runId);
  
  if (stream) {
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const result = await run.resume({
          stepPath,
          resumeData,
        });
        
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(result)}\n\n`)
        );
        controller.close();
      },
    });
    
    return new Response(readable, {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }
  
  const result = await run.resume({ stepPath, resumeData });
  return NextResponse.json(result);
}
```

### Example 3: Structured Output for UI State Updates

```typescript
// Workflow with ActionSchema output
const chatStep = createStep({
  id: 'generateResponse',
  execute: async ({ inputData }) => {
    const response = await agent.generate([inputData.prompt], {
      experimental_output: z.object({
        content: z.string(),
        action: z.object({
          type: z.literal('action'),
          stateKey: z.string(),
          setterKey: z.string(),
          args: z.array(z.any()),
        }).optional(),
      }),
    });
    
    return response.object;
  },
});
```

```typescript
// Cedar component receiving action
import { useCedarChat, useCedarState } from 'cedar-os';

function RoadmapComponent() {
  const { messages } = useCedarChat();
  const { registerState } = useCedarState();
  
  const [nodes, setNodes] = useState([]);
  
  // Register state with Cedar for agent manipulation
  registerState('nodes', {
    addNode: (node) => setNodes([...nodes, node]),
    removeNode: (id) => setNodes(nodes.filter(n => n.id !== id)),
  });
  
  // Cedar automatically applies actions from agent responses
}
```

### Edge Case 1: JWT Expiration During Streaming

```typescript
// Scenario: Token expires mid-stream
// Solution: API route validates before starting stream

export async function POST(request: NextRequest) {
  const { jwt } = await request.json();
  
  try {
    const claims = await verifyJWT(jwt);
    const expiresIn = claims.exp - Date.now() / 1000;
    
    if (expiresIn < 60) {
      // Token expires in less than 60 seconds
      return NextResponse.json(
        { error: 'Token expires soon, please refresh' },
        { status: 401 }
      );
    }
    
    // Proceed with streaming
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}
```

### Edge Case 2: Workflow Not Found

```typescript
// Scenario: Requested workflow doesn't exist
// Solution: Graceful error handling

const workflow = mastra.getWorkflows()['non-existent-workflow'];

if (!workflow) {
  return NextResponse.json(
    { error: 'Workflow not found', workflowId: 'non-existent-workflow' },
    { status: 404 }
  );
}
```

### Edge Case 3: Streaming Connection Loss

```typescript
// Scenario: Client disconnects during streaming
// Solution: Detect closed connection and cleanup

const readable = new ReadableStream({
  async start(controller) {
    request.signal.addEventListener('abort', () => {
      console.log('Client disconnected, cleaning up...');
      controller.close();
    });
    
    // Stream workflow results
    try {
      // ... streaming logic
    } catch (error) {
      if (!request.signal.aborted) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
        );
      }
      controller.close();
    }
  },
});
```

### Edge Case 4: Large Response Exceeding Token Limits

```typescript
// Scenario: Agent response exceeds maxTokens
// Solution: Truncate gracefully with indicator

const chatStep = createStep({
  id: 'generateResponse',
  execute: async ({ inputData }) => {
    const maxTokens = inputData.maxTokens || 4096;
    
    const response = await agent.generate([inputData.prompt], {
      maxTokens,
    });
    
    if (response.usage.completionTokens >= maxTokens) {
      return {
        content: response.text + '\n\n[Response truncated due to length]',
        truncated: true,
        usage: response.usage,
      };
    }
    
    return {
      content: response.text,
      truncated: false,
      usage: response.usage,
    };
  },
});
```

### Edge Case 5: Concurrent Resume Attempts

```typescript
// Scenario: User clicks "Approve" multiple times
// Solution: Lock workflow run during resume

const resumeLocks = new Map<string, boolean>();

export async function POST(request: NextRequest) {
  const { runId, resumeData } = await request.json();
  
  if (resumeLocks.get(runId)) {
    return NextResponse.json(
      { error: 'Workflow is already being resumed' },
      { status: 409 }
    );
  }
  
  resumeLocks.set(runId, true);
  
  try {
    const workflow = mastra.getWorkflows()['cedar-chat'];
    const run = await workflow.getRunAsync(runId);
    const result = await run.resume({ resumeData });
    
    return NextResponse.json(result);
  } finally {
    resumeLocks.delete(runId);
  }
}
```

## 10. Validation Criteria

### Architecture Compliance

- **VAL-001**: All API routes MUST use the MastraClient factory pattern from `/lib/mastra/mastra-client.ts`
- **VAL-002**: No React components SHALL import or instantiate MastraClient directly
- **VAL-003**: All workflows MUST be registered in `/src/mastra/index.ts` before use
- **VAL-004**: Cedar provider configuration MUST be present in root layout or page wrapper
- **VAL-005**: All streaming endpoints MUST use ReadableStream API with proper Content-Type headers

### Security Validation

- **VAL-006**: All API routes MUST validate JWT tokens before processing requests
- **VAL-007**: JWT validation MUST check for required claims (roles, tenant)
- **VAL-008**: Expired tokens MUST result in HTTP 401 responses
- **VAL-009**: No secrets or API keys SHALL be exposed in client-side code
- **VAL-010**: All user input MUST be validated using Zod schemas

### Integration Validation

- **VAL-011**: Cedar components MUST successfully send messages through `/api/chat` endpoint
- **VAL-012**: Streaming responses MUST render in real-time in Cedar chat components
- **VAL-013**: ActionSchema responses MUST trigger correct state setter functions
- **VAL-014**: Resume endpoint MUST successfully pause and resume workflows
- **VAL-015**: Error events MUST be properly handled and displayed in Cedar UI

### Performance Validation

- **VAL-016**: First byte latency for streaming MUST be under 100ms
- **VAL-017**: API routes MUST complete within maxDuration timeout
- **VAL-018**: Concurrent requests MUST not cause workflow state corruption
- **VAL-019**: Memory usage MUST not exceed 512MB per workflow execution
- **VAL-020**: Token usage MUST be tracked and logged for cost monitoring

### Code Quality Validation

- **VAL-021**: TypeScript strict mode MUST pass without errors
- **VAL-022**: ESLint checks MUST pass with zero warnings
- **VAL-023**: All public functions MUST have JSDoc comments
- **VAL-024**: Test coverage MUST meet minimum thresholds (80% overall)
- **VAL-025**: All Zod schemas MUST have corresponding TypeScript types

## 11. Related Specifications / Further Reading

### Internal Documentation

- [AGENTS.md](/AGENTS.md) - Project architecture and component overview
- [/docs/architecture.md](/docs/architecture.md) - System architecture documentation
- [/docs/security.md](/docs/security.md) - Security model and authentication patterns
- [Technical Spike Document](/docs/spikes/backend-cedar-mastra-integration-spike.md) - Analysis and recommendations

### External Resources

- [Cedar-OS Documentation](https://cedar-os.com/docs) - Cedar framework reference
- [Cedar-Mastra Integration Guide](https://cedar-os.com/docs/mastra-integration) - Official integration patterns
- [Mastra Documentation](https://mastra.ai/docs) - Mastra framework reference
- [Mastra Workflows](https://mastra.ai/docs/workflows/overview) - Workflow orchestration guide
- [Mastra Streaming Support](https://mastra.ai/blog/nested-streaming-support) - Streaming implementation details
- [Next.js App Router](https://nextjs.org/docs/app) - Next.js routing documentation
- [Server-Sent Events Specification](https://html.spec.whatwg.org/multipage/server-sent-events.html) - SSE protocol reference
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725) - JSON Web Token security considerations
- [Zod Documentation](https://zod.dev/) - Schema validation library reference

---

**Document Status**: ✅ **APPROVED** - Ready for implementation

**Next Actions**:
1. Review specification with team leads
2. Create implementation tasks from requirements
3. Set up test infrastructure
4. Begin Phase 1 implementation (critical endpoints)
5. Schedule integration testing milestone

**Approval Required From**:
- [ ] Backend Lead
- [ ] Frontend Lead
- [ ] Security Team
- [ ] Architecture Review Board

**Implementation Timeline**: 5-7 days for full specification compliance
