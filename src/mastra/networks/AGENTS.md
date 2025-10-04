# Mastra vNext Agent Networks

This directory contains Mastra vNext Agent Network implementations for dynamic, non-deterministic multi-agent orchestration.

## What are Agent Networks?

Agent Networks provide LLM-based routing and orchestration that enables:

- **Non-deterministic execution**: The network decides which agents/workflows to call based on the task
- **Dynamic routing**: Automatically selects the most appropriate primitive (agent or workflow) for each sub-task
- **Memory-backed decisions**: Uses memory to track task history and determine completion
- **Unstructured input handling**: Converts natural language tasks into structured execution plans

## Key Differences: Workflows vs Networks

### Workflows

- ✅ Deterministic, predictable execution
- ✅ Linear or branched sequences
- ✅ You define the exact path
- ✅ Faster performance
- ✅ Better for well-defined processes

### Agent Networks

- ✅ Non-deterministic, LLM-driven routing
- ✅ Dynamic multi-agent collaboration
- ✅ Network decides the execution path
- ✅ Better for complex, unstructured tasks
- ✅ Handles ambiguous inputs

## Available Networks

### 1. Research Content Network (`research-content-network`)

**Purpose**: Multi-agent research and content generation system

**Primitives**:

- **Agents**: research, learning, copywriter, editor, evaluation, report
- **Workflows**: research-workflow, generate-report, content-generation

**Use Cases**:

- Research topics and create comprehensive content
- Extract insights and patterns from information
- Generate high-quality content (blogs, articles, technical docs)
- Iteratively improve content through evaluation

**Example**:

```typescript
const network = mastra.vnext_getNetwork('research-content-network')

// Simple query
const result = await network.generate(
    'Research the latest developments in AI agent orchestration',
    { runtimeContext }
)

// Complex multi-step task
const complexResult = await network.loop(
    'Research top 3 AI frameworks, analyze each, synthesize into report',
    { runtimeContext }
)
```

### 2. Governed RAG Network (`governed-rag-network`)

**Purpose**: Secure RAG with role-based access control

**Primitives**:

- **Agents**: retrieve, rerank, answerer, verifier
- **Workflows**: governed-rag-answer

**Security Features**:

- Hierarchical RBAC (admin → dept_admin → dept_viewer → employee → public)
- Document classifications (public, internal, confidential)
- Zero-trust validation at every stage
- Audit logging for compliance

**Use Cases**:

- Secure knowledge base queries with access control
- Role-based document retrieval
- Compliance-aware response generation
- Audit trails for regulatory requirements

**Example**:

```typescript
const network = mastra.vnext_getNetwork('governed-rag-network')

// Query with role-based access
const result = await network.generate(
    'What are the expense approval thresholds?',
    {
        runtimeContext: {
            principal: {
                sub: 'user123',
                roles: ['role:finance_viewer'],
                tenant: 'acme',
                attrs: { department: 'finance' },
            },
        },
    }
)
```

## Network Methods

### `.generate(message, options)`

**Single task execution** - One-off execution of a single primitive

- Best for: Simple queries, chat-based interfaces, iterative refinement
- Returns: Direct response from the selected primitive
- Memory: Optional (not required)

```typescript
const result = await network.generate('Your query here', { runtimeContext })
```

### `.stream(message, options)`

**Streaming single task execution** - Same as generate but with streaming

```typescript
const stream = await network.stream('Your query here', { runtimeContext })

for await (const chunk of stream) {
    console.log(chunk)
}
```

### `.loop(task, options)`

**Complex multi-step execution** - Breaks down complex tasks into sub-tasks

- Best for: Multi-step reasoning, complex workflows, synthesis tasks
- Returns: Final synthesized result
- Memory: **REQUIRED** (stores task history and enables routing decisions)

```typescript
const result = await network.loop(
    'Complex task requiring multiple agents and synthesis',
    { runtimeContext }
)
```

## How Network Routing Works

1. **Routing Agent**: Makes decisions about which primitive to call
2. **Description-Based**: Uses agent/workflow descriptions for routing
3. **Schema-Aware**: Uses workflow input schemas to determine inputs
4. **Specificity**: Most specific primitive is selected for overlapping capabilities

### Improving Routing

- ✅ Write detailed, descriptive agent descriptions
- ✅ Use descriptive workflow names and descriptions
- ✅ Include clear input schema descriptions
- ✅ Be specific in task instructions
- ✅ Mention specific agents/workflows in complex tasks

