---
applyTo: '**'
description: 'Instructions for GitHub Copilot when contributing to this codebase'
---
# Multi-Domain AI Orchestration Platform

> **Last Updated**: 2025-10-21
> **System Version**: Mastra 0.16.0+, Next.js 15+, React 19+
> **Purpose**: Context-aware guidance for GitHub Copilot when contributing to this codebase

---

## 1. Project Identity & Purpose

This is a **Multi-Domain AI Orchestration Platform** built with Mastra, NOT just a "governed RAG" system (that's a legacy name). The platform orchestrates 27 AI agents across 5 capability domains:

### Five Capability Domains

| Domain | Purpose | Key Agents | Key Tools | Use When |
|--------|---------|------------|-----------|----------|
| **Governed RAG** | Secure knowledge access with RBAC | identity, policy, retrieve, rerank, answerer, verifier | jwt-auth, vector-query | User needs secure document retrieval with role-based access and classification filtering |
| **Deep Research** | Multi-source intelligence gathering | research | arxiv, googleScholar, googleTrends, googleNews, googleFinance, web scraping (6 tools), pdfToMarkdown | User needs academic papers, market intelligence, news analysis, or web data |
| **Financial Intelligence** | Real-time market analysis | cryptoAnalysis, stockAnalysis, marketEducation | Alpha Vantage (2), Polygon (6), Finnhub (4+) | User needs crypto/stock analysis, technical indicators, or market education |
| **Content Generation** | Multi-agent synthesis | copywriter, editor, report, evaluation, learning, productRoadmap | extractLearnings, evaluateResult, contentCleaner | User needs content creation, editing, learning extraction, or product roadmap management |
| **Interactive State** | User state influences AI | chatWorkflow, productRoadmapAgent | Cedar OS state subscription, agentic actions | User interacts with Canvas/Roadmap and agents should respond to state changes |

**When to use which domain**:
- Document Q&A with security → Governed RAG
- Academic/financial research → Deep Research + Financial Intelligence
- Blog posts, reports, product features → Content Generation
- Interactive canvas with AI → Interactive State (Cedar OS)

---

## 2. Tech Stack & Versions

### Core Dependencies

```json
{
  "node": ">=20.19.5",
  "typescript": "ES2022 target, strict: true",
  "react": "^19.0.0+",
  "next": "^15.0.0+",
  "@mastra/core": "^0.16.0+",
  "@mui/joy": "^5.x",
  "tailwindcss": "^4.x",
  "zod": "^3.x",
  "vitest": "latest"
}
```

### Two UI Styling Systems (CRITICAL)

⚠️ **DO NOT MIX THESE**:

1. **Dashboard Pages** (`/app/protected/dashboard`, `/app/`, `/components/`):
   - Use **MUI Joy UI** components (`@mui/joy`)
   - Import: `import { Button, Card, Typography } from '@mui/joy'`
   - Theme: JoyProvider with light/dark mode

2. **Cedar OS Pages** (`/app/protected/cedar-os`, `/cedar/`):
   - Use **Tailwind v4 CSS ONLY**
   - Import: `import './globals.css'` (Tailwind config in @theme)
   - Components: RoadmapCanvas, CedarCopilot, custom Cedar components

### Database & Vector Store

```typescript
// PostgreSQL + PgVector
// Connection: pgStore (max: 20 connections, idle: 30s, timeout: 2s)
// Embeddings: 1568-dimensional (gemini-embedding-001)
// Schema: process.env.DB_SCHEMA ?? 'public'

import { pgStore, pgVector } from './src/mastra/config/pg-storage'
```

---

## 3. Code Organization Patterns

### Directory Structure

```
src/mastra/
├── index.ts              # Mastra registration hub (27 agents, 10 workflows, 3 networks)
├── apiRegistry.ts        # HTTP endpoint exposure for workflows
├── ai-tracing.ts         # Langfuse observability setup
├── agents/               # Single-responsibility AI agents
│   ├── *.agent.ts        # Governed RAG agents (Pattern A)
│   ├── *Agent.ts         # Domain agents (Pattern B)
│   ├── network/          # Multi-agent networks
│   └── custom-scorers.ts # Quality scoring functions
├── workflows/            # Multi-step orchestration
│   ├── *workflow.ts      # Sequential/parallel/streaming orchestration
│   └── chatWorkflowSharedTypes.ts  # Cedar OS type definitions
├── tools/                # Side-effectful operations (50+ tools)
│   ├── *-tool.ts         # Tool definitions with Kilocode headers
│   └── *-tools.ts        # Tool suites (web scraping, financial APIs)
├── services/             # Business logic & integrations
├── schemas/              # Zod data contracts
│   └── agent-schemas.ts  # Centralized validation schemas
├── config/               # External service setup
│   ├── pg-storage.ts     # PostgreSQL + PgVector configuration
│   ├── google.ts         # Google AI models
│   ├── logger.ts         # Structured logging utilities
│   └── role-hierarchy.ts # RBAC role definitions
├── policy/               # Access control rules
│   └── acl.yaml          # Classification & role permissions
└── mcp/                  # Model Context Protocol server
```

### Import Path Conventions

```typescript
// Agents
import { retrieveAgent } from '@/src/mastra/agents/retrieve.agent'
import { researchAgent } from '@/src/mastra/agents/researchAgent'

// Workflows
import { governedRagAnswer } from '@/src/mastra/workflows/governed-rag-answer.workflow'
import { chatWorkflow } from '@/src/mastra/workflows/chatWorkflow'

// Tools
import { vectorQueryTool } from '@/src/mastra/tools/vector-query.tool'
import { webScraperTool } from '@/src/mastra/tools/web-scraper-tool'

// Services
import { AuthenticationService } from '@/src/mastra/services/AuthenticationService'
import { VectorService } from '@/src/mastra/services/VectorService'

// Schemas
import { ragAnswerSchema, jwtClaimsSchema } from '@/src/mastra/schemas/agent-schemas'

// Config
import { pgStore, pgVector } from '@/src/mastra/config/pg-storage'
import { googleAI } from '@/src/mastra/config/google'
import { log, logStepStart, logStepEnd, logError } from '@/src/mastra/config/logger'
```

### File Naming Patterns

- Agents (Pattern A - Governed RAG): `noun.agent.ts` (e.g., `retrieve.agent.ts`, `verifier.agent.ts`)
- Agents (Pattern B - Domain): `nounAgent.ts` (e.g., `researchAgent.ts`, `copywriterAgent.ts`)
- Workflows: `kebab-case.workflow.ts` (e.g., `governed-rag-answer.workflow.ts`)
- Tools: `kebab-case-tool.ts` or `kebab-case-tools.ts` (e.g., `web-scraper-tool.ts`, `polygon-tools.ts`)
- Services: `PascalCaseService.ts` (e.g., `AuthenticationService.ts`, `VectorService.ts`)
- Schemas: `agent-schemas.ts` (centralized)

---

## 4. Agent Development

### Two Agent Patterns

**When to use Pattern A vs Pattern B**:

| Criteria | Pattern A: Governed RAG | Pattern B: Domain Agents |
|----------|-------------------------|--------------------------|
| **Purpose** | Secure pipeline step with single responsibility | Complex domain task requiring multiple capabilities |
| **Tool Count** | 0-1 tools (ONE tool call OR pure LLM) | 3-25+ tools (multiple tool calls per execution) |
| **Instructions** | Strict numbered steps with MANDATORY/FORBIDDEN | Flexible guidance with domain expertise |
| **Processors** | None | Input: UnicodeNormalizer, Output: BatchPartsProcessor |
| **Scorers** | 2 max (e.g., responseQuality, accuracy) | 5-6+ (creativity, taskCompletion, responseQuality, etc.) |
| **Memory** | Typically none (stateless) | pgMemory enabled for context retention |
| **Examples** | identity, retrieve, rerank, answerer, verifier | research, assistant, copywriter, productRoadmap |
| **Use When** | Building secure RAG pipeline | Building research, analysis, or content generation |

### Pattern A: Governed RAG Agent Template

```typescript
// filepath: src/mastra/agents/example.agent.ts
import { Agent } from '@mastra/core/agent'
import { z } from 'zod'
import { googleAI } from '../config/google'
import { exampleTool } from '../tools/example-tool'
import { responseQualityScorer, accuracyScorer } from './custom-scorers'

// 1. Define runtime context interface
export interface ExampleAgentContext {
  userId?: string
  sessionId?: string
  metadata?: Record<string, unknown>
}

// 2. Define Zod schemas (centralize in agent-schemas.ts in production)
export const exampleInputSchema = z.object({
  query: z.string().describe('User query'),
  context: z.string().optional().describe('Additional context'),
})

export const exampleOutputSchema = z.object({
  result: z.string().describe('Processing result'),
  confidence: z.number().min(0).max(1).describe('Confidence score'),
})

export type ExampleAgentInput = z.infer<typeof exampleInputSchema>
export type ExampleAgentOutput = z.infer<typeof exampleOutputSchema>

// 3. Create agent with strict instructions
export const exampleAgent = new Agent({
  id: 'example',
  name: 'Example Agent',
  model: googleAI('gemini-2.5-flash-preview-09-2025'),
  
  // PATTERN A: Single tool OR no tool
  tools: { exampleTool },
  
  instructions: `You are an Example Agent responsible for [SINGLE CLEAR RESPONSIBILITY].

MANDATORY STEPS:
1. Parse the user query from input
2. Call exampleTool with structured parameters
3. Return result in the specified output format

FORBIDDEN ACTIONS:
- Do NOT make multiple tool calls
- Do NOT deviate from the specified output schema
- Do NOT include explanations beyond the required fields

OUTPUT REQUIREMENTS:
- Always return valid JSON matching exampleOutputSchema
- Include confidence score based on tool result quality`,

  // PATTERN A: 2 scorers max
  scorers: [responseQualityScorer, accuracyScorer],
})
```

### Pattern B: Domain Agent Template

```typescript
// filepath: src/mastra/agents/complexAgent.ts
import { Agent } from '@mastra/core/agent'
import { z } from 'zod'
import { googleAI } from '../config/google'
import { pgMemory } from '../config/pg-storage'
import { 
  webScraperTool, 
  arxivTool, 
  polygonStockQuotesTool,
  googleScholarTool,
  pgQueryTool 
} from '../tools'
import { 
  responseQualityScorer, 
  taskCompletionScorer, 
  creativityScorer,
  accuracyScorer,
  relevanceScorer 
} from './custom-scorers'

// 1. Define runtime context
export interface ComplexAgentContext {
  userId: string
  tier: 'free' | 'pro' | 'enterprise'
  riskTolerance?: 'low' | 'medium' | 'high'
}

// 2. Define schemas
export const complexInputSchema = z.object({
  task: z.string().describe('Complex task description'),
  domain: z.enum(['research', 'financial', 'content']).describe('Task domain'),
  constraints: z.object({
    maxSources: z.number().default(10),
    timeRange: z.string().optional(),
  }).optional(),
})

export const complexOutputSchema = z.object({
  insights: z.array(z.object({
    source: z.string(),
    finding: z.string(),
    confidence: z.number(),
  })),
  synthesis: z.string().describe('Synthesized analysis'),
  recommendations: z.array(z.string()),
})

// 3. Create agent with multiple tools and processors
export const complexAgent = new Agent({
  id: 'complex',
  name: 'Complex Domain Agent',
  model: googleAI('gemini-2.5-flash-preview-09-2025'),
  
  // PATTERN B: Multiple tools (3-25+)
  tools: {
    webScraper: webScraperTool,
    arxiv: arxivTool,
    polygonQuotes: polygonStockQuotesTool,
    googleScholar: googleScholarTool,
    pgQuery: pgQueryTool,
  },
  
  instructions: `You are a Complex Domain Agent capable of multi-source research and analysis.

CAPABILITIES:
- Web scraping for current information
- Academic paper search via arXiv and Google Scholar
- Financial data retrieval from Polygon API
- Database queries for historical context
- Multi-step reasoning and synthesis

APPROACH:
1. Analyze the task and identify required information sources
2. Use appropriate tools to gather data from multiple sources
3. Cross-reference findings for accuracy
4. Synthesize insights into coherent recommendations
5. Cite sources and provide confidence scores

QUALITY STANDARDS:
- Verify information from multiple sources when possible
- Flag contradictory findings
- Provide nuanced analysis rather than simplistic conclusions
- Adapt approach based on domain (research vs financial vs content)`,

  // PATTERN B: Input processor for text normalization
  inputProcessors: {
    text: {
      stripControlChars: true,
      collapseWhitespace: true,
      preserveEmojis: true,
      trim: true,
    },
  },
  
  // PATTERN B: Output processor for batch streaming
  outputProcessors: {
    batchParts: {
      batchSize: 20,
      maxWaitTime: 50,
      emitOnNonText: true,
    },
  },
  
  // PATTERN B: 5-6+ scorers for comprehensive evaluation
  scorers: [
    responseQualityScorer,
    taskCompletionScorer,
    creativityScorer,
    accuracyScorer,
    relevanceScorer,
  ],
  
  // PATTERN B: Enable memory for context retention
  memory: pgMemory,
})
```

### Agent Registration

All agents MUST be registered in `/src/mastra/index.ts`:

```typescript
// src/mastra/index.ts
export const mastra = new Mastra({
  storage: pgStore,
  logger: log,
  agents: {
    // Governed RAG Pipeline (Pattern A)
    identity: identityAgent,
    policy: policyAgent,
    retrieve: retrieveAgent,
    rerank: rerankAgent,
    answerer: answererAgent,
    verifier: verifierAgent,
    
    // Domain Agents (Pattern B)
    research: researchAgent,
    assist: assistantAgent,
    assistant: assistantAgent, // alias
    copywriter: copywriterAgent,
    editor: editorAgent,
    report: reportAgent,
    evaluation: evaluationAgent,
    learning: learningExtractionAgent,
    productRoadmap: productRoadmapAgent,
    
    // Financial Agents (Pattern B)
    cryptoAnalysis: cryptoAnalysisAgent,
    stockAnalysis: stockAnalysisAgent,
    marketEducation: marketEducationAgent,
    
    // Special Agents
    a2aCoordinator: a2aCoordinatorAgent,
    csvToExcalidraw: csvToExcalidrawAgent,
    imageToCsv: imageToCsvAgent,
    excalidrawValidator: excalidrawValidatorAgent,
    
    // Networks (vNext multi-agent orchestration)
    'research-content-network': researchContentNetwork,
    'governed-rag-network': governedRagNetwork,
    'financial-team-network': financialTeamNetwork,
  },
  // ... workflows, observability, etc.
})
```

---

## 5. Workflow Development

### Workflow Patterns

**Sequential Workflow** (use for linear pipelines):

```typescript
// filepath: src/mastra/workflows/example-sequential.workflow.ts
import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { logStepStart, logStepEnd, logError } from '../config/logger'

const step1 = createStep({
  id: 'step-1',
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ processed: z.string() }),
  execute: async ({ inputData }) => {
    const startTime = Date.now()
    logStepStart('step-1', inputData)
    
    try {
      const result = { processed: inputData.input.toUpperCase() }
      logStepEnd('step-1', result, Date.now() - startTime)
      return result
    } catch (error) {
      logError('step-1', error, inputData)
      throw error
    }
  },
})

const step2 = createStep({
  id: 'step-2',
  inputSchema: z.object({ processed: z.string() }),
  outputSchema: z.object({ final: z.string() }),
  execute: async ({ inputData }) => {
    // Similar logging pattern
    return { final: `Result: ${inputData.processed}` }
  },
})

export const sequentialWorkflow = createWorkflow({
  id: 'example-sequential',
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ final: z.string() }),
})
  .then(step1)
  .then(step2)
  .commit()
```

**Parallel Workflow** (use for concurrent processing):

```typescript
// filepath: src/mastra/workflows/example-parallel.workflow.ts
import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'

const fetchDataStep = createStep({
  id: 'fetch-data',
  inputSchema: z.object({ symbols: z.array(z.string()) }),
  outputSchema: z.object({ 
    items: z.array(z.object({ symbol: z.string() })) 
  }),
  execute: async ({ inputData }) => {
    return { items: inputData.symbols.map(symbol => ({ symbol })) }
  },
})

const processItemStep = createStep({
  id: 'process-item',
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({ 
    symbol: z.string(), 
    result: z.string() 
  }),
  execute: async ({ inputData }) => {
    // Process single item
    return { 
      symbol: inputData.symbol, 
      result: `Processed ${inputData.symbol}` 
    }
  },
})

export const parallelWorkflow = createWorkflow({
  id: 'example-parallel',
  inputSchema: z.object({ symbols: z.array(z.string()) }),
  outputSchema: z.object({ 
    results: z.array(z.object({ 
      symbol: z.string(), 
      result: z.string() 
    })) 
  }),
})
  .then(fetchDataStep)
  .foreach({
    step: processItemStep,
    iterableKey: 'items',
  })
  .commit()
```

**Streaming Workflow** (use for real-time progress):

```typescript
// filepath: src/mastra/workflows/example-streaming.workflow.ts
import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { ChunkType } from '@mastra/core/stream'

const streamingStep = createStep({
  id: 'streaming-step',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.object({ response: z.string() }),
  execute: async ({ inputData, streamHandler }) => {
    // Emit streaming events
    streamHandler?.({
      type: ChunkType.CUSTOM,
      data: { event: 'start', step: 'streaming-step' },
    })
    
    // Simulate streaming chunks
    const chunks = ['Part ', 'one. ', 'Part ', 'two.']
    for (const chunk of chunks) {
      streamHandler?.({
        type: ChunkType.TEXT,
        data: chunk,
      })
    }
    
    streamHandler?.({
      type: ChunkType.CUSTOM,
      data: { event: 'complete', step: 'streaming-step' },
    })
    
    return { response: chunks.join('') }
  },
})

export const streamingWorkflow = createWorkflow({
  id: 'example-streaming',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.object({ response: z.string() }),
})
  .then(streamingStep)
  .commit()
```

### Workflow Registration

Register workflows in `/src/mastra/index.ts`:

```typescript
export const mastra = new Mastra({
  // ... agents, storage, logger
  workflows: {
    'governed-rag-index': governedRagIndex,
    'governed-rag-answer': governedRagAnswer,
    'research-workflow': researchWorkflow,
    'generate-report-workflow': generateReportWorkflow,
    'chat-workflow': chatWorkflow,
    'content-generation': contentGenerationWorkflow,
    'financial-analysis-workflow': financialAnalysisWorkflow,
    'financial-analysis-workflow-v2': financialAnalysisWorkflowV2,
    'financial-analysis-workflow-v3': financialAnalysisWorkflowV3,
  },
})
```

---

## 6. Network Development

Networks enable **non-deterministic LLM-based orchestration** where the LLM decides which agents/workflows to route to based on the task.

### Network Template

```typescript
// filepath: src/mastra/agents/network/example-network.ts
import { Agent } from '@mastra/core/agent'
import { googleAI } from '../../config/google'
import { pgMemory } from '../../config/pg-storage'
import { researchAgent } from '../researchAgent'
import { copywriterAgent } from '../copywriterAgent'
import { editorAgent } from '../editorAgent'
import { contentGenerationWorkflow } from '../../workflows/contentGenerationWorkflow'

/**
 * Example Network
 * 
 * Dynamically routes tasks to specialized agents and workflows based on the task description.
 * 
 * Available primitives:
 * - Agents: research, copywriter, editor
 * - Workflows: content-generation
 * 
 * Use cases:
 * - Multi-agent content creation (research → write → edit)
 * - Complex research with synthesis
 * - Dynamic task decomposition
 */
export const exampleNetwork = new Agent({
  id: 'example-network',
  name: 'Example Network',
  description: 'Routes tasks to research, copywriting, and editing agents based on task requirements',
  model: googleAI('gemini-2.5-flash-preview-09-2025'),
  
  // Register sub-agents for dynamic routing
  agents: {
    research: researchAgent,
    copywriter: copywriterAgent,
    editor: editorAgent,
  },
  
  // Register workflows this network can execute
  workflows: {
    'content-generation': contentGenerationWorkflow,
  },
  
  // Enable memory for task history
  memory: pgMemory,
  
  instructions: `You are a Network Coordinator that routes tasks to specialized agents and workflows.

AVAILABLE AGENTS:
- research: Gathers information from multiple sources (web, academic, financial)
- copywriter: Creates engaging content based on research
- editor: Refines and improves written content

AVAILABLE WORKFLOWS:
- content-generation: End-to-end content creation pipeline

ROUTING LOGIC:
1. Analyze the user's task to determine required capabilities
2. Route to appropriate agent if single capability needed
3. Execute workflow if multi-step orchestration needed
4. Return results in user-friendly format

EXAMPLE ROUTING:
- "Research recent AI trends" → research agent
- "Write a blog post about AI" → content-generation workflow (research → copywriter → editor)
- "Improve this paragraph" → editor agent`,
})
```

### Network Registration

```typescript
// src/mastra/index.ts
export const mastra = new Mastra({
  agents: {
    // ... other agents
    'example-network': exampleNetwork,
    'research-content-network': researchContentNetwork,
    'governed-rag-network': governedRagNetwork,
    'financial-team-network': financialTeamNetwork,
  },
})
```

---

## 7. Tool Creation

ALL tools MUST have a **Kilocode approval header** documenting ownership, justification, and side effects.

### Tool Template with Kilocode Header

```typescript
// filepath: src/mastra/tools/example-tool.ts
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

/**
 * Kilocode: Tool Approval
 * owner: team-backend
 * justification: Fetch external data for research tasks with rate limiting
 * allowedDomains: [api.example.com, data.example.com]
 * allowedDataPaths: [/tmp/research-cache]
 * sideEffects: { network: true, write: true }
 * inputSchema: src/mastra/schemas/agent-schemas.ts    //ExampleToolInput
 * outputSchema: src/mastra/schemas/agent-schemas.ts   //ExampleToolOutput
 * approvedBy: sam
 * approvalDate: 2025-01-XX
 */

export const exampleTool = createTool({
  id: 'example-tool',
  name: 'Example Tool',
  description: 'Fetches data from external API with caching and rate limiting',
  
  // Input validation
  inputSchema: z.object({
    query: z.string().describe('Search query'),
    limit: z.number().min(1).max(100).default(10).describe('Result limit'),
  }),
  
  // Output validation
  outputSchema: z.object({
    results: z.array(z.object({
      id: z.string(),
      title: z.string(),
      url: z.string(),
    })),
    cached: z.boolean().describe('Whether result was served from cache'),
  }),
  
  // Implementation
  execute: async ({ data, runtimeContext }) => {
    // 1. Validate runtime context if needed
    const userId = runtimeContext?.userId as string | undefined
    
    // 2. Perform operation with error handling
    try {
      // Fetch from API (example)
      const response = await fetch(`https://api.example.com/search?q=${encodeURIComponent(data.query)}&limit=${data.limit}`)
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }
      
      const results = await response.json()
      
      // 3. Return validated output
      return {
        results: results.items.slice(0, data.limit),
        cached: false,
      }
    } catch (error) {
      throw new Error(`Example tool error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },
})
```

### Tool Registration Approaches

**Option 1: Direct agent registration**:

```typescript
export const exampleAgent = new Agent({
  tools: {
    example: exampleTool,
    webScraper: webScraperTool,
  },
})
```

**Option 2: Tool suite import**:

```typescript
// src/mastra/tools/index.ts
export { webScraperTool, batchWebScraperTool } from './web-scraper-tool'
export { alphaVantageCryptoTool, alphaVantageStockTool } from './alpha-vantage.tool'

// Agent file
import { webScraperTool, alphaVantageCryptoTool } from '../tools'
```

---

## 8. Security Requirements

### JWT Claims Structure

All authenticated requests MUST include JWT with these claims:

```typescript
// From agent-schemas.ts
export const jwtClaimsSchema = z.object({
  sub: z.string().describe('User ID'),
  role: z.enum(['public', 'employee', 'dept_viewer', 'dept_admin', 'admin']),
  department: z.string().optional().describe('User department'),
  clearanceLevel: z.enum(['public', 'internal', 'confidential']).optional(),
  exp: z.number().describe('Token expiration timestamp'),
  iat: z.number().describe('Token issued timestamp'),
})
```

### Access Filter Pattern

ALWAYS use access filters in vector queries:

```typescript
import { vectorQueryTool } from '../tools/vector-query.tool'
import { jwtClaimsSchema } from '../schemas/agent-schemas'

// In agent execution
const claims = jwtClaimsSchema.parse(runtimeContext.claims)

const result = await vectorQueryTool.execute({
  data: {
    query: userQuery,
    accessFilter: {
      allowTags: [claims.department ?? 'public'],
      maxClassification: claims.clearanceLevel ?? 'public',
    },
    topK: 10,
  },
  runtimeContext,
})
```

### Classification Enforcement

Documents MUST be classified in corpus:

```markdown
---
classification: internal
tags: ["engineering", "architecture"]
department: engineering
---

# Document Content
```

### Sensitive Data Handling

**In Logs**:

```typescript
import { log, logStepStart, logStepEnd, logError } from '../config/logger'

// GOOD: Structured logging (automatically masks sensitive fields)
logStepStart('authentication', { userId: claims.sub, role: claims.role })

// BAD: Logging raw tokens
console.log(`JWT: ${token}`) // ❌ Never log tokens directly
```

**In Traces**:

```typescript
// SensitiveDataFilter automatically strips these from Langfuse traces:
// password, secret, token, key, apiKey, auth, jwt, apikey, 
// authorization, x-api-key, accesstoken, refreshtoken
```

**In Streams**:

```typescript
import { createMaskedStream } from '../config/pg-storage'

// Mask sensitive tags in streaming responses
const maskedStream = createMaskedStream(originalStream, ['password', 'secret', 'token'])
```

---

## 9. Testing Standards

### Unit Test Pattern (Vitest)

```typescript
// filepath: src/mastra/services/__tests__/ExampleService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ExampleService } from '../ExampleService'

describe('ExampleService', () => {
  let service: ExampleService
  
  beforeEach(() => {
    service = new ExampleService()
  })
  
  it('should process data correctly', async () => {
    const input = { query: 'test' }
    const result = await service.process(input)
    
    expect(result).toHaveProperty('processed')
    expect(result.processed).toBe('TEST')
  })
  
  it('should handle errors gracefully', async () => {
    await expect(service.process({ query: '' })).rejects.toThrow('Query cannot be empty')
  })
})
```

### Integration Test Pattern (Workflows)

```typescript
// filepath: src/mastra/workflows/__tests__/exampleWorkflow.test.ts
import { describe, it, expect } from 'vitest'
import { exampleWorkflow } from '../exampleWorkflow'

describe('Example Workflow', () => {
  it('should execute all steps successfully', async () => {
    const result = await exampleWorkflow.execute({
      input: 'test query',
    })
    
    expect(result).toHaveProperty('final')
    expect(result.final).toContain('Result:')
  })
  
  it('should validate input schema', async () => {
    await expect(exampleWorkflow.execute({ 
      input: 123 // Invalid type
    })).rejects.toThrow()
  })
})
```

### Agent Test Pattern

```typescript
// filepath: src/mastra/agents/__tests__/exampleAgent.test.ts
import { describe, it, expect } from 'vitest'
import { exampleAgent } from '../example.agent'

describe('Example Agent', () => {
  it('should call tool and return valid output', async () => {
    const result = await exampleAgent.run({
      query: 'test query',
    })
    
    expect(result).toHaveProperty('result')
    expect(result).toHaveProperty('confidence')
    expect(result.confidence).toBeGreaterThanOrEqual(0)
    expect(result.confidence).toBeLessThanOrEqual(1)
  })
})
```

### Test Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- ExampleService.test.ts

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

---

## 10. Common Patterns

### Error Handling with Structured Logging

```typescript
import { logStepStart, logStepEnd, logError } from '../config/logger'

const exampleStep = createStep({
  id: 'example-step',
  execute: async ({ inputData }) => {
    const startTime = Date.now()
    logStepStart('example-step', inputData)
    
    try {
      const result = await performOperation(inputData)
      logStepEnd('example-step', result, Date.now() - startTime)
      return result
    } catch (error) {
      logError('example-step', error, inputData)
      throw error
    }
  },
})
```

### Streaming Response Pattern

```typescript
import { ChunkType } from '@mastra/core/stream'

const streamingStep = createStep({
  execute: async ({ inputData, streamHandler }) => {
    // Emit progress event
    streamHandler?.({
      type: ChunkType.CUSTOM,
      data: { 
        event: 'progress', 
        step: 'processing',
        progress: 0.5 
      },
    })
    
    // Stream text chunks
    for (const chunk of textChunks) {
      streamHandler?.({
        type: ChunkType.TEXT,
        data: chunk,
      })
    }
    
    // Emit completion event
    streamHandler?.({
      type: ChunkType.CUSTOM,
      data: { event: 'complete' },
    })
    
    return finalResult
  },
})
```

### Cedar OS State Integration

```typescript
// filepath: app/protected/cedar-os/context.ts
import { useSubscribeStateToAgentContext } from '@cedarosai/cedar-copilot/react'
import { useRoadmapStore } from './state'

export function CedarStateProvider({ children }) {
  const nodes = useRoadmapStore(state => state.nodes)
  
  // Subscribe Cedar state to agent context
  useSubscribeStateToAgentContext({
    key: 'roadmapNodes',
    value: nodes,
    description: 'Current roadmap feature nodes',
  })
  
  return <>{children}</>
}
```

```typescript
// Agent can access Cedar state via mentions
// In chatWorkflow.ts
const buildAgentContextStep = createStep({
  execute: async ({ inputData }) => {
    const mentions = inputData.cedarCustomFields?.mentions ?? []
    
    // Extract roadmap nodes from mentions
    const roadmapNodes = mentions.find(m => m.key === 'roadmapNodes')?.value
    
    // Build context for agent
    return {
      agentContext: {
        userMessage: inputData.userMessage,
        roadmapState: roadmapNodes,
      },
    }
  },
})
```

### Database Connection Pattern

```typescript
import { pgStore, pgVector } from '../config/pg-storage'

// For general data storage
const data = await pgStore.query('SELECT * FROM users WHERE id = $1', [userId])

// For vector search
const results = await pgVector.query({
  query: 'What is RAG security?',
  topK: 10,
  filter: {
    allowTags: ['engineering'],
    maxClassification: 'internal',
  },
})
```

---

## 11. Anti-Patterns (AVOID THESE)

### ❌ Using `any` Type Without Justification

```typescript
// BAD
function processData(data: any) { // ❌
  return data.someProperty
}

// GOOD
function processData(data: ProcessInput) { // ✅
  return data.someProperty
}
```

### ❌ Direct Database Queries Without pgQueryTool

```typescript
// BAD
const result = await pool.query('SELECT * FROM documents') // ❌

// GOOD
import { pgQueryTool } from '../tools/pg-query.tool'
const result = await pgQueryTool.execute({
  data: { query: 'SELECT * FROM documents' },
  runtimeContext,
})
```

### ❌ API Calls Without Kilocode Approval

```typescript
// BAD - No Kilocode header
export const unapprovedTool = createTool({ // ❌
  execute: async () => {
    return fetch('https://external-api.com')
  },
})

// GOOD - Kilocode header present
/**
 * Kilocode: Tool Approval
 * owner: team-backend
 * justification: Required for feature X
 * allowedDomains: [external-api.com]
 * sideEffects: { network: true }
 * approvedBy: sam
 * approvalDate: 2025-01-XX
 */
export const approvedTool = createTool({ // ✅
  execute: async () => {
    return fetch('https://external-api.com')
  },
})
```

### ❌ Tools Without Schemas

```typescript
// BAD
export const unvalidatedTool = createTool({ // ❌
  execute: async ({ data }) => {
    // No input/output schemas
    return { result: data.query }
  },
})

// GOOD
export const validatedTool = createTool({ // ✅
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ data }) => {
    return { result: data.query }
  },
})
```

### ❌ Workflows Without Logging

```typescript
// BAD
const silentStep = createStep({ // ❌
  execute: async ({ inputData }) => {
    return processData(inputData) // No logging
  },
})

// GOOD
const loggedStep = createStep({ // ✅
  execute: async ({ inputData }) => {
    const startTime = Date.now()
    logStepStart('step-id', inputData)
    try {
      const result = processData(inputData)
      logStepEnd('step-id', result, Date.now() - startTime)
      return result
    } catch (error) {
      logError('step-id', error, inputData)
      throw error
    }
  },
})
```

### ❌ Mixing UI Styling Systems

```typescript
// BAD - Mixing Joy UI with Tailwind in same component
import { Button } from '@mui/joy' // ❌
export function MixedComponent() {
  return <Button className="bg-blue-500">Click</Button> // Tailwind + Joy
}

// GOOD - Use Joy UI in Dashboard
import { Button } from '@mui/joy' // ✅
export function DashboardComponent() {
  return <Button variant="solid">Click</Button>
}

// GOOD - Use Tailwind in Cedar OS
export function CedarComponent() { // ✅
  return <button className="bg-blue-500 px-4 py-2">Click</button>
}
```

### ❌ Ignoring Access Filters in Vector Queries

```typescript
// BAD
const results = await vectorQueryTool.execute({ // ❌
  data: { query: userQuery, topK: 10 },
  // Missing accessFilter - user could see classified docs!
})

// GOOD
const claims = jwtClaimsSchema.parse(runtimeContext.claims)
const results = await vectorQueryTool.execute({ // ✅
  data: { 
    query: userQuery, 
    topK: 10,
    accessFilter: {
      allowTags: [claims.department ?? 'public'],
      maxClassification: claims.clearanceLevel ?? 'public',
    },
  },
  runtimeContext,
})
```

### ❌ Hardcoded Secrets

```typescript
// BAD
const apiKey = 'sk-1234567890abcdef' // ❌

// GOOD
const apiKey = process.env.OPENAI_API_KEY // ✅
if (!apiKey) throw new Error('OPENAI_API_KEY not set')
```

---

## 12. Quick Reference

### Registered Agents (27 total)

| Agent ID | Pattern | Purpose | Key Tools |
|----------|---------|---------|-----------|
| `identity` | A | JWT authentication | jwt-auth |
| `policy` | A | Access policy enforcement | - |
| `retrieve` | A | Vector document retrieval | vector-query |
| `rerank` | A | Relevance scoring | - |
| `answerer` | A | Answer composition | - |
| `verifier` | A | Compliance verification | - |
| `research` | B | Multi-source research | 25+ tools (arxiv, googleScholar, web scraping, financial APIs) |
| `assist` | B | General assistance | 14 tools (pgQuery, file ops, web scraper, weather) |
| `assistant` | B | Alias for `assist` | Same as assist |
| `report` | B | Report generation | - (pure LLM) |
| `copywriter` | B | Content writing | web scraper, htmlToMarkdown, contentCleaner |
| `editor` | B | Content editing | - |
| `evaluation` | B | Result evaluation | evaluateResult |
| `learning` | B | Learning extraction | extractLearnings |
| `productRoadmap` | B | Product feature mgmt | 10+ tools (extractLearnings, editor, copywriter, pgQuery, vectorQuery) |
| `cryptoAnalysis` | B | Cryptocurrency analysis | Alpha Vantage crypto, Polygon crypto |
| `stockAnalysis` | B | Stock market analysis | Alpha Vantage stock, Polygon stock, Finnhub |
| `marketEducation` | B | Financial education | Financial APIs, web scraping |
| `a2aCoordinator` | B | Agent-to-agent coordination | All agents + workflows |
| `csvToExcalidraw` | B | CSV to diagram conversion | file operations |
| `imageToCsv` | B | Image to CSV extraction | file operations |
| `excalidrawValidator` | B | Diagram validation | file operations |
| `research-content-network` | Network | Research & content orchestration | research, copywriter, editor agents + workflows |
| `governed-rag-network` | Network | Secure RAG orchestration | retrieve, rerank, answerer, verifier agents |
| `financial-team-network` | Network | Financial analysis orchestration | crypto, stock, market agents + financial workflows |

### Registered Workflows (10 total)

| Workflow ID | Purpose | Key Steps | Pattern |
|-------------|---------|-----------|---------|
| `governed-rag-index` | Document indexing | Single-step batching | Sequential |
| `governed-rag-answer` | Secure Q&A | identity → policy → retrieve → rerank → answer → verify | Sequential |
| `research-workflow` | Multi-phase research | Research tasks with approval gates | Sequential |
| `generate-report-workflow` | Report generation | Data → synthesis → formatting | Sequential |
| `chat-workflow` | Cedar OS chat | fetchContext → buildContext → routeAgent → callAgent | Sequential + Streaming |
| `content-generation` | Content creation | Research → write → edit → evaluate | Sequential |
| `financial-analysis-workflow` | Financial analysis V1 | Sequential symbol processing | Sequential |
| `financial-analysis-workflow-v2` | Financial analysis V2 | Batch symbol processing | Parallel (.foreach) |
| `financial-analysis-workflow-v3` | Financial analysis V3 | Concurrent analysis streams | Parallel (multiple branches) |

### Tools by Domain (50+ total)

**Web Scraping (6)**:
- `webScraperTool`, `batchWebScraperTool`, `siteMapExtractorTool`, `linkExtractorTool`, `htmlToMarkdownTool`, `contentCleanerTool`

**Financial APIs (12+)**:
- Alpha Vantage: `alphaVantageCryptoTool`, `alphaVantageStockTool`
- Polygon: `polygonStockQuotesTool`, `polygonStockAggregatesTool`, `polygonStockFundamentalsTool`, `polygonCryptoQuotesTool`, `polygonCryptoAggregatesTool`, `polygonCryptoSnapshotsTool`
- Finnhub: `finnhubQuotesTool`, `finnhubCompanyTool`, `finnhubFinancialsTool`, `finnhubTechnicalTool`, `finnhubAnalysisTool`

**SERP/Google (5)**:
- `googleScholarTool`, `googleTrendsTool`, `googleFinanceTool`, `googleNewsTool`, `googleNewsLiteTool`

**Academic (2)**:
- `arxivTool`, `pdfToMarkdownTool`

**Database (4)**:
- `pgQueryTool`, `vectorQueryTool`, `graphQueryTool`, `graphRagQueryTool`

**Document Processing (5)**:
- `mdocumentChunker`, `extractLearningsTool`, `evaluateResultTool`, `editorTool`, `copywriterTool`

**Data Files (4)**:
- `readDataFileTool`, `writeDataFileTool`, `deleteDataFileTool`, `listDataDirTool`

**Auth (1)**:
- `jwt-auth.tool`

**Utility (1)**:
- `weatherTool`

### Key Schemas

```typescript
// JWT & Auth
jwtClaimsSchema         // JWT token structure
accessFilterSchema      // Vector query access control

// RAG
documentContextSchema   // Retrieved document metadata
ragAnswerSchema         // Final RAG answer format
verificationResultSchema // Compliance verification result

// Workflows
ChatInputSchema         // Chat workflow input (includes Cedar custom fields)
ChatOutputSchema        // Chat workflow output
CedarCustomFieldsSchema // Cedar OS state integration

// Financial
stockAnalysisOutputSchema    // Stock analysis result
cryptoAnalysisOutputSchema   // Crypto analysis result
marketEducationOutputSchema  // Market education result
```

### Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:password@localhost:5432/mastra_db
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret

# Optional
DB_SCHEMA=public
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# External APIs (required for specific agents)
OPENAI_API_KEY=your_openai_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
POLYGON_API_KEY=your_polygon_key
FINNHUB_API_KEY=your_finnhub_key

# Observability (optional)
LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
LANGFUSE_SECRET_KEY=your_langfuse_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com

# Cedar OS (frontend)
NEXT_PUBLIC_MASTRA_URL=http://localhost:4111
```

---

## Conclusion

This codebase is a **Multi-Domain AI Orchestration Platform** with 27 agents, 10 workflows, 50+ tools, and 3 networks across 5 capability domains. Follow the patterns documented here for consistency, security, and maintainability.

**Key Principles to Remember**:
1. **Type safety**: Zod schemas + TypeScript interfaces everywhere
2. **Single responsibility**: Each agent has ONE clear purpose
3. **Separation of concerns**: Tool → Service → Agent → Workflow → Network
4. **Security by design**: JWT claims → access filters → classification enforcement
5. **Observable**: Structured logging at every step
6. **Streaming**: Progress updates for long-running tasks
7. **Memory & context**: pgMemory for agents, context for workflows
8. **Progressive enhancement**: Start simple, compose, orchestrate

When in doubt, refer to existing implementations in the codebase and follow the patterns established there.
