# Mastra Framework Guidelines & Patterns

## Core Mastra Concepts

### Mastra Instance Configuration

```typescript
// Main Mastra instance setup pattern from index.ts
export const mastra = new Mastra({
    storage: new LibSQLStore({
        url: 'file:../mastra.db',
    }),
    logger,
    agents: {
        retrieve: retrieveAgent,
        rerank: rerankAgent,
        answerer: answererAgent,
        verifier: verifierAgent,
    },
    workflows: {
        'governed-rag-index': governedRagIndex,
        'governed-rag-answer': governedRagAnswer,
    },
    vectors: {
        qdrant: new QdrantVector({
            url: process.env.QDRANT_URL!,
            apiKey: process.env.QDRANT_API_KEY,
        }),
    },
})
```

### Agent Design Patterns

#### Standard Agent Structure

```typescript
// Follow this pattern for all agents
export const myAgent = new Agent({
    id: 'agent-id', // Unique identifier
    name: 'agent-name', // Display name
    model: openAIModel, // Use shared model config
    instructions: `
    You are a [specific role] agent. Your responsibilities:
    1. [Primary task]
    2. [Security constraints]
    3. [Output format requirements]
    
    CRITICAL RULES:
    - [Security rule 1]
    - [Security rule 2]
    - [Output format rule]
  `,
    tools: { toolName: toolInstance }, // Optional tools
})
```

#### Agent Instructions Best Practices

- **Be Specific**: Clear, actionable instructions
- **Security First**: Always include security constraints
- **Output Format**: Specify exact JSON structure expected
- **Error Handling**: Define behavior for edge cases
- **Tool Usage**: Explicit tool calling instructions

#### Example Agent Patterns from Codebase

**Identity Agent Pattern** (JWT validation):

```typescript
export const identityAgent = new Agent({
    id: 'identity',
    name: 'identity',
    model: openAIModel,
    instructions: `You are an identity extraction agent. Your task is to:
1. Call the jwt-auth tool with the provided JWT token
2. Return the extracted claims in the exact format received
3. If the JWT is invalid or expired, return an error message

Always use the jwt-auth tool - never attempt to decode JWTs manually.`,
    tools: { jwtAuth: jwtAuthTool },
})
```

**Policy Agent Pattern** (Access control):

```typescript
export const policyAgent = new Agent({
    id: 'policy',
    name: 'policy',
    model: openAIModel,
    instructions: `You are a policy enforcement agent. Given user claims, generate access filters.

Rules:
1. Extract roles from claims and create "role:<role>" tags for each
2. If tenant is provided, add "tenant:<tenant>" tag
3. Determine maximum classification based on roles and stepUp status
4. Never invent roles or tenants not present in the claims
5. Always output valid JSON matching the schema`,
})
```

**Retrieval Agent Pattern** (Strict tool usage):

```typescript
export const retrieveAgent = new Agent({
    id: 'retrieve',
    name: 'retrieve',
    model: openAIModel,
    instructions: `You are a document retrieval agent. You MUST call vectorQueryTool EXACTLY ONCE and ONLY return its results.

**MANDATORY STEPS:**
1. Parse input JSON for 'question' and 'access' fields
2. Call vectorQueryTool EXACTLY ONCE with these exact parameters
3. Return ONLY what the tool returns - never add your own content

**STRICTLY FORBIDDEN:**
- Multiple tool calls with different parameters
- Creating fake documents or citations
- Adding explanatory text about what you found`,
    tools: { vectorQueryTool },
})
```

### Tool Creation Patterns

#### Standard Tool Structure

