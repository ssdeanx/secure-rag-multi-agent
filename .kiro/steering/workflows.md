# Workflow Guidelines & Patterns

## Workflow Architecture Overview

This system uses two main workflows orchestrated by Mastra's workflow engine:

1. **Document Indexing Workflow** (`governed-rag-index`)
2. **Query Processing Workflow** (`governed-rag-answer`)

## Workflow Design Principles

### Step-Based Composition

- Break complex operations into discrete, testable steps
- Each step has clear input/output schemas
- Steps can be composed using `.then()` chaining
- Always end with `.commit()` to finalize workflow

### Error Handling & Logging

- Comprehensive logging at step start/end
- Structured error handling with context
- Performance monitoring with timing
- Progress tracking for long-running operations

### Schema Validation

- All workflow inputs/outputs validated with Zod
- Step-level validation for data integrity
- Type safety throughout the pipeline

## Governed RAG Answer Workflow

### Overview

4-step security-first query processing pipeline:

```
JWT + Question → Authentication → Retrieval+Rerank → Answer → Verification → Secure Response
```

### Step 1: Authentication (`authentication`)

**Purpose**: Verify JWT and generate access policy

```typescript
const authenticationStep = createStep({
    id: 'authentication',
    description: 'Verify JWT token and generate access policy',
    inputSchema: z.object({
        jwt: z.string(),
        question: z.string(),
    }),
    outputSchema: z.object({
        accessFilter: accessFilterSchema,
        question: z.string(),
    }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('authentication', {
            question: inputData.question,
            hasJWT: !!inputData.jwt,
        })

        try {
            const { claims, accessFilter } =
                await AuthenticationService.authenticateAndAuthorize(
                    inputData.jwt
                )

            const output = {
                accessFilter,
                question: inputData.question,
            }

            logStepEnd(
                'authentication',
                {
                    accessFilter: accessFilter.allowTags,
                    maxClassification: accessFilter.maxClassification,
                },
                Date.now() - startTime
            )
            return output
        } catch (error) {
            logError('authentication', error, { question: inputData.question })
            throw new Error(
                `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    },
})
```

**Key Features**:

- JWT verification with `AuthenticationService`
- Access policy generation based on user roles
- Comprehensive error handling and logging
- Performance timing measurement

### Step 2: Retrieval and Rerank (`retrieval-and-rerank`)

**Purpose**: Secure document retrieval with relevance ranking

```typescript
const retrievalStep = createStep({
    id: 'retrieval-and-rerank',
    description:
        'Retrieve documents with security filters and rerank by relevance',
    inputSchema: z.object({
        accessFilter: accessFilterSchema,
        question: z.string(),
    }),
    outputSchema: z.object({
        contexts: z.array(documentContextSchema),
        question: z.string(),
    }),
    execute: async ({ inputData, mastra }) => {
        const startTime = Date.now()
        const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`

        console.log(
            `[${requestId}] 🚀 Starting document retrieval for question: "${inputData.question}"`
        )
        logStepStart('retrieval-and-rerank', {
            accessFilter: inputData.accessFilter.allowTags,
            question: inputData.question,
            requestId,
        })

        try {
            // Retrieve documents using retrieve agent
            const agent = mastra?.getAgent('retrieve') || retrieveAgent
            const retrieveResult = await agent.generate(
                JSON.stringify({
                    question: inputData.question,
                    access: inputData.accessFilter,
                    requestId: requestId,
                }),
                {
                    toolChoice: 'required',
                }
            )

            // Extract contexts from tool results
            let contexts: any[] = []
            if (
                retrieveResult.toolResults &&
                retrieveResult.toolResults.length > 0
            ) {
                const toolResult =
                    retrieveResult.toolResults.find(
                        (tr) => tr.toolName === 'vectorQueryTool'
                    ) || retrieveResult.toolResults[0]
                if (
                    toolResult &&
                    toolResult.result &&
                    toolResult.result.contexts
                ) {
                    contexts = toolResult.result.contexts
                }
            }

            // Rerank contexts if any found
            if (contexts.length > 0) {
                try {
                    const rerankResult = await rerankAgent.generate(
                        JSON.stringify({
                            question: inputData.question,
                            contexts: contexts,
                        }),
                        {
                            experimental_output: rerankOutputSchema,
                        }
                    )

                    const rerankResponse = rerankResult.object || {
                        contexts: [],
                    }
                    contexts = rerankResponse.contexts || contexts
                } catch (error) {
                    // If reranking fails, use original contexts
                    console.log(
                        `[${requestId}] ⚠️ Reranking failed, using original order`
                    )
                }
            }

            const output = {
                contexts,
                question: inputData.question,
            }

            logStepEnd(
                'retrieval-and-rerank',
                { contextsFound: output.contexts.length },
                Date.now() - startTime
            )
            return output
        } catch (error) {
            logError('retrieval-and-rerank', error, {
                accessFilter: inputData.accessFilter,
            })
            throw new Error(
                `Document retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    },
})
```

**Key Features**:

- Request ID generation for tracing
- Tool result extraction and validation
- Fallback handling for reranking failures
- Security validation of retrieved contexts

### Step 3: Answer Generation (`answer-generation`)

**Purpose**: Generate secure answers from authorized contexts

```typescript
const answerStep = createStep({
    id: 'answer-generation',
    description: 'Generate answer from authorized contexts',
    inputSchema: z.object({
        contexts: z.array(documentContextSchema),
        question: z.string(),
    }),
    outputSchema: z.object({
        answer: ragAnswerSchema,
        contexts: z.array(documentContextSchema),
        question: z.string(),
    }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('answer-generation', {
            contextsCount: inputData.contexts.length,
            question: inputData.question,
        })

        try {
            logAgentActivity('answerer', 'generating-answer', {
                contextsCount: inputData.contexts.length,
            })

            const result = await answererAgent.generate(
                JSON.stringify({
                    question: inputData.question,
                    contexts: inputData.contexts,
                }),
                {
                    experimental_output: answererOutputSchema,
                }
            )

            const answer = result.object || {
                answer: 'Unable to generate answer',
                citations: [],
            }

            // Handle no contexts case
            if (
                inputData.contexts.length === 0 &&
                (!answer.answer || answer.answer.trim() === '')
            ) {
                answer.answer =
                    'No authorized documents found that contain information about this topic.'
                answer.citations = []
            }

            const output = {
                answer,
                contexts: inputData.contexts,
                question: inputData.question,
            }

            logStepEnd(
                'answer-generation',
                { citationsCount: answer.citations?.length || 0 },
                Date.now() - startTime
            )
            return output
        } catch (error) {
            logError('answer-generation', error, {
                contextsCount: inputData.contexts.length,
            })
            throw new Error(
                `Answer generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    },
})
```

**Key Features**:

- Structured output with `experimental_output`
- Default handling for no contexts
- Citation counting and validation
- Agent activity logging

### Step 4: Answer Verification (`answer-verification`)

**Purpose**: Final security compliance check

```typescript
const verifyStep = createStep({
    id: 'answer-verification',
    description: 'Verify answer complies with security policies',
    inputSchema: z.object({
        answer: ragAnswerSchema,
        contexts: z.array(documentContextSchema),
        question: z.string(),
    }),
    outputSchema: z.object({
        answer: z.string(),
        citations: z.array(
            z.object({
                docId: z.string(),
                source: z.string(),
            })
        ),
    }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('answer-verification', {
            citationsCount: inputData.answer.citations?.length || 0,
            question: inputData.question,
        })

        try {
            logAgentActivity('verifier', 'verifying-answer', {
                citationsCount: inputData.answer.citations?.length || 0,
            })

            const result = await verifierAgent.generate(
                JSON.stringify({
                    answer: inputData.answer,
                    question: inputData.question,
                    contexts: inputData.contexts,
                }),
                {
                    experimental_output: verifierOutputSchema,
                }
            )

            const verification = result.object || {
                ok: false,
                reason: 'Verification failed',
            }

            if (!verification.ok) {
                // Handle special cases
                if (
                    inputData.answer.answer.includes(
                        'No authorized documents found'
                    ) ||
                    inputData.answer.answer.includes(
                        "don't contain information about this"
                    )
                ) {
                    const output = {
                        answer: inputData.answer.answer,
                        citations: inputData.answer.citations || [],
                    }
                    logStepEnd(
                        'answer-verification',
                        {
                            verified: true,
                            insufficientEvidence: true,
                            citationsCount: output.citations.length,
                        },
                        Date.now() - startTime
                    )
                    return output
                }

                logError(
                    'answer-verification',
                    new Error(verification.reason),
                    { reason: verification.reason }
                )
                throw new Error(
                    verification.reason || 'Answer failed security verification'
                )
            }

            const output = {
                answer: inputData.answer.answer,
                citations: inputData.answer.citations || [],
            }

            logStepEnd(
                'answer-verification',
                { verified: true, citationsCount: output.citations.length },
                Date.now() - startTime
            )
            return output
        } catch (error) {
            logError('answer-verification', error, {
                question: inputData.question,
            })
            throw new Error(
                `Answer verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    },
})
```

**Key Features**:

- Security compliance verification
- Special case handling for "no information found"
- Verification failure handling
- Final output formatting

### Workflow Composition

```typescript
export const governedRagAnswer = createWorkflow({
    id: 'governed-rag-answer',
    description:
        'Multi-agent governed RAG: auth → retrieve+rerank → answer → verify',
    inputSchema: z.object({
        jwt: z.string(),
        question: z.string(),
    }),
    outputSchema: z.object({
        answer: z.string(),
        citations: z.array(
            z.object({
                docId: z.string(),
                source: z.string(),
            })
        ),
    }),
})
    .then(authenticationStep)
    .then(retrievalStep)
    .then(answerStep)
    .then(verifyStep)
    .commit()
```

## Governed RAG Index Workflow

### Overview

Single-step document indexing with security metadata:

```typescript
export const governedRagIndex = createWorkflow({
    id: 'governed-rag-index',
    description: 'Index documents with security tags and classifications',
    inputSchema: z.object({
        documents: z.array(
            z.object({
                filePath: z.string(),
                docId: z.string(),
                classification: z.enum(['public', 'internal', 'confidential']),
                allowedRoles: z.array(z.string()),
                tenant: z.string(),
                source: z.string().optional(),
            })
        ),
    }),
    outputSchema: z.object({
        indexed: z.number(),
        failed: z.number(),
        documents: z.array(
            z.object({
                docId: z.string(),
                status: z.string(),
                chunks: z.number().optional(),
                error: z.string().optional(),
            })
        ),
    }),
})
    .then(indexDocumentsStep)
    .commit()
```

### Index Documents Step

**Purpose**: Process and index documents with security metadata

**Key Features**:

- Qdrant index creation with proper dimensions (1536 for text-embedding-3-small)
- Batch processing with progress tracking
- Error handling per document
- Security tag extraction and validation
- Comprehensive result reporting

## Workflow Best Practices

### Step Design

1. **Single Responsibility**: Each step should have one clear purpose
2. **Schema Validation**: Always validate inputs and outputs
3. **Error Handling**: Comprehensive try-catch with context
4. **Logging**: Start/end logging with performance metrics
5. **Request Tracing**: Use request IDs for debugging

### Performance Optimization

1. **Async Operations**: Use async/await throughout
2. **Batch Processing**: Process multiple items efficiently
3. **Timeout Handling**: Proper timeout configuration
4. **Memory Management**: Clean up resources appropriately
5. **Progress Tracking**: Report progress for long operations

### Security Considerations

1. **Input Validation**: Validate all inputs with Zod schemas
2. **Access Control**: Respect user permissions throughout
3. **Audit Logging**: Log all security-relevant operations
4. **Error Sanitization**: Don't leak sensitive information
5. **Context Isolation**: Maintain security boundaries

### Error Recovery

1. **Graceful Degradation**: Handle partial failures appropriately
2. **Retry Logic**: Implement retry for transient failures
3. **Fallback Strategies**: Provide alternatives when possible
4. **User-Friendly Messages**: Clear error messages for users
5. **Debug Information**: Detailed logging for troubleshooting

### Testing Strategies

1. **Unit Tests**: Test individual steps in isolation
2. **Integration Tests**: Test complete workflow execution
3. **Security Tests**: Verify access control enforcement
4. **Performance Tests**: Validate performance characteristics
5. **Error Tests**: Test error handling and recovery
