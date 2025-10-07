# Development Guidelines & Best Practices

## Development Workflow

### Local Development Setup

1. **Environment Setup**

    ```bash
    cp .env.example .env
    # Edit .env with your API keys
    npm install
    docker-compose up -d  # Start Qdrant and Redis
    ```

2. **Development Services**

    ```bash
    npm run dev           # Next.js dev server (port 3000)
    npm run mastra-dev    # Mastra development mode
    ```

3. **Initial Data Setup**
    ```bash
    npm run build-cli     # Build CLI tools
    npm run cli index     # Index sample documents
    ```

### Code Organization Principles

#### Service Layer Pattern

- **Single Responsibility**: Each service handles one domain
- **Static Methods**: Services use static methods for stateless operations
- **Dependency Injection**: Services receive dependencies as parameters
- **Error Handling**: Consistent error handling with proper types

#### Agent Design Patterns

```typescript
// Agent structure template
export const myAgent = new Agent({
    id: 'my-agent',
    name: 'my-agent',
    model: openAIModel,
    instructions: `
    You are a [specific role] agent. Follow these rules:
    1. [Primary responsibility]
    2. [Security constraints]
    3. [Output format requirements]
  `,
    tools: [relevantTool1, relevantTool2],
})
```

#### Workflow Step Pattern

```typescript
const myStep = createStep({
    id: 'my-step',
    description: 'Clear description of step purpose',
    inputSchema: z.object({
        // Define expected inputs with Zod
    }),
    outputSchema: z.object({
        // Define expected outputs with Zod
    }),
    execute: async ({ inputData, mastra }) => {
        const startTime = Date.now()
        logStepStart('my-step', inputData)

        try {
            // Step implementation
            const result = await processData(inputData)

            logStepEnd('my-step', result, Date.now() - startTime)
            return result
        } catch (error) {
            logError('my-step', error, inputData)
            throw error
        }
    },
})
```

## TypeScript Best Practices

### Type Safety Guidelines

```typescript
// ✅ Use explicit types
interface UserClaims {
    sub: string
    roles: string[]
    tenant?: string
}

// ✅ Use Zod for runtime validation
const userClaimsSchema = z.object({
    sub: z.string(),
    roles: z.array(z.string()),
    tenant: z.string().optional(),
})

// ❌ Avoid any types
function processData(data: any): any {}

// ✅ Use proper generic types
function processData<T>(data: T): Promise<ProcessResult<T>> {}
```

### Error Handling Patterns

```typescript
// ✅ Proper error handling with types
try {
    const result = await riskyOperation()
    return result
} catch (error) {
    if (error instanceof ValidationError) {
        logError('validation-failed', error, { input })
        throw new Error(`Validation failed: ${error.message}`)
    }

    if (error instanceof Error) {
        logError('operation-failed', error, { context })
        throw new Error(`Operation failed: ${error.message}`)
    }

    logError('unknown-error', error, { context })
    throw new Error('Unknown error occurred')
}
```

## Security Development Guidelines

### JWT Handling

```typescript
// ✅ Always validate JWT structure and claims
const claims = await AuthenticationService.verifyJWT(token)
ValidationService.validateJWTClaims(claims)

// ✅ Use role hierarchy for access checks
const hasAccess = RoleService.canAccessRole(claims.roles, requiredRole)

// ❌ Never trust client-provided role information
// const userRole = request.headers['x-user-role']; // WRONG
```

### Input Validation

```typescript
// ✅ Validate all inputs with Zod schemas
const validatedInput = inputSchema.parse(rawInput)

// ✅ Sanitize query inputs
const sanitizedQuery = ValidationService.sanitizeQuery(userQuery)

// ✅ Validate file uploads
const validatedFile = await ValidationService.validateDocument(file)
```

### Security Logging

```typescript
// ✅ Log security events with context
logAgentActivity('retrieve', 'document-access', {
    userId: claims.sub,
    roles: claims.roles,
    documentsAccessed: results.map((r) => r.docId),
    classification: maxClassification,
    requestId,
})

// ✅ Log authorization decisions
logger.info('Authorization decision', {
    user: claims.sub,
    requestedResource: docId,
    decision: hasAccess ? 'GRANTED' : 'DENIED',
    reason: accessReason,
})
```

## Testing Strategies

### Unit Testing Patterns

```typescript
// Service testing example
describe('RoleService', () => {
    test('should expand roles with hierarchy', () => {
        const userRoles = ['finance.viewer']
        const expanded = RoleService.expandRoles(userRoles)
        expect(expanded).toContain('finance.viewer')
        expect(expanded).toContain('employee')
        expect(expanded).toContain('public')
    })

    test('should validate document access', () => {
        const userRoles = ['finance.viewer']
        const docTags = ['role:finance.viewer']
        const hasAccess = RoleService.canAccessDocument(userRoles, docTags)
        expect(hasAccess).toBe(true)
    })
})
```

### Integration Testing

