<!-- AGENTS-META {"title":"Mastra vNext Agent Networks","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/src/mastra/networks","tags":["layer:ai","domain:rag","type:networks","status":"stable"],"status":"stable"} -->

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

## Change Log

| Version | Date (UTC) | Change                                          |
| ------- | ---------- | ----------------------------------------------- |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata. |
| 1.0.0   | 2025-09-24 | Initial standardized documentation added        |
