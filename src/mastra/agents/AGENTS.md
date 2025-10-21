<!-- AGENTS-META {"title":"Mastra Agents Directory","version":"2.5.3","last_updated":"2025-10-21T00:00:00Z","applies_to":"/src/mastra/agents","tags":["layer:backend","domain:ai-orchestration","type:agents","status:stable"],"status":"stable"} -->

# 🤖 Mastra Agents Directory (`/src/mastra/agents`)

## 🎭 AI Assistant Knowledge Base

**Complete reference for all 29 backend agent implementations organized by Cedar integration status, with visual architecture, dependencies, custom scorers, and integration patterns. 19 agents have Cedar UI integration for interactive workflows.**

---

## 📊 System Overview

```mermaid
graph TB
    subgraph "Agent Categories"
        Cedar[Cedar-Integrated Agents<br/>19 agents<br/>Backend + UI integration]
        Backend[Backend Agents<br/>6 agents<br/>API-accessible RAG pipeline]
        Template[Template Agents<br/>2 agents<br/>Reference implementations]
        Network[Agent Networks<br/>6 networks<br/>Orchestration layer]
    end

    subgraph "Core Infrastructure"
        Memory[Memory: pgMemory<br/>3072-dim embeddings]
        Models[Models: Google AI<br/>gemini-flash-lite + voice]
        Tools[Tools: 50+ tools<br/>vector, auth, voice, financial, etc.]
        Workflows[Workflows: 10+ workflows<br/>governed-rag, research, financial, etc.]
        Scorers[Scorers: 6 custom<br/>quality, creativity, completion]
        Networks[Networks: 6 agent networks<br/>business-intelligence, customer-lifecycle, etc.]
    end

    Cedar --> Memory
    Backend --> Memory
    Template --> Memory
    Network --> Memory

    Memory --> Models
    Tools --> Memory
    Workflows --> Memory
    Scorers --> Memory
    Networks --> Memory
```

## 📁 Complete File Inventory

