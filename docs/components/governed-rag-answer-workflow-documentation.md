---
title: Governed RAG Answer Workflow - Technical Documentation
component_path: `src/mastra/workflows/governed-rag-answer.workflow.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra / Backend
tags: [workflow, rag, security, multi-agent, documentation]
---

# Governed RAG Answer Workflow Documentation

Multi-agent workflow that implements secure Retrieval-Augmented Generation (RAG) with role-based access control. Orchestrates authentication, document retrieval with security filtering, answer generation, and verification through specialized agents.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide secure Q&A functionality with governed access to documents.

- OVR-002: Scope includes JWT authentication, access policy generation, vector retrieval with security filters, document reranking, answer generation, and security verification. It deliberately excludes UI concerns and direct API handling.

- OVR-003: Context: Core business logic for the governed RAG system, used by API endpoints to answer user questions based on authorized documents.

## 2. Architecture Section

- ARC-001: Design patterns: Mastra workflow pattern with sequential step execution and agent orchestration.

- ARC-002: Dependencies:

  - `@mastra/core`: createWorkflow, createStep
  - Agent modules: retrieve, rerank, answerer, verifier agents
  - Services: AuthenticationService
  - Config: logger functions
  - Schemas: agent-schemas for type safety

- ARC-003: Interactions: Takes JWT and question, returns answer with citations. Each step calls specialized agents and logs progress.

- ARC-004: Visual/behavioral decisions: Sequential execution (auth → retrieve → answer → verify). Comprehensive logging and error handling.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Workflow Steps"
        GRA[governedRagAnswer] --> AS[authenticationStep]
        GRA --> RS[retrievalStep]
        GRA --> ANS[answerStep]
        GRA --> VS[verifyStep]
    end

    subgraph "Agents"
        RS --> RA[retrieveAgent]
        RS --> RRA[rerankAgent]
        ANS --> AA[answererAgent]
        VS --> VA[verifierAgent]
    end

    subgraph "Services"
        AS --> AUS[AuthenticationService]
    end

    classDiagram
        class GovernedRagAnswerWorkflow {
            +authenticationStep: Step
            +retrievalStep: Step
            +answerStep: Step
            +verifyStep: Step
            +execute(input): Promise<Output>
        }
```

## 3. Interface Documentation

- INT-001: Workflow input/output schemas.

| Property | Purpose | Type | Usage Notes |
|----------|---------|------|-------------|
| Input `jwt` | User authentication token | `string` | Required for access control |
| Input `question` | User query | `string` | The question to answer |
| Output `answer` | Generated answer | `string` | RAG-generated response |
| Output `citations` | Source references | `Array<{docId, source}>` | Document citations |

### Step Details

- **authenticationStep**: Validates JWT, generates access filter with role expansion
- **retrievalStep**: Calls retrieve agent for vector search, then rerank agent for relevance ordering
- **answerStep**: Uses answerer agent to generate response from retrieved contexts
- **verifyStep**: Security verification using verifier agent to ensure answer compliance

## 4. Implementation Details

- IMP-001: Each step includes comprehensive logging with request IDs for tracing.
- IMP-002: Authentication step uses AuthenticationService for JWT validation and access policy.
- IMP-003: Retrieval combines vector query results with reranking for better relevance.
- IMP-004: Answer generation includes context injection and citation tracking.

Corner cases and considerations:

- Tool result extraction handles multiple possible tool names.
- Reranking may fail gracefully with fallback to original order.
- Verification can reject answers that don't meet security criteria.
- Request ID generation for tracking across distributed calls.

## 5. Usage Examples

### Workflow execution

```ts
import { governedRagAnswer } from '@/src/mastra/workflows/governed-rag-answer';

// Execute the workflow
const result = await governedRagAnswer.execute({
  jwt: 'user-jwt-token',
  question: 'What is the company vacation policy?'
});

// Result contains answer and citations
console.log(result.answer);
console.log(result.citations);
```

### Integration with API

```ts
// In API route
export async function POST(request: Request) {
  const { jwt, question } = await request.json();
  
  const result = await governedRagAnswer.execute({ jwt, question });
  
  return Response.json(result);
}
```

## 6. Quality Attributes

- QUA-001 Security: JWT validation, role-based filtering, answer verification.
- QUA-002 Performance: Parallel agent calls where possible, efficient vector retrieval.
- QUA-003 Reliability: Comprehensive error handling, logging, and fallbacks.
- QUA-004 Maintainability: Modular steps, clear agent separation.
- QUA-005 Extensibility: Easy to add new steps or modify agent behavior.

## 7. Reference Information

- REF-001: Dependencies (approximate):
  - @mastra/core (^1.0.0)
  - zod (^3.0.0)

- REF-002: Configuration
  - Requires configured agents and vector store
  - Environment variables for external services

- REF-003: Testing guidelines
  - Mock agents and services. Test each step independently.
  - Verify security filtering with different user roles.

- REF-004: Troubleshooting
  - Issue: Auth failures — check JWT validity and user roles.
  - Issue: No results — verify vector store and security filters.
  - Issue: Verification failures — check verifier agent logic.

- REF-005: Related docs
  - Agent documentation (retrieve, rerank, answerer, verifier)
  - AuthenticationService documentation
  - Vector query tool documentation

- REF-006: Change history
  - 1.0 (2025-09-23) - Initial documentation generated
