<!-- AGENTS-META {"title":"Mastra Agents Directory","version":"2.0.0","last_updated":"2025-10-15T17:15:00Z","applies_to":"/src/mastra/agents","tags":["layer:backend","domain:rag","type:agents","status:stable"],"status":"stable"} -->

# 🤖 Mastra Agents Directory (`/src/mastra/agents`)

## 🎭 AI Assistant Knowledge Base

**Complete reference for all 18 agent implementations with visual architecture, dependencies, and integration patterns.**

---

## 📊 System Overview

```mermaid
graph TB
    subgraph "Agent Categories"
        Identity[Identity & Security<br/>2 agents]
        Retrieval[Retrieval Pipeline<br/>2 agents]
        Assembly[Answer Assembly<br/>2 agents]
        Research[Research<br/>3 agents]
        Content[Content Generation<br/>3 agents]
        UI[UI / Application<br/>3 agents]
        Advanced[Templates & Advanced<br/>3 agents]
    end

    subgraph "Core Infrastructure"
        Memory[Memory: pgMemory<br/>1568-dim embeddings]
        Models[Models: Google AI<br/>gemini-flash-lite]
        Tools[Tools: 15+ tools<br/>vector, auth, etc.]
        Workflows[Workflows: 8 workflows<br/>governed-rag, research, etc.]
    end

    Identity --> Memory
    Retrieval --> Memory
    Assembly --> Memory
    Research --> Memory
    Content --> Memory
    UI --> Memory
    Advanced --> Memory

    Memory --> Models
    Tools --> Memory
    Workflows --> Memory
```

## 📁 Complete File Inventory

| Agent File | Size | Purpose | Tools | Memory | Model | Category |
|------------|------|---------|-------|--------|-------|----------|
| `identity.agent.ts` | 1.4KB | JWT token parsing & user identity extraction | `jwt-auth.tool` | ✅ | Gemini Flash | Identity & Security |
| `policy.agent.ts` | 2.8KB | Access control policy derivation from user roles | `policy-filter` | ✅ | Gemini Flash | Identity & Security |
| `retrieve.agent.ts` | 2.7KB | Secure vector similarity search with role filtering | `vector-query.tool` | ✅ | Gemini Flash | Retrieval Pipeline |
| `rerank.agent.ts` | 1.7KB | Relevance scoring and result ranking | `rerank-service` | ✅ | Gemini Flash | Retrieval Pipeline |
| `answerer.agent.ts` | 2.3KB | Context synthesis and answer generation | `citation-builder` | ✅ | Gemini Flash | Answer Assembly |
| `verifier.agent.ts` | 3.1KB | Response verification and compliance checking | `verification-service` | ✅ | Gemini Flash | Answer Assembly |
| `researchAgent.ts` | 3.9KB | Multi-source research and information gathering | `web-scraper`, `research-tools` | ✅ | Gemini Flash | Research |
| `evaluationAgent.ts` | 2.9KB | Research result evaluation and quality scoring | `evaluation-service` | ✅ | Gemini Flash | Research |
| `learningExtractionAgent.ts` | 2.6KB | Insight extraction and pattern recognition | `extraction-tools` | ✅ | Gemini Flash | Research |
| `copywriterAgent.ts` | 4.5KB | Creative content drafting and copy generation | `writing-tools` | ✅ | Gemini Flash | Content Generation |
| `editorAgent.ts` | 4.0KB | Content refinement and quality improvement | `editing-tools` | ✅ | Gemini Flash | Content Generation |
| `reportAgent.ts` | 3.1KB | Structured report compilation and formatting | `report-tools` | ✅ | Gemini Flash | Content Generation |
| `productRoadmapAgent.ts` | 7.4KB | Product roadmap management and UI state bridging | `roadmap-tools` | ✅ | Gemini Flash | UI / Application |
| `assistant.ts` | 6.1KB | General assistance and task coordination | `assistant-tools` | ✅ | Gemini Flash | UI / Application |
| `mcpAgent.ts` | 1.7KB | External service integration via MCP protocol | `mcp-client` | ✅ | Gemini Flash | UI / Application |
| `starterAgent.ts` | 3.0KB | Minimal agent scaffold and reference implementation | `basic-tools` | ✅ | Gemini Flash | Templates & Advanced |
| `selfReferencingAgent.ts` | 3.3KB | Advanced agent patterns and self-modification | `advanced-tools` | ✅ | Gemini Flash | Templates & Advanced |
| `template-reviewer-agent.ts` | 4.4KB | Template review and rating for hackathons | `review-tools` | ✅ | Gemini Flash | Templates & Advanced |

## 🔧 Technical Architecture

### Agent Definition Pattern

```typescript
export const exampleAgent = new Agent({
    id: 'example',
    name: 'Example Agent',
    description: 'Purpose and capabilities',
    model: geminiFlashLite, // Google AI model
    instructions: ({ runtimeContext }) => `
        # ROLE
        You are a specialized agent...

        # RULES
        1. Always follow single tool call policy
        2. Use only provided context
        3. Return structured output

        # OUTPUT
        JSON format with specific schema
    `,
    tools: [tool1, tool2], // Array of available tools
    memory: pgMemory, // 1568-dimension vector memory
})
```

## 🔗 Integration Patterns

### Workflow Integration

```mermaid
sequenceDiagram
    participant W as Workflow
    participant A as Agent
    participant T as Tool
    participant S as Service
    
    W->>A: Invoke agent with context
    A->>T: Single tool call
    T->>S: Execute business logic
    S-->>T: Return result
    T-->>A: Tool response
    A-->>W: Structured output
```

## 📋 Usage Patterns

### Common Agent Invocation

```typescript
// In workflow step
const result = await identityAgent.execute({
    runtimeContext: { userId, requestId },
    input: { jwtToken }
})

// Result: Structured output with user claims
```

## 🚨 Common Issues & Solutions

### Issue: Agent Memory Overflow
**Problem**: Large conversation threads causing memory issues
**Solution**: Implement memory cleanup and compression strategies

### Issue: Tool Call Timeouts
**Problem**: External API calls exceeding timeout limits
**Solution**: Implement retry logic with exponential backoff

## 🔍 Debugging Guide

### Agent Inspection

```typescript
// Check agent configuration
console.log(agent.id, agent.tools.length, agent.memory.config)

// Monitor tool calls
agent.on('toolCall', (call) => {
    console.log('Tool called:', call.tool.id, call.input)
})
```

## 📚 Related Files

- **`/src/mastra/tools/`** - Tool implementations used by agents
- **`/src/mastra/workflows/`** - Workflow orchestration patterns
- **`/src/mastra/services/`** - Business logic services
- **`/src/mastra/config/pg-storage.ts`** - Memory and vector configuration

---

## 📈 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2025-10-15 | Complete rewrite with comprehensive AI-focused documentation, visual diagrams, and technical details |
| 1.2.0 | 2025-10-15 | Added missing agents and updated metadata |
| 1.1.0 | 2025-10-08 | Content verification and accuracy updates |
| 1.0.0 | 2025-09-24 | Initial standardized documentation |

**Total Agents:** 18 | **Total Lines:** ~45K | **Memory Usage:** 1568-dim vectors
