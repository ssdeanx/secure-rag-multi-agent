# System Patterns

**Updated:** 2025-01-XX

## System Architecture

### High-Level Architecture

The system follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  Next.js 15.5.4 + React 19 + TypeScript + Tailwind v4  │
│  Public Website (/about, /blog, /docs, /contact)       │
│  Components: ChatInterface, AuthPanel, IndexingPanel    │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTP/S + JWT
┌─────────────────────────────────────────────────────────┐
│             API Layer (Next.js API Routes)               │
│     /api/chat | /api/index | /api/auth                  │
│     Route Handlers with JWT validation                   │
│     lib/mastra-client.ts Bridge (MANDATORY)             │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTP to Mastra Backend
┌─────────────────────────────────────────────────────────┐
│           Mastra Backend (Port 4111)                     │
│     apiRegistry.ts - Route Registration                  │
│     /chat (standard) | /chat/stream (SSE)               │
│     ai-tracing.ts - Langfuse Observability              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Mastra Orchestration Layer                  │
│    Workflows: governed-rag-answer, governed-rag-index,  │
│               research, report, chat                     │
│    16 Specialized Agents (Identity, Policy, etc.)       │
│    11 Tools: vector-query, web-scraper, jwt-auth, etc. │
│    10 Services: Authentication, Role, VectorQuery, etc. │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Data Storage Layer                      │
│  Qdrant 0.11.13 (vectors)                               │
│  LibSQL (dev: deep-research.db, vector-store.db)        │
│  PostgreSQL (prod: with pgvector)                       │
│  Redis (caching)                                         │
└─────────────────────────────────────────────────────────┘
```

### Security Pipeline Architecture

The 6-agent security pipeline ensures zero-trust validation:

```
User Query + JWT
      ↓
┌─────────────────┐
│ Identity Agent  │ → Validate JWT, extract role claims
└─────────────────┘
      ↓
┌─────────────────┐
│  Policy Agent   │ → Generate access filters based on role hierarchy
└─────────────────┘                (10 levels: public=10 → admin=100)
      ↓
┌─────────────────┐
│ Retrieve Agent  │ → Query Qdrant with security filters & role tags
└─────────────────┘
      ↓
┌─────────────────┐
│  Rerank Agent   │ → Score relevance with continued access validation
└─────────────────┘
      ↓
┌─────────────────┐
│ Answerer Agent  │ → Generate secure response with citations
└─────────────────┘
      ↓
┌─────────────────┐
│ Verifier Agent  │ → Final compliance check and audit log
└─────────────────┘
      ↓