**Example**:

```typescript
// Less effective (generic)
'Research cities in France'

// More effective (specific)
'Research the top 3 cities in France. For each city, analyze population,
 economy, and culture. Then use the report agent to synthesize findings
 into a comprehensive comparison.'
```

## Client-Side Usage

Networks can be accessed from the client using `@mastra/client-js`:

```typescript
import { MastraClient } from '@mastra/client-js'

const client = new MastraClient()
const network = client.getVNextNetwork('research-content-network')

// All methods work the same
const result = await network.generate('Your query', { runtimeContext })
const stream = await network.stream('Your query', { runtimeContext })
const loopResult = await network.loop('Complex task', { runtimeContext })
```

## Architecture

```text
NewAgentNetwork
├── Routing Agent (LLM-based decision maker)
│   ├── Analyzes task requirements
│   ├── Reviews available primitives
│   └── Selects most appropriate primitive
├── Agents (Specialized capabilities)
│   ├── Single-purpose agents
│   └── Called with generated prompts
├── Workflows (Multi-step processes)
│   ├── Complex orchestrated steps
│   └── Called with structured inputs
└── Memory (Task history and context)
    ├── Stores execution history
    ├── Enables completion detection
    └── Required for .loop() method
```

## Configuration

Networks are registered in `src/mastra/index.ts`:

```typescript
export const mastra = new Mastra({
    // ... other config
    vnext_networks: {
        'research-content-network': researchContentNetwork,
        'governed-rag-network': governedRagNetwork,
    },
})
```

## Creating New Networks

1. Create new network file: `src/mastra/networks/my-network.ts`
2. Import `NewAgentNetwork` from `'@mastra/core/network/vNext'`
3. Define network configuration:

```typescript
import { NewAgentNetwork } from '@mastra/core/network/vNext'
import { google } from '@ai-sdk/google'
import { createResearchMemory } from '../config/libsql-storage'

export const myNetwork = new NewAgentNetwork({
    id: 'my-network',
    name: 'My Network',
    instructions: 'Detailed description of what this network does...',
    model: google('gemini-2.0-flash-exp'),
    agents: {
        agent1: myAgent1,
        agent2: myAgent2,
    },
    workflows: {
        workflow1: myWorkflow,
    },
    memory: createResearchMemory(), // Required for .loop()
})
```

1. Export from `src/mastra/networks/index.ts`
2. Register in `src/mastra/index.ts`

## Best Practices

### When to Use Networks

✅ **Use Networks when**:

- Task requires reasoning about approach
- Input is unstructured or ambiguous
- Need dynamic multi-agent collaboration
- Want system to figure out the solution path
- Complex synthesis required

❌ **Use Workflows when**:

- Exact steps are known and defined
- Need predictable, repeatable execution
- Performance is critical
- Process is well-documented
- Integration with existing APIs

### Memory Configuration

- **`.generate()` and `.stream()`**: Memory is optional
- **`.loop()`**: Memory is **REQUIRED**
- Memory stores task history for routing decisions
- Use `createResearchMemory()` from `config/libsql-storage`

### Performance Considerations

- Networks are slower than workflows (LLM routing overhead)
- Use `.generate()` for simple tasks
- Use `.loop()` only when multi-step reasoning needed
- Monitor routing decisions and tune descriptions
- Consider caching for repeated patterns

## Testing Networks

```typescript
import { mastra } from './src/mastra'

// Test single task execution
const network = mastra.vnext_getNetwork('research-content-network')
console.log(await network.generate('Test query', { runtimeContext }))

// Test complex task execution
console.log(await network.loop('Multi-step test task', { runtimeContext }))
```

## Troubleshooting

### Network not found

- Verify network is exported from `networks/index.ts`
- Verify network is registered in `mastra.vnext_networks`
- Check network ID matches registration key

### Wrong primitive selected

- Improve agent/workflow descriptions
- Add more detail to input schemas
- Mention specific agents in task instructions
- Review routing agent model quality

### Memory errors with .loop()

- Ensure memory is configured in network
- Verify database connection
- Check LibSQL storage configuration

## Additional Resources

- [Mastra Networks Documentation](https://mastra.ai/en/docs/networks-vnext/overview)
- [Single Task Execution](https://mastra.ai/en/docs/networks-vnext/single-task-execution)
- [Complex Task Execution](https://mastra.ai/en/docs/networks-vnext/complex-task-execution)
- [Agent.network() API Reference](https://mastra.ai/en/reference/agents/network)
