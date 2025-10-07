# Service Layer Guidelines & Patterns

## Service Architecture Overview

The service layer provides business logic and data processing capabilities. All services use static methods for stateless operations and follow consistent patterns for error handling, validation, and logging.

## Core Services

### 1. AuthenticationService (`AuthenticationService.ts`)

**Purpose**: JWT verification and access policy generation

**Key Methods**:

```typescript
class AuthenticationService {
    static async verifyJWT(token: string): Promise<JWTClaims>
    static generateAccessPolicy(claims: JWTClaims): AccessFilter
    static async authenticateAndAuthorize(
        token: string
    ): Promise<{ claims: JWTClaims; accessFilter: AccessFilter }>
}
```

**Usage Patterns**:

```typescript
// JWT verification with proper error handling
try {
    const claims = await AuthenticationService.verifyJWT(token)
    ValidationService.validateJWTClaims(claims)
} catch (error) {
    throw new Error(`Authentication failed: ${error.message}`)
}

// Combined authentication and authorization
const { claims, accessFilter } =
    await AuthenticationService.authenticateAndAuthorize(token)
```

**Key Features**:

- JWT verification with jose library (HS256)
- Clock tolerance for token validation (5 seconds)
- Role hierarchy integration for access policy generation
- Step-up authentication support

### 2. RoleService (`RoleService.ts`)

**Purpose**: Role hierarchy management and access control

**Key Methods**:

```typescript
class RoleService {
    static expandRoles(userRoles: string[]): string[]
    static canAccessRole(userRoles: string[], requiredRole: string): boolean
    static canAccessDocument(
        userRoles: string[],
        documentRoleTags: string[]
    ): boolean
    static generateAccessTags(
        userRoles: string[],
        tenant?: string
    ): { allowTags: string[]; userRoles: string[]; expandedRoles: string[] }
    static getMaxPrivilegeLevel(userRoles: string[]): number
    static formatRolesForLogging(userRoles: string[]): string
}
```

**Role Hierarchy Example**:

```typescript
// User with finance.viewer role automatically gets:
const userRoles = ['finance.viewer']
const expandedRoles = RoleService.expandRoles(userRoles)
// Result: ['finance.viewer', 'employee', 'public']

// Access check using hierarchy
const hasAccess = RoleService.canAccessDocument(
    ['finance.viewer'],
    ['role:employee'] // Document requires employee role
) // Returns true due to hierarchy
```

**Key Features**:

- Automatic role inheritance based on hierarchy
- Document access validation
- Access tag generation for vector queries
- Privilege level calculation
- Comprehensive logging support

### 3. ValidationService (`ValidationService.ts`)

**Purpose**: Input validation and security checks

**Key Methods**:

```typescript
class ValidationService {
    static validateEnvironmentVariable(name: string, value?: string): string
    static validateAccessTags(allowTags?: string[]): string[]
    static validateJWTToken(jwt?: string): string
    static validateQuestion(question?: string): string
    static validateMastraInstance(mastra?: unknown)
    static validateVectorStore(store?: unknown)
    static validateTokenExpiry(exp?: number, now?: number): void
    static validateTokenNotBefore(nbf?: number, now?: number): void
}
```

**Usage Patterns**:

```typescript
// Environment variable validation
const apiKey = ValidationService.validateEnvironmentVariable(
    'OPENAI_API_KEY',
    process.env.OPENAI_API_KEY
)

// Input validation with clear error messages
ValidationService.validateQuestion(userInput.question)
ValidationService.validateAccessTags(accessFilter.allowTags)

// JWT timing validation
ValidationService.validateTokenExpiry(claims.exp)
ValidationService.validateTokenNotBefore(claims.nbf)
```

### 4. VectorQueryService (`VectorQueryService.ts`)

**Purpose**: Secure vector database operations

**Key Methods**:

```typescript
class VectorQueryService {
    static buildSecurityFilters(
        allowTags: string[],
        maxClassification: 'public' | 'internal' | 'confidential'
    ): SecurityFilters
    static async generateQueryEmbedding(question: string): Promise<number[]>
    static async searchWithFilters(
        embedding: number[],
        filters: SecurityFilters,
        vectorStore: unknown,
        indexName: string,
        topK: number,
        minSimilarity?: number
    ): Promise<QueryResult[]>
    static async query(
        input: QueryInput,
        vectorStore: unknown,
        indexName: string
    ): Promise<QueryResult[]>
}
```

**Security Filter Example**:

```typescript
// Build Qdrant filter with role hierarchy
const filters = VectorQueryService.buildSecurityFilters(
    ['role:finance.viewer', 'tenant:acme'],
    'internal'
)

// Results in Qdrant filter:
{
    must: [
        {
            key: 'securityTags',
            match: {
                any: ['classification:public', 'classification:internal'],
            },
        },
        {
            key: 'securityTags',
            match: {
                any: ['role:finance.viewer', 'role:employee', 'role:public'],
            },
        },
        {
            key: 'securityTags',
            match: { any: ['tenant:acme'] },
        },
    ]
}
```