Secure Response
```

## Key Technical Decisions

### Decision 1: Mastra 0.18 for AI Orchestration

**Context**: Need to coordinate multiple AI agents with different responsibilities across secure RAG, research, and content generation workflows

**Options Considered**:

- LangChain (complex, heavyweight, overkill for our needs)
- LlamaIndex (RAG-focused, limited multi-agent support)
- Custom orchestration (high maintenance burden, reinventing wheel)
- Mastra (specialized for agent workflows)

**Decision**: Use Mastra 0.17

**Rationale**:

- Built specifically for multi-agent systems
- Strong TypeScript support with type safety
- Memory management and state persistence
- Workflow orchestration with step execution
- Integration with multiple AI providers

### Decision 2: Qdrant for Vector Storage

**Context**: Need vector database with metadata filtering

**Options Considered**:

- Pinecone (SaaS, cost concerns)
- Weaviate (complex deployment)
- Qdrant (self-hosted, filtering support)

**Decision**: Use Qdrant

**Rationale**:

- Self-hosted for data sovereignty
- Excellent filtering capabilities for RBAC
- Docker deployment simplicity
- High performance with metadata queries
- Open source with active community

### Decision 3: JWT for Authentication

**Context**: Need secure, stateless authentication

**Decision**: JWT tokens with role claims in request body (not headers)

**Rationale**:

- Stateless validation (no session storage)
- Role claims embedded in token payload
- Standard industry approach
- Easy integration with identity providers
- Body transmission avoids header size limits

### Decision 4: API Bridge Layer Pattern

**Context**: Next.js frontend needs to communicate with Mastra backend on separate port

**Decision**: Mandatory `lib/mastra-client.ts` bridge layer

**Flow**: `Next.js API Routes → lib/mastra-client.ts → Mastra Backend (port 4111)`

**Rationale**:

- Clean separation between Next.js and Mastra processes
- Allows independent scaling of frontend and backend
- Centralizes JWT token injection logic
- Enables environment-specific base URL configuration
- **CRITICAL**: Never import Mastra directly in Next.js - always use the client bridge

**Implementation**:

```typescript
// lib/mastra/mastra-client.ts
export class MastraClient {
    private baseUrl: string
    constructor(baseUrl = 'http://localhost:4111') {
        this.baseUrl = baseUrl
    }
    async chat(message: string, jwt: string) {
        return fetch(`${this.baseUrl}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, jwt }),
        })
    }
}

// app/api/chat/route.ts
import { MastraClient } from '@/lib/mastra/mastra-client'
const mastra = new MastraClient()
// Use mastra.chat(), never direct Mastra imports
```

### Decision 5: Observability with Custom Langfuse Exporter

**Context**: Need comprehensive AI observability across all agents and workflows

**Decision**: Custom Langfuse exporter in `ai-tracing.ts` (339 lines)

**Rationale**:

- Mastra's built-in Langfuse integration insufficient
- Custom exporter exports traces, spans, LLM generations, events
- Realtime mode for development visibility (flushes after each event)
- Graceful handling of missing credentials (disables if not configured)
- Maps Mastra AI tracing events to Langfuse hierarchy

**Implementation** (ai-tracing.ts):

```typescript
export class LangfuseExporter {
    async export(spans: ReadableSpan[]): Promise<void> {
        for (const span of spans) {
            const langfuseSpan = this.langfuse.span({
                name: span.name,
                traceId: span.spanContext().traceId,
                // ... map all Mastra span data to Langfuse format
            })
        }
        if (this.realtimeMode) await this.langfuse.flushAsync()
    }
}

// Used in src/mastra/index.ts
import { LangfuseExporter } from './ai-tracing'
export const mastra = new Mastra({
    telemetry: {
        sampling: { probability: 1.0 },
        processors: [new BatchSpanProcessor(new LangfuseExporter())],
    },
})
```

### Decision 6: Hierarchical Role Model

**Context**: Organizations have nested access requirements

**Decision**: 10-level role hierarchy with numeric weights and inheritance

```text
admin (100) > exec_viewer (90) > dept_admin (80) > dept_viewer (60) > 
employee (40) > contractor (30) > partner (20) > public (10)
```

**Rationale**:

- Simple numeric comparison logic (`userRole.level >= requiredLevel`)
- Clear inheritance semantics (higher roles inherit lower permissions)
- Flexible for future role additions
- Audit-friendly (numeric levels log clearly)
- Supports step-up authentication (temporary elevation)

### Decision 7: Zero-Trust Security Model

**Context**: Cannot assume any component is trustworthy

**Decision**: Validate access at every pipeline stage

**Rationale**:

- Defense in depth
- Compliance requirements
- Audit trail completeness
- Prevents bypass attacks

## Design Patterns in Use

### Pattern 1: Agent Contract (Kilocode Pattern)

All agents follow standardized contract format:

```typescript
// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// tools: [tool-list]
// inputSchema: SchemaReference
// outputSchema: SchemaReference
// requiredCallerClaims: [role:level]
// approvedBy: approver
// approvalDate: date

export const myAgent = new Agent({
    id: 'agent-id',
    name: 'Agent Name',
    instructions: `<role>...</role><persona>...</persona><process>...</process>`,
    memory: createResearchMemory(),
    // ... config
})
```

### Pattern 2: Workflow Step Logging

Structured logging for observability:

```typescript
import { logStepStart, logStepEnd, logError } from '../config/logger'

const step = createStep({
    id: 'step-name',
    inputSchema: z.object({ ... }),
    outputSchema: z.object({ ... }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('step-name', inputData)
        try {
            const result = await process(inputData)
            logStepEnd('step-name', result, Date.now() - startTime)
            return result
        } catch (error) {
            logError('step-name', error, inputData)
            throw error
        }
    },
})
```

### Pattern 3: Zod Schema Validation

All data structures use Zod for runtime type safety:

```typescript
// src/mastra/schemas/agent-schemas.ts
export const retrieveInputSchema = z.object({
    query: z.string().min(1),
    userClaims: z.object({
        role: z.string(),
        department: z.string().optional(),
    }),
})

// In agents/retrieve.agent.ts
const validatedInput = retrieveInputSchema.parse(input)
```

### Pattern 4: Agent-as-Tool Composition

Agents can be invoked as tools by other agents:

```typescript
// src/mastra/tools/copywriter-agent-tool.ts
import { copywriterAgent } from '../agents/copywriterAgent'

export const copywriterTool = createTool({
    id: 'copywriter',
    description: 'Generate content using AI copywriter',
    inputSchema: z.object({
        prompt: z.string(),
        contentType: z.enum(['blog', 'marketing', 'technical']),
    }),
    execute: async ({ context }) => {
        const result = await copywriterAgent.run({
            input: context.prompt,
            contentType: context.contentType,
        })
        return result
    },
})

// Used in other agents:
export const assistantAgent = new Agent({
    id: 'assistant',
    tools: [copywriterTool, editorTool],
    // ...
})
```

### Pattern 5: Workflow Suspend/Resume (Human-in-Loop)

Research workflows support suspension for human review:

```typescript
// src/mastra/workflows/researchWorkflow.ts
export const researchWorkflow = createWorkflow({
    steps: [
        gatherDataStep,
        analyzeDataStep,
        createStep({
            id: 'human-review',
            execute: async ({ inputData }) => {
                // Workflow suspends here
                return { status: 'awaiting_review', data: inputData }
            },
        }),
        compileFindingsStep,
    ],
})

// Resume after human approval:
await researchWorkflow.resume(runId, { approved: true })
```

### Pattern 6: API Route Registration

Mastra backend routes defined centrally in `apiRegistry.ts`:

```typescript
// src/mastra/apiRegistry.ts
export const apiRegistry = {
    '/chat': {
        method: 'POST',
        handler: async (req) => {
            const { message, jwt } = chatRequestSchema.parse(req.body)
            const result = await chatWorkflow.createRunAsync({ message, jwt })
            return result
        },
        schema: chatRequestSchema,
        description: 'Standard request-response chat endpoint',
    },
    '/chat/stream': {
        method: 'POST',
        handler: async (req) => {
            const { message, jwt } = chatRequestSchema.parse(req.body)
            return createSSEStream(async (send) => {
                await chatWorkflow.streamRun({ message, jwt }, send)
            })
        },
        schema: chatRequestSchema,
        description: 'Server-sent events (SSE) streaming endpoint',
    },
}
```

### Pattern 3: Schema Validation

Runtime validation with Zod:

```typescript
export const querySchema = z.object({
    question: z.string().min(1),
    token: z.string(),
    sessionId: z.string().optional(),
})

// Validate at API boundary
const validated = querySchema.parse(request)
```

### Pattern 4: Service Layer Pattern

Business logic separated from agents:

```typescript
export class AuthenticationService {
    validateToken(token: string): UserClaims
    generateAccessFilters(role: string): AccessFilter[]
    logSecurityEvent(event: SecurityEvent): void
}
```

### Pattern 5: Tool Abstraction

Reusable, testable tool functions:

```typescript
export const vectorQueryTool = createTool({
    id: 'vector-query',
    description: 'Search vector database with filters',
    inputSchema: z.object({...}),
    outputSchema: z.object({...}),
    execute: async ({ query, filters }) => {
        // Implementation
    }
})
```

## Component Relationships

### Frontend Components

```
App Layout
├── TopNavigation
│   ├── ThemeToggle
│   └── UserMenu
├── ChatInterface
│   ├── SecurityIndicator
│   └── ChatMessages (streaming)
├── AuthPanel
│   └── RoleSelector
└── IndexingPanel (admin only)
```

### Backend Services

```
Mastra Core
├── AuthenticationService
├── VectorStoreService
├── EmbeddingService
├── MemoryService
└── AuditService
```

### Agent Hierarchy

```
Core Agents
├── Identity Agent
├── Policy Agent
├── Retrieve Agent
├── Rerank Agent
├── Answerer Agent
└── Verifier Agent

Specialized Agents
├── Summarizer Agent
├── Citation Agent
├── Context Agent
└── ... (12+ more)
```

## Data Flow Diagrams

### Document Indexing Flow

```
CLI Command
    ↓
Parse Documents (corpus/*.md)
    ↓
Extract Metadata (classification, department)
    ↓
Generate Embeddings (OpenAI/Gemini)
    ↓
Store in Qdrant (with security metadata)
    ↓
Log Indexing Event
    ↓
Confirm Success
```

### Query Processing Flow

```
User Query + JWT
    ↓
API Route Handler (/api/chat)
    ↓
JWT Validation
    ↓
Mastra Workflow (governed-rag-answer)
    ↓
Multi-Agent Pipeline (6 stages)
    ↓
Stream Response (SSE)
    ↓
Update UI (React streaming)
```

## Deployment Architecture

### Development Environment

```
Docker Compose
├── Qdrant (port 6333)
├── Redis (port 6379)
└── LibSQL (file-based)

npm run dev (concurrent)
├── Next.js (port 3000)
└── Mastra Backend (port 4111)
```

### Production Environment

```
Container Orchestration
├── Frontend Container (Next.js)
├── Backend Container (Mastra)
├── Qdrant Cluster
├── Redis Cluster
└── LibSQL/Turso
```

## Performance Considerations

### Optimization Strategies

1. **Vector Search**: Pre-filter with metadata before similarity search
2. **Caching**: Redis for frequent queries and embeddings
3. **Batch Processing**: Group document indexing operations
4. **Connection Pooling**: Reuse database connections
5. **Streaming**: Progressive response generation

### Scalability Patterns

1. **Horizontal Scaling**: Multiple Mastra backend instances
2. **Vector Sharding**: Qdrant collection sharding by department
3. **Read Replicas**: Separate read/write Qdrant instances
4. **CDN**: Static assets and cached responses

## Error Handling

### Error Propagation

```
Agent Error
    ↓
Workflow Step Error Handler
    ↓
Log Error with Context
    ↓
Return Structured Error Response
    ↓
Frontend Error Boundary
    ↓
User-Friendly Error Message
```

### Recovery Strategies

1. **Retry Logic**: Transient failures with exponential backoff
2. **Circuit Breaker**: Prevent cascade failures
3. **Fallback Responses**: Graceful degradation
4. **State Persistence**: Resume workflows after failures

## Monitoring and Observability

### Logging Strategy

- **Structured Logs**: JSON format with correlation IDs
- **Log Levels**: DEBUG, INFO, WARN, ERROR
- **Context Injection**: Request ID, user role, timestamp
- **Aggregation**: Central log collection (planned)

### Tracing Strategy

- **Langfuse Integration**: Workflow and agent tracing
- **Performance Metrics**: Step execution times
- **Security Events**: All access control decisions
- **User Analytics**: Query patterns and success rates

## Testing Architecture

### Test Pyramid

```
E2E Tests (Playwright)
    ↓
Integration Tests (Vitest)
    ↓
Unit Tests (Vitest)
```

### Test Strategies

1. **Unit Tests**: Individual agents, tools, services
2. **Integration Tests**: Workflow execution, API endpoints
3. **Security Tests**: RBAC validation, access control
4. **Performance Tests**: Load testing, stress testing
