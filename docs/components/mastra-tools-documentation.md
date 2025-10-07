---
title: 'Mastra Tools - Technical Documentation'
component_path: 'src/mastra/tools'
version: '1.0'
date_created: '2025-09-23'
last_updated: '2025-09-23'
owner: 'AI Team'
tags:
    [
        'tool',
        'authentication',
        'vector-query',
        'web-scraping',
        'content-creation',
        'infrastructure',
    ]
---

# Mastra Tools Documentation

A collection of specialized Mastra tools that provide agent capabilities for authentication, vector database querying, web scraping, content creation, and various utility functions in the Mastra Governed RAG system.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide specialized tools for Mastra agents
- OVR-002: Enable secure vector database queries with access control
- OVR-003: Support web scraping and content processing
- OVR-004: Facilitate content creation and editing
- OVR-005: Handle authentication and evaluation tasks

## 2. Architecture Section

- ARC-001: Tool-based architecture using Mastra's createTool function
- ARC-002: Zod schema validation for inputs and outputs
- ARC-003: Tracing integration with AI span tracking
- ARC-004: Service layer integration for business logic
- ARC-005: Comprehensive error handling and logging

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Tool Layer"
        A[jwt-auth.tool] --> B[AuthenticationService]
        C[vector-query.tool] --> D[VectorQueryService]
        E[web-scraper-tool] --> F[CheerioCrawler]
        G[copywriter-agent-tool] --> H[Copywriter Agent]
        I[editor-agent-tool] --> J[Editor Agent]
        K[evaluateResultTool] --> L[Evaluation Metrics]
        M[extractLearningsTool] --> N[Learning Extraction]
    end

    subgraph "External Dependencies"
        O[Zod Validation]
        P[AI SDK Tracing]
        Q[Cheerio]
        R[Crawlee]
        S[Marked]
        T[JSDOM]
        U[File System]
    end

    subgraph "Data Flow"
        V[JWT Token] --> A
        W[Query Request] --> C
        X[URL] --> E
        Y[Content Request] --> G
        Z[Content] --> I
    end

    A --> O
    C --> O
    E --> P
    E --> Q
    E --> R
    E --> S
    E --> T
    E --> U
    A --> B
    C --> D

    classDiagram
        class jwtAuthTool {
            +id: "jwt-auth"
            +description: "Verify JWT and return claims"
            +execute(context, tracingContext): Promise~JWTClaims~
        }
        class vectorQueryTool {
            +id: "vector-query"
            +description: "Qdrant query with security filters"
            +execute(context, mastra, tracingContext): Promise~{contexts}~
        }
        class webScraperTool {
            +id: "web-scraper"
            +description: "Comprehensive web scraping"
            +execute(context, tracingContext): Promise~{content, metadata}~
        }
        class copywriterTool {
            +id: "copywriter-agent"
            +description: "Content creation across formats"
            +execute(context, mastra, tracingContext): Promise~{content, metadata}~
        }
        class editorTool {
            +id: "editor-agent"
            +description: "Content editing and improvement"
            +execute(context, mastra, tracingContext): Promise~{editedContent}~
        }

        jwtAuthTool --> AuthenticationService
        vectorQueryTool --> VectorQueryService
        webScraperTool --> CheerioCrawler
        copywriterTool --> "Mastra Agent"
        editorTool --> "Mastra Agent"
```

## 3. Interface Documentation

- INT-001: Zod schema validation for all tool inputs and outputs
- INT-002: Async execute methods with tracing context
- INT-003: Structured error handling and logging

| Method/Property                  | Purpose               | Parameters                                           | Return Type                          | Usage Notes                      |
| -------------------------------- | --------------------- | ---------------------------------------------------- | ------------------------------------ | -------------------------------- |
| `jwtAuthTool.execute()`          | Verify JWT token      | `{jwt: string}`                                      | `Promise<JWTClaims>`                 | Returns parsed claims            |
| `vectorQueryTool.execute()`      | Query vector database | `{question, allowTags, maxClassification, topK}`     | `Promise<{contexts: QueryResult[]}>` | Applies security filtering       |
| `webScraperTool.execute()`       | Scrape web content    | `{url, options}`                                     | `Promise<{content, metadata}>`       | Handles dynamic content          |
| `copywriterTool.execute()`       | Create content        | `{topic, contentType, targetAudience, tone, length}` | `Promise<{content, title, summary}>` | Multiple content formats         |
| `editorTool.execute()`           | Edit content          | `{content, instructions}`                            | `Promise<{editedContent}>`           | Grammar and clarity improvements |
| `evaluateResultTool.execute()`   | Evaluate results      | `{results, criteria}`                                | `Promise<{scores, feedback}>`        | Quality assessment               |
| `extractLearningsTool.execute()` | Extract insights      | `{content, context}`                                 | `Promise<{learnings, questions}>`    | Knowledge synthesis              |

## 4. Implementation Details

- IMP-001: Tool creation using Mastra's createTool function
- IMP-002: Input/output schema validation with Zod
- IMP-003: Tracing integration with AI span tracking
- IMP-004: Service layer integration for complex operations
- IMP-005: Comprehensive error handling and logging

## 5. Usage Examples

### Basic Usage

```typescript
// JWT Authentication
const claims = await jwtAuthTool.execute({ jwt: 'eyJ...' })

// Vector Query
const results = await vectorQueryTool.execute({
    question: 'What is the policy?',
    allowTags: ['hr', 'policies'],
    maxClassification: 'internal',
    topK: 5,
})

// Content Creation
const content = await copywriterTool.execute({
    topic: 'AI in Healthcare',
    contentType: 'blog',
    tone: 'educational',
})
```

### Advanced Usage

```typescript
// Web Scraping with options
const scraped = await webScraperTool.execute({
    url: 'https://example.com',
    options: {
        includeImages: false,
        maxDepth: 2,
        followLinks: true,
    },
})

// Content Editing
const edited = await editorTool.execute({
    content: 'Original text...',
    instructions: 'Make it more formal and add examples',
})
```

- USE-001: Authentication and security operations
- USE-002: Vector database querying with access control
- USE-003: Web content scraping and processing
- USE-004: Content creation and editing workflows

## 6. Quality Attributes

- QUA-001: Security - JWT validation, access control, input sanitization
- QUA-002: Performance - Efficient queries, streaming responses, caching
- QUA-003: Reliability - Schema validation, error handling, tracing
- QUA-004: Maintainability - Modular design, clear interfaces, documentation
- QUA-005: Extensibility - Configurable options, pluggable services, custom schemas

## 7. Reference Information

- REF-001: Dependencies: @mastra/core (^0.1.0), zod (^3.22.0), crawlee (^3.5.0), cheerio (^1.0.0)
- REF-002: Environment variables: QDRANT_URL, QDRANT_COLLECTION, VECTOR_SIMILARITY_THRESHOLD
- REF-003: Testing: Tool unit tests, integration tests with mock services
- REF-004: Troubleshooting: Schema validation errors, network timeouts, authentication failures
- REF-005: Related: ../services/, ../agents/, ../schemas/tool-schemas.ts
- REF-006: Change history: Initial tool implementations, added tracing, enhanced security filtering