| Agent File | Size | Purpose | Tools | Memory | Model | Category |
|------------|------|---------|-------|--------|-------|----------|
| **Cedar-Integrated Agents** | | | | | | |
| `cryptoAnalysisAgent.ts` | 4.2KB | Cryptocurrency market analysis and trading strategies | `polygon-crypto`, `alpha-vantage`, `google-news` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `stockAnalysisAgent.ts` | 4.9KB | Stock market technical and fundamental analysis | `polygon-stock`, `finnhub`, `alpha-vantage` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `marketEducationAgent.ts` | 4.8KB | Financial education and investment teaching | `web-scraper`, `google-scholar`, `extract-learns` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `researchAgent.ts` | 5.1KB | Multi-source research and information gathering | `web-scraper`, `research-tools` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `evaluationAgent.ts` | 2.9KB | Research result evaluation and quality scoring | `evaluation-service` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `learningExtractionAgent.ts` | 2.5KB | Insight extraction and pattern recognition | `extraction-tools` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `answerer.agent.ts` | 2.7KB | Context synthesis and answer generation | `citation-builder` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `voiceAgent.ts` | 4.3KB | Voice-enabled research and interaction | `voice-tools`, `web-scraper` | ✅ | Gemini Flash + Voice | Cedar-Integrated Agents |
| `operations-optimizer.agent.ts` | 3.8KB | Business operations optimization and process improvement | `operations-tools` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `compliance-advisor.agent.ts` | 3.6KB | Regulatory compliance analysis and guidance | `compliance-tools`, `policy-checker` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `sales-intelligence.agent.ts` | 4.1KB | Sales intelligence and customer insights | `sales-tools`, `crm-integration` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `editorAgent.ts` | 4.4KB | Content refinement and quality improvement | `editing-tools` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `assistant.ts` | 5.8KB | General assistance and task coordination | `assistant-tools` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `reportAgent.ts` | 3.4KB | Structured report compilation and formatting | `report-tools` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `csv_to_excalidraw.ts` | 2.8KB | CSV data to Excalidraw diagram conversion | `file-processing`, `diagram-tools` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `image_to_csv.ts` | 2.6KB | Image data extraction to CSV format | `ocr-tools`, `data-processing` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `excalidraw_validator.ts` | 2.4KB | Excalidraw diagram validation and correction | `validation-tools`, `diagram-checker` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `productRoadmapAgent.ts` | 7.7KB | Product roadmap management and UI state bridging | `roadmap-tools` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| `copywriterAgent.ts` | 4.8KB | Creative content drafting and copy generation | `writing-tools` | ✅ | Gemini Flash | Cedar-Integrated Agents |
| **Backend Agents** | | | | | | |
| `identity.agent.ts` | 1.7KB | JWT token parsing & user identity extraction | `jwt-auth.tool` | ✅ | Gemini Flash | Backend Agents |
| `policy.agent.ts` | 3.5KB | Access control policy derivation from user roles | `policy-filter` | ✅ | Gemini Flash | Backend Agents |
| `retrieve.agent.ts` | 3.0KB | Secure vector similarity search with role filtering | `vector-query.tool` | ✅ | Gemini Flash | Backend Agents |
| `rerank.agent.ts` | 2.5KB | Relevance scoring and result ranking | `rerank-service` | ✅ | Gemini Flash | Backend Agents |
| `verifier.agent.ts` | 3.4KB | Response verification and compliance checking | `verification-service` | ✅ | Gemini Flash | Backend Agents |
| `mcpAgent.ts` | 2.0KB | External service integration via MCP protocol | `mcp-client` | ✅ | Gemini Flash | Backend Agents |
| **Template Agents** | | | | | | |
| `starterAgent.ts` | 3.4KB | Minimal agent scaffold and reference implementation | `basic-tools` | ✅ | Gemini Flash | Template Agents |
| `selfReferencingAgent.ts` | 3.6KB | Advanced agent patterns and self-modification | `advanced-tools` | ✅ | Gemini Flash | Template Agents |

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
    memory: pgMemory, // 3072-dimension vector memory
    scorers: {
        responseQuality: {
            scorer: responseQualityScorer,
            sampling: { type: 'ratio', rate: 0.8 }
        },
        taskCompletion: {
            scorer: taskCompletionScorer,
            sampling: { type: 'ratio', rate: 0.7 }
        }
    } // Custom evaluation scorers
})
```

### Custom Scorer System

All agents now include custom scorers for automated evaluation:

- **responseQualityScorer**: Evaluates response accuracy, clarity, and usefulness
- **taskCompletionScorer**: Measures successful task execution and goal achievement
- **creativityScorer**: Assesses creative content generation and originality
- **researchCompletenessScorer**: Evaluates thoroughness of research coverage
- **summaryQualityScorer**: Measures quality of insights and summarization
- **sourceDiversityScorer**: Assesses variety and reliability of information sources

Sampling rates range from 0.6-0.8 for balanced evaluation coverage.

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
| 2.5.3 | 2025-10-21 | Added Cedar integration to copywriterAgent.ts for content creation workflows (moved from Backend to Cedar-Integrated: 19 Cedar, 6 Backend agents) |
| 2.4.0 | 2025-10-21 | Major categorization overhaul: reorganized agents by Cedar integration status (18 Cedar-Integrated UI Agents, 7 Backend Pipeline Agents, 2 Template Agents) to accurately reflect actual system architecture |
| 2.3.2 | 2025-10-21 | Added missing agent networks: business-intelligence-network.ts, customer-lifecycle-network.ts, product-development-network.ts |
| 2.3.1 | 2025-10-21 | Corrected agent counts: Research & Analysis (11 agents), Templates & Advanced (2 agents), total 29 agents |
| 2.3.0 | 2025-10-21 | Complete agent inventory update: added 8 missing agents (operations-optimizer, sales-intelligence, compliance-advisor, csv_to_excalidraw, image_to_csv, excalidraw_validator, a2aCoordinatorAgent, template-reviewer-agent), corrected agent counts and categories |
| 2.2.0 | 2025-10-18 | Added cryptoAnalysisAgent.ts, stockAnalysisAgent.ts, and marketEducationAgent.ts |
| 2.1.1 | 2025-10-17 | Updated memory dimensions from 1568 to 3072 for improved vector embeddings |
| 2.1.0 | 2025-10-17 | Added voiceAgent.ts, updated file sizes after custom scorer integration, added scorer infrastructure to system overview |
| 2.0.0 | 2025-10-15 | Complete rewrite with comprehensive AI-focused documentation, visual diagrams, and technical details |
| 1.2.0 | 2025-10-15 | Added missing agents and updated metadata |
| 1.1.0 | 2025-10-08 | Content verification and accuracy updates |
| 1.0.0 | 2025-09-24 | Initial standardized documentation |

**Total Agents:** 29 | **Total Lines:** ~54K | **Memory Usage:** 3072-dim vectors | **Custom Scorers:** 6 per agent

## 🔗 Agent Networks (`/network/`)

The `network/` subdirectory contains Mastra vNext Agent Network implementations for dynamic, non-deterministic multi-agent orchestration:

- **`business-intelligence-network.ts`** - Business intelligence and analytics network
- **`customer-lifecycle-network.ts`** - Customer lifecycle management and optimization network
- **`financial-team-network.ts`** - Financial analysis network coordinating stock/crypto agents
- **`governed-rag-network.ts`** - RAG pipeline network with identity/policy/retrieval agents
- **`product-development-network.ts`** - Product development and roadmap management network
- **`research-content-network.ts`** - Research and content generation network

Agent Networks provide LLM-based routing that automatically selects appropriate agents/workflows based on task requirements, enabling more flexible and adaptive multi-agent collaboration.
