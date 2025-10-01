# Next Session Priorities

**Date**: Post-2025-01-XX (After Memory Bank Completion)

## 🎯 Primary Objective: Workflow Expansion and Refinement

Transform demo workflows into production-ready, Cedar-integrated orchestration pipelines for all agents.

## 📋 Key Work Items

### 1. Create Workflows for All Agents

**Content Generation Pipeline**:
- Copywriter agent workflow (4 content types: blog, marketing, technical, business)
- Editor agent workflow (refinement and polishing)
- Evaluation agent workflow (quality assessment)
- Combined pipeline: copywriter → editor → evaluation → output

**Research Pipeline Enhancement**:
- Refine researchWorkflow.ts with better suspend/resume
- Web scraper integration
- Learning extraction workflow
- Report generation workflow
- Complete pipeline: research → learning extraction → report compilation

**Professional RAG Workflow**:
- Transform demo gov-rag into production version
- Question → Answer with Cedar type integration
- Enhanced citation and audit logging
- Performance optimizations

### 2. Workflow Template Expansion

**Two Excellent Examples to Build From**:

1. **chatWorkflow.ts** (src/mastra/workflows/chatWorkflow.ts)
   - Uses productRoadmapAgent
   - Demonstrates fetchContext → buildAgentContext → emitMastraEvents → callAgent
   - Includes streaming support with SSE
   - Memory linkage (resourceId, threadId)
   - Structured output with ActionSchema
   - Perfect template for Cedar-integrated workflows

2. **chatWorkflow1.ts** (src/mastra/workflows/chatWorkflow1.ts)
   - Uses starterAgent
   - Simpler structure: fetchContext → buildAgentContext → callAgent
   - Good baseline for straightforward agent workflows
   - Demonstrates temperature, maxTokens, systemPrompt configuration

**Workflow Pattern**:
```typescript
fetchContext (get data)
  ↓
buildAgentContext (prepare messages)
  ↓
callAgent (invoke with streaming)
  ↓
return output
```

### 3. Cedar OS Type Integration

**Required**:
- Define Cedar types for workflow consumption
- Create Cedar ↔ Mastra type bridge
- Enable workflows to accept Cedar state via context
- Document type contracts

**Files to Reference**:
- cedar/ directory (existing components)
- productRoadmapAgent (already Cedar-aware)
- roadmapTool.ts (Cedar API bridge)

### 4. CLI and Type System Documentation

**Files to Document**:

1. **src/cli/index.ts**
   - Corpus loading via CLI
   - Document indexing command
   - Usage: `npm run cli index`

2. **src/types.ts**
   - Principal interface (authentication)
   - AccessFilter interface (RBAC)
   - Document interface (content model)
   - Chunk interface (vector data)

3. **src/index.ts**
   - Main exports
   - Public API surface

**Example Tenant**: "acme" (use in all documentation)

## 🔧 Technical Approach

### Phase 1: Analyze Existing Workflows
- Study chatWorkflow.ts structure (productRoadmap example)
- Study chatWorkflow1.ts structure (starter example)
- Identify common patterns
- Document workflow best practices

### Phase 2: Create Agent Workflows
- Start with simpler agents (copywriter, editor)
- Build up to complex pipelines (research, RAG)
- Ensure all workflows support:
  - Streaming (SSE)
  - Error handling
  - Progress updates
  - Structured output
  - Memory linkage

### Phase 3: Cedar Integration
- Define Cedar types
- Update workflows to accept Cedar context
- Test Cedar ↔ Mastra bridge
- Document integration patterns

### Phase 4: Testing and Validation
- Test each workflow independently
- Test combined pipelines
- Validate streaming and error handling
- Performance benchmarking

## 📚 Reference Files

**Workflow Examples**:
- `/src/mastra/workflows/chatWorkflow.ts` - productRoadmapAgent with Cedar
- `/src/mastra/workflows/chatWorkflow1.ts` - starterAgent template
- `/src/mastra/workflows/governed-rag-answer.workflow.ts` - 6-stage security pipeline
- `/src/mastra/workflows/researchWorkflow.ts` - multi-phase with suspend/resume

**Agent Files** (all in `/src/mastra/agents/`):
- copywriterAgent.ts
- editorAgent.ts
- evaluationAgent.ts
- researchAgent.ts
- learningExtractionAgent.ts
- reportAgent.ts
- productRoadmapAgent.ts

**Type Definitions**:
- `/src/types.ts` - Principal, AccessFilter, Document, Chunk
- `/src/mastra/workflows/chatWorkflowSharedTypes.ts` - ActionSchema, ChatAgentResponseSchema

**CLI**:
- `/src/cli/index.ts` - Corpus loading and indexing

## 🎯 Success Criteria

- [ ] All 16 agents have dedicated workflows OR are integrated into pipelines
- [ ] Workflows follow consistent patterns (fetchContext → buildAgentContext → callAgent)
- [ ] All workflows support streaming via SSE
- [ ] Cedar types defined and integrated
- [ ] Professional RAG workflow replaces demo version
- [ ] Content generation pipeline operational
- [ ] Research pipeline enhanced
- [ ] CLI and types fully documented
- [ ] Memory bank updated with workflow documentation

## 💡 Key Insight

> "Having comprehensive, well-designed workflows will allow professional implementation compared to trying to go in blind. The existing chatWorkflow examples provide excellent templates to expand upon."

## 🚀 Estimated Effort

- **Workflow Creation**: 60% of session time
- **Cedar Type Integration**: 20% of session time
- **Documentation**: 15% of session time
- **Testing/Validation**: 5% of session time

**Total**: 1-2 full development sessions

## 📝 Notes

- Start with chatWorkflow.ts and chatWorkflow1.ts as templates
- Keep workflows focused and single-purpose
- Reuse patterns across similar agents
- Document decisions in memory bank as you go
- Test streaming immediately (don't defer)
- "acme" is example tenant name throughout

---

**Status**: Ready to begin  
**Priority**: High  
**Blockers**: None (memory bank complete)  
**Dependencies**: Existing workflow examples, agent implementations