**Key Features**:

- Database-level security filtering
- Role hierarchy expansion in queries
- Embedding generation with OpenAI
- Similarity threshold filtering
- Comprehensive access control logging

### 5. DocumentProcessorService (`DocumentProcessorService.ts`)

**Purpose**: Enhanced document processing with batch operations

**Key Methods**:

```typescript
class DocumentProcessorService {
    async processDocument(
        doc: DocumentInput,
        vectorStore: unknown,
        indexName: string,
        options?: ProcessingOptions
    ): Promise<IndexingResult>
    async processDocuments(
        docs: DocumentInput[],
        vectorStore: unknown,
        indexName: string,
        progressCallback?: Function
    ): Promise<IndexingResult[]>
    async getProcessingEstimate(
        docs: DocumentInput[],
        options?: ProcessingOptions
    ): Promise<ProcessingEstimate>
}
```

**Usage Patterns**:

```typescript
// Single document processing
const result = await processor.processDocument(
    {
        filePath: './corpus/finance-policy.md',
        docId: 'finance-policy-001',
        classification: 'internal',
        allowedRoles: ['finance.viewer'],
        tenant: 'acme',
    },
    vectorStore,
    'governed_rag'
)

// Batch processing with progress tracking
const results = await processor.processDocuments(
    documents,
    vectorStore,
    'governed_rag',
    (progress) =>
        console.log(`Progress: ${progress.completed}/${progress.total}`)
)
```

### 6. ChunkingService (`ChunkingService.ts`)

**Purpose**: Text chunking with multiple strategies

**Key Methods**:

```typescript
class ChunkingService {
    async chunkTextTokenBased(
        text: string,
        options?: ChunkingOptions
    ): Promise<ChunkingResult>
    chunkTextCharacterBased(
        text: string,
        options?: ChunkingOptions
    ): ChunkingResult
    async chunkText(
        text: string,
        options?: ChunkingOptions
    ): Promise<ChunkingResult>
    getOptimalChunkSize(textLength: number): ChunkingOptions
    validateText(text: string): void
}
```

**Chunking Strategies**:

- **Token-based**: Uses Mastra's native chunking with word boundaries
- **Character-based**: Legacy method for backward compatibility
- **Automatic**: Selects best strategy based on text characteristics

### 7. EmbeddingService (`EmbeddingService.ts`)

**Purpose**: OpenAI embedding generation with caching and batching

**Key Methods**:

```typescript
class EmbeddingService {
    async generateEmbeddingsNative(chunks: string[]): Promise<EmbeddingResult>
    async generateEmbeddingsBatched(
        chunks: string[],
        options?: EmbeddingOptions
    ): Promise<EmbeddingResult>
    async generateEmbeddings(
        chunks: string[],
        options?: EmbeddingOptions
    ): Promise<EmbeddingResult>
    estimateMemoryUsage(
        chunkCount: number,
        avgChunkSize: number
    ): { estimatedMB: number; recommendation: string }
}
```

**Usage Patterns**:

```typescript
// Automatic strategy selection
const result = await embeddingService.generateEmbeddings(chunks, {
    batchSize: 100,
    useCache: true,
})

// Memory estimation for large operations
const estimate = embeddingService.estimateMemoryUsage(
    chunks.length,
    avgChunkSize
)
if (estimate.estimatedMB > 1000) {
    console.log(`Warning: ${estimate.recommendation}`)
}
```

### 8. VectorStorageService (`VectorStorageService.ts`)

**Purpose**: Vector storage with batch processing and error handling

**Key Methods**:

```typescript
class VectorStorageService {
    async storeVectorsBatched(
        chunks: string[],
        embeddings: number[][],
        docId: string,
        securityTags: string[],
        versionId: string,
        timestamp: string,
        vectorStore: unknown,
        indexName: string,
        options?: StorageOptions
    ): Promise<StorageResult>
    async storeVectors(
        chunks: string[],
        embeddings: number[][],
        docId: string,
        securityTags: string[],
        versionId: string,
        timestamp: string,
        vectorStore: unknown,
        indexName: string
    ): Promise<StorageResult>
}
```

**Batch Processing Features**:

- Automatic batch size optimization
- Retry logic for failed batches
- Progress tracking and reporting
- Memory usage optimization
- Error recovery strategies

### 9. WorkflowDecorators (`WorkflowDecorators.ts`)

**Purpose**: Workflow enhancement utilities

**Key Functions**:

```typescript
export function withLoggingAndErrorHandling<T, R>(
    stepId: string,
    description: string
): (target: StepExecutor<T, R>) => StepExecutor<T, R>
export function withAgentLogging<T, R>(
    agentId: string,
    activity: string
): (target: StepExecutor<T, R>) => StepExecutor<T, R>
export function createStepWrapper<InputType, OutputType>(
    stepId: string,
    description: string,
    executor: StepExecutor<InputType, OutputType>
): StepExecutor<InputType, OutputType>
```

**Usage Patterns**:

```typescript
// Wrap step with logging and error handling
const wrappedStep = withLoggingAndErrorHandling(
    'my-step',
    'Process user data'
)(async (input) => {
    // Step implementation
    return processedData
})

// Add agent activity logging
const loggedStep = withAgentLogging('my-agent', 'processing-data')(wrappedStep)
```

## Service Design Patterns

### Static Method Pattern

```typescript
// All services use static methods for stateless operations
class MyService {
    static async processData(input: InputType): Promise<OutputType> {
        try {
            ValidationService.validateInput(input)
            const result = await performOperation(input)
            return result
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new Error(`Validation failed: ${error.message}`)
            }

            if (error instanceof Error) {
                throw new Error(`Operation failed: ${error.message}`)
            }

            throw new Error('Unknown error occurred')
        }
    }
}
```

### Error Handling Pattern

```typescript
// Consistent error handling across all services
try {
    const result = await riskyOperation()
    return result
} catch (error) {
    if (error instanceof SpecificError) {
        logError('service-method', error, { context })
        throw new Error(`Specific error: ${error.message}`)
    }

    if (error instanceof Error) {
        logError('service-method', error, { context })
        throw new Error(`General error: ${error.message}`)
    }

    logError('service-method', error, { context })
    throw new Error('Unknown error occurred')
}
```

### Validation Pattern

```typescript
// Input validation at service entry points
static async myMethod(input: InputType): Promise<OutputType> {
  // Validate required parameters
  ValidationService.validateRequiredField(input.field1);
  ValidationService.validateRequiredField(input.field2);

  // Validate business rules
  if (input.value < 0) {
    throw new Error('Value must be non-negative');
  }

  // Process validated input
  return await processInput(input);
}
```

### Logging Pattern

```typescript
// Structured logging with context
static async myMethod(input: InputType): Promise<OutputType> {
  const startTime = Date.now();
  const requestId = generateRequestId();

  logger.info('Starting operation', {
    method: 'myMethod',
    requestId,
    inputSize: JSON.stringify(input).length
  });

  try {
    const result = await processInput(input);

    logger.info('Operation completed', {
      method: 'myMethod',
      requestId,
      duration: Date.now() - startTime,
      resultSize: JSON.stringify(result).length
    });

    return result;
  } catch (error) {
    logger.error('Operation failed', {
      method: 'myMethod',
      requestId,
      duration: Date.now() - startTime,
      error: error.message
    });

    throw error;
  }
}
```

## Service Integration Patterns

### Service Composition

```typescript
// Services can compose other services
class HighLevelService {
    static async complexOperation(input: ComplexInput): Promise<ComplexOutput> {
        // Use multiple services in sequence
        const validated = ValidationService.validateComplexInput(input)
        const processed = await ProcessingService.processData(validated)
        const stored = await StorageService.storeResult(processed)

        return {
            result: stored,
            metadata: {
                processedAt: new Date().toISOString(),
                version: '1.0',
            },
        }
    }
}
```

### Dependency Injection

```typescript
// Pass dependencies as parameters, not globals
static async processWithDependencies(
  input: InputType,
  vectorStore: VectorStore,
  logger: Logger,
  config: Config
): Promise<OutputType> {
  // Use injected dependencies
  const result = await vectorStore.query(input.query);
  logger.info('Query completed', { resultCount: result.length });

  return processResult(result, config);
}
```

### Memory Management

```typescript
// Use Mastra's Memory service for caching
class CachingService {
    private static memory = new Memory()

    static async getCachedData(key: string): Promise<any> {
        const cached = await this.memory.get(key)
        if (cached) {
            logger.info('Cache hit', { key })
            return cached
        }

        const data = await expensiveOperation(key)
        await this.memory.set(key, data, { ttl: 3600 }) // 1 hour TTL

        logger.info('Cache miss, data cached', { key })
        return data
    }
}
```

## Performance Considerations

### Batch Processing

- Process multiple items together when possible
- Use appropriate batch sizes (typically 10-100 items)
- Implement progress tracking for long operations
- Handle partial failures gracefully

### Caching Strategies

- Cache expensive computations (embeddings, processed data)
- Use appropriate TTL values
- Implement cache invalidation strategies
- Monitor cache hit rates

### Memory Management

- Clean up large objects after use
- Use streaming for large datasets
- Monitor memory usage in long-running operations
- Implement backpressure for high-throughput scenarios

### Error Recovery

- Implement retry logic for transient failures
- Use circuit breaker patterns for external services
- Provide fallback strategies when possible
- Log errors with sufficient context for debugging