```typescript
export const myTool = createTool({
    id: 'tool-id',
    description: 'Clear description of tool purpose',
    inputSchema: z.object({
        // Define expected inputs with Zod
        param1: z.string(),
        param2: z.number().optional(),
    }),
    outputSchema: z.object({
        // Define expected outputs with Zod
        result: z.string(),
        metadata: z.object({}).optional(),
    }),
    execute: async ({ context }) => {
        try {
            // Tool implementation
            const result = await performOperation(context)
            return result
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Tool execution failed: ${error.message}`)
            }
            throw new Error('Tool execution failed: Unknown error')
        }
    },
})
```

#### JWT Auth Tool Pattern

```typescript
export const jwtAuthTool = createTool({
    id: 'jwt-auth',
    description: 'Verify JWT and return claims (roles, tenant, stepUp)',
    inputSchema: z.object({ jwt: z.string() }),
    outputSchema: z.object({
        sub: z.string(),
        roles: z.array(z.string()),
        tenant: z.string().optional(),
        stepUp: z.boolean().optional(),
        exp: z.number().optional(),
        iat: z.number().optional(),
    }),
    execute: async ({ context }) => {
        try {
            return await AuthenticationService.verifyJWT(context.jwt)
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`JWT verification failed: ${error.message}`)
            }
            throw new Error('JWT verification failed: Unknown error')
        }
    },
})
```

### Workflow Patterns

#### Workflow Step Creation

```typescript
const myStep = createStep({
    id: 'step-id',
    description: 'Clear description of step purpose',
    inputSchema: z.object({
        // Define expected inputs
    }),
    outputSchema: z.object({
        // Define expected outputs
    }),
    execute: async ({ inputData, mastra }) => {
        const startTime = Date.now()
        logStepStart('step-id', inputData)

        try {
            // Step implementation
            const result = await processData(inputData)

            logStepEnd('step-id', result, Date.now() - startTime)
            return result
        } catch (error) {
            logError('step-id', error, inputData)
            throw error
        }
    },
})
```

#### Workflow Composition

```typescript
export const myWorkflow = createWorkflow({
    id: 'workflow-id',
    description: 'Workflow description',
    inputSchema: z.object({
        // Workflow inputs
    }),
    outputSchema: z.object({
        // Workflow outputs
    }),
})
    .then(step1)
    .then(step2)
    .then(step3)
    .commit()
```

### Schema Patterns with Zod

#### Agent Schema Definitions

```typescript
// Always define schemas for agent inputs/outputs
export const jwtClaimsSchema = z.object({
    sub: z.string(),
    roles: z.array(z.string()),
    tenant: z.string().optional(),
    stepUp: z.boolean().optional(),
    exp: z.number().optional(),
    iat: z.number().optional(),
    iss: z.string().optional(),
})

export const accessFilterSchema = z.object({
    allowTags: z.array(z.string()),
    maxClassification: z.enum(['public', 'internal', 'confidential']),
})

export const documentContextSchema = z.object({
    text: z.string(),
    docId: z.string(),
    versionId: z.string(),
    source: z.string(),
    score: z.number(),
    securityTags: z.array(z.string()),
    classification: z.enum(['public', 'internal', 'confidential']),
})
```

#### Agent Output Schema Usage

```typescript
// Use experimental_output for structured responses
const result = await agent.generate(input, {
    experimental_output: outputSchema,
})

const validatedOutput = result.object || defaultValue
```

### Memory and Storage Patterns

#### LibSQL Storage Configuration

```typescript
// Use LibSQL for workflow state and metadata
storage: new LibSQLStore({
  url: 'file:../mastra.db',  // Local SQLite file
}),
```

#### Vector Storage with Qdrant

```typescript
// Configure Qdrant for vector operations
vectors: {
  qdrant: new QdrantVector({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY,
  }),
},
```

#### Memory Service Usage

```typescript
// Use Memory service for caching and temporary storage
class MyService {
    private memory: Memory

    constructor() {
        this.memory = new Memory()
    }

    async getCachedData(key: string) {
        return await this.memory.get(key)
    }

    async setCachedData(key: string, value: any) {
        await this.memory.set(key, value)
    }
}
```

### Logging Patterns

#### Structured Logging with Mastra

```typescript
// Use Mastra's PinoLogger for structured logging
export const logger = new PinoLogger({
    name: 'workflow-logger',
    level: 'info',
})

