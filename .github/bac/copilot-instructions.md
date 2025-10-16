---
applyTo:: ["**"]
description::'Instructions for GitHub Copilot specific to this repository.'
tags:: ["repository-specific", "copilot", "instructions"]
version:: "1.0.0"
last_updated:: "2025-09-24T19:13:49Z"
status:: "stable"
---

# Repository-specific Copilot instructions

This repository uses Next.js (app router), TypeScript, Tailwind CSS, and shadcn/ui primitives. It also includes Mastra workflows under src/mastra and a Mastra backend used for authentication and agent orchestration.

## Architecture Overview

**Multi-Agent RAG System** with 15+ specialized agents orchestrated through Mastra workflows:

- **Security Pipeline**: JWT auth → Role-based access → Classification filtering (public/internal/confidential)
- **Agent Chain**: Retrieve → Rerank → Answer → Verify
- **Storage**: PostgreSQL with PgVector (vectors) + Supabase (auth)
- **Observability**: Langfuse tracing with structured logging

## Critical Patterns & Conventions

### Agent Development

- **Instructions Format**: Use strict, rule-based instructions with numbered steps and "MANDATORY"/"FORBIDDEN" sections
- **Tool Constraints**: Agents make EXACTLY ONE tool call, never modify security parameters
- **Memory**: Use `createResearchMemory()` for persistent agent context
- **Models**: Prefer Google Gemini 2.5 variants over OpenAI for cost efficiency

### Workflow Structure

```typescript
// Pattern: Authentication → Processing → Validation
const workflowStep = createStep({
  id: 'step-name',
  inputSchema: z.object({...}),
  outputSchema: z.object({...}),
  execute: async ({ inputData }) => {
    logStepStart('step-name', inputData);
    try {
      // Implementation
      logStepEnd('step-name', result, duration);
      return result;
    } catch (error) {
      logError('step-name', error, inputData);
      throw error;
    }
  }
});
```

### Security Implementation

- **JWT Claims**: Always validate `sub`, `roles[]`, `tenant`, `stepUp` fields
- **Access Filters**: Generate from role hierarchy, never bypass classification levels
- **Environment Secrets**: Server-only, never `NEXT_PUBLIC_` prefix
- **Cookies**: HttpOnly for tokens, secure flags in production

### Service Layer Architecture

- **ValidationService**: Input validation and environment checks
- **AuthenticationService**: JWT verification and access policy generation
- **VectorQueryService**: PostgreSQL with PgVector queries with security filtering
- **RoleService**: Hierarchical role expansion and tag generation

## Development Workflow

### Essential Commands

- **Full Dev**: `npm run dev` (runs Next.js + Mastra concurrently)
- **Individual Services**: `npm run dev:next` | `npm run dev:mastra`
- **Infrastructure**: `docker-compose up -d` (PostgreSQL with PgVector)
- **Indexing**: `npm run cli index` (embed corpus documents)
- **Testing**: Use internal linting tools (get_errors) for validation

### Environment Setup

```bash
# Required for development
OPENAI_API_KEY=...
DATABASE_URL=postgresql://user:password@localhost:5432/mastra_db
JWT_SECRET=dev-secret
GOOGLE_GENERATIVE_AI_API_KEY=...
JWT_TOKEN=your-jwt-token-here
```

## Code Quality Standards

### TypeScript Patterns

- **Strict Mode**: Enabled in `tsconfig.json`, catches schema mismatches early
- **Zod Schemas**: Define in `src/mastra/schemas/agent-schemas.ts`
- **Interface Consistency**: Match Zod schemas with TypeScript interfaces

### Logging Standards

```typescript
// Structured logging pattern
logStepStart('step-name', { key: value })
logStepEnd('step-name', result, duration)
logError('step-name', error, context)
```

### File Organization

- **Agents**: `src/mastra/agents/*.agent.ts`
- **Workflows**: `src/mastra/workflows/*.workflow.ts`
- **Tools**: `src/mastra/tools/*.tool.ts`
- **Services**: `src/mastra/services/*.ts`
- **Schemas**: `src/mastra/schemas/*.ts`

## Integration Points

### External Services

- **PostgreSQL with PgVector**: Vector database on port 5432
- **Supabase**: Authentication and user management
- **Langfuse**: AI observability and tracing

### API Patterns

- **Streaming**: SSE for real-time chat responses
- **Authentication**: JWT in request body, not headers
- **Error Handling**: Structured error responses with status codes

## Common Pitfalls to Avoid

- **Security Bypass**: Never modify `maxClassification` or `allowTags` in agents
- **Multiple Tool Calls**: Agents must make EXACTLY ONE tool call
- **Environment Leaks**: Never expose secrets in client bundles
- **Storage Confusion**: PostgreSQL with PgVector for vectors, Supabase for auth
- **Role Hierarchy**: Always use `RoleService.generateAccessTags()` for expansion

## Testing Strategy

- **Unit Tests**: Service layer validation
- **Integration Tests**: Workflow execution
- **Security Tests**: Access control verification
- **Performance Tests**: Vector query optimization

## Deployment Considerations

- **Environment Variables**: Validate all required vars on startup
- **Database Migrations**: Handle schema updates gracefully
- **Health Checks**: Implement for all services (PostgreSQL with PgVector, Supabase, etc.)
- **Monitoring**: Langfuse integration for production observability

---

## Quick Reference (Legacy)

**Read these files first**: README.md, package.json, app/layout.tsx, app/globals.css, lib/mastra/mastra-client.ts, src/mastra/.

**DO NOT modify**: `components/ui/` (shadcn primitives) unless explicitly requested.

**Security**: Keep secrets server-only (no `NEXT_PUBLIC_` prefix), use HttpOnly cookies.

**Auth**: Use `lib/mastra/mastra-client.ts` as canonical Mastra client surface.

**Dev commands**: `npm run dev` (Next + Mastra), `docker-compose up -d`, `npm run cli index`.

**Agent workflow checklist**:

1. Use internal linting tools (get_errors) to validate changes
2. Obey `copilot-instructions.md`
3. Use mcp tools where applicable, see below. Thesde are pre-approved and vetted tools.
4. Use best practices from above, especially around security.
5. Make sure your fully implement & use any unused imports or variables.
6. Make sure your code is well-typed and leverages zod schemas.
7. Must be typesafe, no `any` types allowed unless absolutely necessary.
8. Use internal linting tools (get_errors) to validate changes
9. Code must be well-documented with JSDoc/TSDoc comments.
10. Code must be future-proofed for scalability and maintainability. No psuedo code or placeholders, take your time to fully implement it correctly, even if it takes longer.
11. Follow the established patterns and conventions in the codebase.

**Reviewer**: sam (primary maintainer)

**Ban**: never run `npm run build` or `npm run lint` as these are broken and will cause issues. Always use internal linting tools (get_errors) to validate changes.

---

## MCP Tools in Workflows

- mcp_mastra_mastraExamples
- mcp_cedar-mcp_mastraSpecialist
- Cedar-MCP tools
- Lotus Wisdom tools
  _Iterate until the tool is satified_
- mcp_mcp-deepwiki_deepwiki_fetch
- mcp_mastra_mastraBlog
- mcp_mastra_mastraChanges
- mcp_mastra_mastraDocs
- vscode-websearchforcopilot*webSearch
  \_Iterate until the user is satified*
- mcp*multi-agent-d_multiagentdebate
  \_Iterate until the tool is satified*
- mcp*clear-thought_visualreasoning
  \_Iterate until the tool is satified*
- mcp_clear-thought_metacognitivemonitoring

**Reviewer**: sam (primary maintainer)