```typescript
// Workflow testing example
describe('Governed RAG Workflow', () => {
    test('should process query with proper authorization', async () => {
        const jwt = await generateTestJWT({ roles: ['finance.viewer'] })
        const question = 'What is the expense policy?'

        const result = await workflow.execute({ jwt, question })

        expect(result.answer).toBeDefined()
        expect(result.citations).toHaveLength(1)
        expect(result.citations[0].docId).toBe('finance-policy-001')
    })
})
```

### Security Testing

```typescript
// Security test examples
describe('Security Tests', () => {
    test('should reject invalid JWT', async () => {
        const invalidJWT = 'invalid.jwt.token'

        await expect(
            AuthenticationService.verifyJWT(invalidJWT)
        ).rejects.toThrow('JWT verification failed')
    })

    test('should prevent cross-tenant access', async () => {
        const jwt = await generateTestJWT({
            roles: ['finance.viewer'],
            tenant: 'other-tenant',
        })

        const result = await queryService.query({
            question: 'What is the expense policy?',
            allowTags: ['tenant:acme'],
            maxClassification: 'internal',
        })

        expect(result).toHaveLength(0)
    })
})
```

## Performance Optimization

### Caching Strategies

```typescript
// ✅ Cache expensive operations
const embeddingCache = new Map<string, number[]>()

async function getCachedEmbedding(text: string): Promise<number[]> {
    if (embeddingCache.has(text)) {
        return embeddingCache.get(text)!
    }

    const embedding = await generateEmbedding(text)
    embeddingCache.set(text, embedding)
    return embedding
}
```

### Batch Processing

```typescript
// ✅ Process documents in batches
async function indexDocuments(
    docs: DocumentInput[]
): Promise<IndexingResult[]> {
    const batchSize = 10
    const results: IndexingResult[] = []

    for (let i = 0; i < docs.length; i += batchSize) {
        const batch = docs.slice(i, i + batchSize)
        const batchResults = await processBatch(batch)
        results.push(...batchResults)

        // Progress reporting
        logProgress('Document indexing', i + batch.length, docs.length)
    }

    return results
}
```

### Streaming Responses

```typescript
// ✅ Stream chat responses for better UX
export async function POST(request: NextRequest) {
    const stream = new ReadableStream({
        async start(controller) {
            try {
                const result = await workflow.execute(input)

                // Stream answer in chunks
                const chunks = result.answer.match(/.{1,50}/g) || [
                    result.answer,
                ]
                for (const chunk of chunks) {
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({ content: chunk })}\n\n`
                        )
                    )
                    await new Promise((resolve) => setTimeout(resolve, 50))
                }

                controller.enqueue(
                    encoder.encode(
                        `data: ${JSON.stringify({ done: true })}\n\n`
                    )
                )
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream, {
        headers: { 'Content-Type': 'text/event-stream' },
    })
}
```

## Debugging Guidelines

### Logging Best Practices

```typescript
// ✅ Use structured logging with context
logger.info('Processing user query', {
    userId: claims.sub,
    question: question.substring(0, 100), // Truncate for privacy
    roles: claims.roles,
    tenant: claims.tenant,
    requestId,
})

// ✅ Log performance metrics
const startTime = Date.now()
const result = await expensiveOperation()
logger.info('Operation completed', {
    operation: 'vector-query',
    duration: Date.now() - startTime,
    resultCount: result.length,
    requestId,
})
```

### Request Tracing

```typescript
// ✅ Generate unique request IDs for tracing
const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`

// ✅ Pass request ID through the pipeline
console.log(`[${requestId}] Starting document retrieval`)
console.log(`[${requestId}] Found ${results.length} documents`)
```

### Error Context

```typescript
// ✅ Provide rich error context
catch (error) {
  logError('document-indexing', error, {
    docId: doc.docId,
    filePath: doc.filePath,
    classification: doc.classification,
    chunkCount: chunks.length,
    requestId
  });

  throw new Error(`Failed to index document ${doc.docId}: ${error.message}`);
}
```

## Code Review Checklist

### Security Review

- [ ] JWT validation implemented correctly
- [ ] Role-based access control applied
- [ ] Input validation with Zod schemas
- [ ] No external knowledge in agent responses
- [ ] Security events properly logged
- [ ] Error messages don't leak sensitive information

### Performance Review

- [ ] Async/await used consistently
- [ ] Batch processing for large operations
- [ ] Appropriate caching strategies
- [ ] Database queries optimized with filters
- [ ] Streaming for long-running operations

### Code Quality Review

- [ ] TypeScript strict mode compliance
- [ ] Proper error handling with types
- [ ] Consistent naming conventions
- [ ] Adequate logging and monitoring
- [ ] Unit tests for business logic
- [ ] Integration tests for workflows

### Documentation Review

- [ ] Function/class documentation
- [ ] API endpoint documentation
- [ ] Configuration options documented
- [ ] Security considerations noted
- [ ] Performance characteristics documented