// Workflow-specific logging functions
export const logWorkflowStart = (
    workflowId: string,
    input: Record<string, unknown>
) => {
    const message = `🚀 Starting workflow: ${workflowId}`
    const data = {
        workflowId,
        input,
        timestamp: new Date().toISOString(),
    }
    logger.info(message, data)
}

export const logAgentActivity = (
    agentId: string,
    action: string,
    details: Record<string, unknown>
) => {
    const message = `🤖 Agent activity: ${agentId} - ${action}`
    const data = {
        agentId,
        action,
        details,
        timestamp: new Date().toISOString(),
    }
    logger.info(message, data)
}
```

### Error Handling Patterns

#### Service Error Handling

```typescript
// Consistent error handling in services
static async myMethod(input: InputType): Promise<OutputType> {
  try {
    ValidationService.validateInput(input);
    const result = await processInput(input);
    return result;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new Error(`Validation failed: ${error.message}`);
    }

    if (error instanceof Error) {
      throw new Error(`Operation failed: ${error.message}`);
    }

    throw new Error('Unknown error occurred');
  }
}
```

#### Workflow Error Handling

```typescript
// Use workflow decorators for consistent error handling
export const createStepWrapper = <InputType, OutputType>(
    stepId: string,
    description: string,
    executor: StepExecutor<InputType, OutputType>
): StepExecutor<InputType, OutputType> => {
    return withLoggingAndErrorHandling<InputType, OutputType>(
        stepId,
        description
    )(executor)
}
```

### Configuration Patterns

#### OpenAI Model Configuration

```typescript
// Centralized model configuration
export const openAIProvider = createOpenAI({
    apiKey: openAIConfig.apiKey,
    baseURL: openAIConfig.baseURL,
    headers: {
        'X-Request-Timeout': '600000', // Extended timeout for reasoning models
    },
})

export const openAIModel = openAIProvider(openAIConfig.model, {
    structuredOutputs: true,
})
```

#### Environment Variable Handling

```typescript
// Validate environment variables in services
static validateEnvironmentVariable(name: string, value?: string): string {
  if (!value) {
    throw new Error(`${name} environment variable not configured`);
  }
  return value;
}
```

## Mastra Best Practices

### Agent Development

1. **Single Responsibility**: Each agent should have one clear purpose
2. **Tool Integration**: Use tools for external operations, not direct API calls
3. **Structured Output**: Always use Zod schemas for agent outputs
4. **Security First**: Include security constraints in agent instructions
5. **Error Handling**: Provide clear error messages and fallback behavior

### Workflow Design

1. **Step Composition**: Break complex operations into discrete steps
2. **Schema Validation**: Validate inputs/outputs at each step
3. **Logging Integration**: Use structured logging throughout workflows
4. **Error Recovery**: Design workflows to handle partial failures gracefully
5. **Performance Monitoring**: Track step execution times and resource usage

### Service Integration

1. **Static Methods**: Use static methods for stateless service operations
2. **Dependency Injection**: Pass dependencies as parameters, not globals
3. **Validation Layer**: Validate all inputs before processing
4. **Consistent Interfaces**: Use consistent patterns across all services
5. **Memory Management**: Use Mastra's Memory service for caching

### Security Considerations

1. **Input Validation**: Always validate inputs with Zod schemas
2. **Access Control**: Implement role-based access control consistently
3. **Audit Logging**: Log all security-relevant operations
4. **Error Messages**: Don't leak sensitive information in error messages
5. **Token Handling**: Use proper JWT validation and expiry checking

### Performance Optimization

1. **Batch Processing**: Use batch operations for large datasets
2. **Caching Strategy**: Implement caching for expensive operations
3. **Connection Pooling**: Reuse database connections where possible
4. **Streaming**: Use streaming for long-running operations
5. **Memory Efficiency**: Monitor and optimize memory usage in workflows
