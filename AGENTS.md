# AGENTS.md

## Project Overview

This is a Next.js application implementing a secure, governed Retrieval-Augmented Generation (RAG) system with role-based access control using Mastra. It features a multi-agent architecture with 15+ specialized agents for secure document retrieval and AI-powered responses.

**Key Technologies:** Next.js, TypeScript, Mastra, Qdrant, LibSQL, Tailwind CSS, shadcn/ui, Zod

## Setup Commands

### Environment Setup

- Install dependencies: `npm install`
- Copy environment template: `cp .env.example .env`
- Start infrastructure: `docker-compose up -d` (Qdrant vector database)
- Index documents: `npm run cli index`
- Start development: `npm run dev`

### Required Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=http://localhost:6333
JWT_SECRET=your_jwt_secret
DATABASE_URL=file:deep-research.db
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

## Development Workflow

### Starting Development Servers

- Full stack (Next.js + Mastra): `npm run dev`
- Next.js only: `npm run dev:next`
- Mastra backend only: `npm run dev:mastra`

### Hot Reload & Watch Mode

- Next.js uses Turbopack for fast hot reload
- Mastra backend supports hot reload for agents/workflows
- Concurrent development with `concurrently` package

### CLI Operations

- Index documents: `npm run cli index`
- Query testing: `npm run cli query "$(npm run jwt:finance)" "What are expense approval thresholds?"`
- Interactive mode: `npm run cli demo`

## Testing Instructions

### Test Commands

- Run all tests: `npm test`
- Run unit tests: `npm run test:unit`
- Run integration tests: `npm run test:integration`
- Generate coverage: `npm run test:coverage`

### Test Configuration

- Framework: Vitest with jsdom environment
- Test files: `src/**/*.test.{ts,tsx}`, `src/**/*.spec.{ts,tsx}`, `tests/**/*.test.{ts,tsx}`
- Global setup: `./globalSetup.ts`
- Test setup: `./testSetup.ts`
- Timeout: 10 seconds per test
- Coverage: v8 provider with HTML, JSON, and LCOV reports

### Test Structure

- Unit tests for services, agents, and utilities
- Integration tests for workflows and API endpoints
- E2E tests using Playwright (configured but may need expansion)

## Code Style Guidelines

### TypeScript Standards

- Strict mode enabled in `tsconfig.json`
- Use Zod schemas for runtime validation
- Interface consistency: Match Zod schemas with TypeScript interfaces
- No `any` types allowed unless absolutely necessary

### Import/Export Patterns

- Use ES modules (`import`/`export`)
- Prefer named exports over default exports
- Group imports: external libraries, internal modules, types

### File Organization

- Agents: `src/mastra/agents/*.agent.ts`
- Workflows: `src/mastra/workflows/*.workflow.ts`
- Tools: `src/mastra/tools/*.tool.ts`
- Services: `src/mastra/services/*.ts`
- Schemas: `src/mastra/schemas/*.ts`

### Naming Conventions

- Files: kebab-case for directories, camelCase for files
- Classes: PascalCase
- Functions/methods: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/interfaces: PascalCase

## Build and Deployment

### Build Commands

- Production build: `npm run build`
- CLI build: `npm run build-cli`
- Start production: `npm run start`

### Build Outputs

- Next.js: `.next/` directory
- CLI: `dist/index.js`
- Static assets: `public/` directory

### Deployment Requirements

- Node.js >= 20.9.0
- Environment variables must be set
- Qdrant database connection required
- Docker Compose for infrastructure in production

## Security Considerations

### Authentication & Authorization

- JWT-based authentication with role claims
- Hierarchical role system: admin > dept_admin > dept_viewer > employee > public
- Step-up authentication for elevated access
- Token validation in every API endpoint

### Data Classification

- Three security levels: public, internal, confidential
- Access control enforced at vector search level
- Audit logging for all security events
- Zero-trust architecture throughout

### Secrets Management

- Server-only environment variables (no `NEXT_PUBLIC_` prefix)
- JWT secrets stored securely
- API keys for external services (OpenAI, Qdrant, etc.)

## Pull Request Guidelines

### Title Format

- Feature: `[feature] Add new agent capability`
- Bug fix: `[fix] Resolve authentication issue`
- Security: `[security] Update JWT validation`
- Documentation: `[docs] Update API reference`

### Required Checks

- `npm run lint` - ESLint + Prettier
- `npm test` - All tests passing
- `npm run build` - Production build succeeds
- Security review for authentication changes

### Code Review Requirements

- TypeScript strict mode compliance
- Zod schema validation for new APIs
- Security implications reviewed
- Test coverage maintained or improved

## Debugging and Troubleshooting

### Common Issues

#### Qdrant Connection Failed

```bash
# Check Qdrant health
curl http://localhost:6333/health

# View logs
docker-compose logs qdrant

# Restart services
docker-compose down && docker-compose up -d
```

#### Authentication Errors

```bash
# Regenerate test tokens
npm run jwt:finance  # or jwt:hr, jwt:admin

# Check JWT secret configuration
echo $JWT_SECRET
```

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules && npm install

# Check TypeScript errors
npx tsc --noEmit
```

### Logging and Monitoring

- Structured logging with `logStepStart`/`logStepEnd`/`logError`
- Workflow tracing with Langfuse (when configured)
- Mastra logs in `logs/` directory
- Performance monitoring through agent execution times

### Performance Optimization

- Vector search optimization in Qdrant
- Batch embedding processing
- Redis caching for frequent queries
- Connection pooling for database operations

## Agent Development Guidelines

### Agent Structure

- **Single Tool Call**: Agents make EXACTLY ONE tool call per execution
- **Strict Instructions**: Use numbered steps with MANDATORY/FORBIDDEN sections
- **Memory Management**: Use `createResearchMemory()` for persistent context
- **Model Selection**: Prefer Google Gemini 2.5 variants for cost efficiency

### Workflow Patterns

```typescript
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

### Security Constraints

- Never modify security parameters in agent instructions
- Always validate access control before data retrieval
- Use role-based filtering in all vector queries
- Maintain audit trails for compliance

## MCP Integration

The system integrates with Model Context Protocols for enhanced agent capabilities:

- `mcp_mastra_mastraExamples`: Example implementations
- `mcp_cedar-mcp_mastraSpecialist`: Specialized Mastra tools
- `mcp_mastra_mastraBlog`: Blog content integration
- `mcp_mastra_mastraDocs`: Documentation access

Iterate until tools are satisfied with results.

## Additional Notes

### Monorepo Considerations

- Single package structure with clear module separation
- Shared utilities in `src/utils/`
- Type definitions in `src/types/`
- Environment-specific configurations

### Development Tips

- Use `npm run dev` for concurrent development
- Check `logs/mastra.log` for backend issues
- Use `npm run pretty` for code formatting
- Follow the established patterns in existing agents/workflows

### Architecture Decision Records

- JWT for authentication (not headers, sent in request body)
- Hierarchical roles with inheritance
- Zero-trust security model
- Multi-agent orchestration through Mastra workflows

This AGENTS.md file provides the technical context needed for coding agents to effectively contribute to the governed RAG system. Refer to README.md for general project information and user-facing documentation.
