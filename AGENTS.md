<!-- AGENTS-META {"title":"Project Root","version":"1.5.0","last_updated":"2025-09-24T13:30:00Z","applies_to":"/","tags":["layer:root","domain:rag","domain:auth","type:overview","status:stable"],"status":"stable"} -->

# AGENTS.md

> Standardized agent documentation format v1.1.0 (root). This file now serves as the canonical index for all subdirectory `AGENTS.md` files. Update the metadata block above (never remove it) when making structural changes.

## Persona

**Name:** `{root_persona_name}` = "Governed RAG System Architect"  
**Role:** "I maintain the high-level directory contract, enforce documentation & governance standards, and ensure cross-layer architectural integrity (frontend ↔ backend ↔ AI orchestration)."  
**Focus:** Index integrity, cross-link completeness, security posture clarity.

### Responsibilities

- Curate canonical directory index table
- Ensure every path with `AGENTS.md` has metadata + persona + change log
- Track architectural decisions impacting multiple layers
- Guard against scope creep in root-level narrative

### Forbidden

- Duplicating deep implementation detail found in subdirectory docs
- Embedding environment secrets or credentials
- Allowing undocumented directories in production branch

## Change Log

| Version | Date (UTC) | Change                                                             |
| ------- | ---------- | ------------------------------------------------------------------ |
| 1.5.0   | 2025-09-24 | Added auto-generated subdirectory AGENTS.md index section          |
| 1.4.0   | 2025-09-24 | Added persona & change log sections; finalized doc validation pass |
| 1.3.0   | 2025-09-24 | Added /lib/mastra and /lib/actions entries                         |
| 1.2.0   | 2025-09-24 | Added /cedar directory entry                                       |
| 1.1.0   | 2025-09-24 | Canonical index established                                        |
| 1.0.0   | 2025-09-24 | Initial standardized root documentation                            |

## Directory Index (Canonical)

| Path                    | Title / Focus           | Layer    | Domain     | Key Notes                                              |
| ----------------------- | ----------------------- | -------- | ---------- | ------------------------------------------------------ |
| `/`                     | Project Root            | root     | rag        | Global setup, testing, security, workflows overview    |
| `/app`                  | Next.js App Router      | frontend | ui         | Pages, layouts, route structure                        |
| `/app/api`              | API Route Handlers      | backend  | rag        | Chat & indexing endpoints; streaming                   |
| `/app/cedar-os`         | Cedar OS Showcase       | frontend | ui         | Product roadmap / Cedar integration                    |
| `/cedar`                | Cedar Core Components   | frontend | ui         | Low-level Cedar UI primitives (roadmap, chat, buttons) |
| `/components`           | App-Level Components    | frontend | ui         | High-level composed UI (Chat, Auth, Indexing)          |
| `/docs`                 | Documentation System    | docs     | docs       | MD/MDX architecture & publishing                       |
| `/lib`                  | Shared Libraries        | backend  | shared     | Auth, JWT utilities, MDX plugins                       |
| `/lib/mastra`           | Mastra Browser Client   | frontend | rag        | Frontend Mastra client factory                         |
| `/lib/actions`          | Frontend Server Actions | frontend | auth       | Minimal privileged server actions                      |
| `/src`                  | Backend Source Root     | backend  | rag        | Entry point, types, utils, mastra integration          |
| `/src/mastra`           | Mastra Core             | ai       | rag        | Orchestration, registration, tracing                   |
| `/src/mastra/agents`    | Agents                  | ai       | rag        | Single-responsibility reasoning units                  |
| `/src/mastra/workflows` | Workflows               | ai       | rag        | Multi-step orchestration definitions                   |
| `/src/mastra/networks`  | vNext Networks          | ai       | rag        | Non-deterministic LLM-based multi-agent orchestration  |
| `/src/mastra/tools`     | Tools                   | ai       | rag        | Safe callable functions for agents                     |
| `/src/mastra/services`  | Services                | backend  | rag        | Business/domain logic modules                          |
| `/src/mastra/schemas`   | Schemas                 | backend  | validation | Zod contracts & data validation                        |
| `/src/mastra/config`    | Configuration           | backend  | infra      | External service setup (Qdrant, models)                |
| `/src/mastra/policy`    | Policy / ACL            | backend  | policy     | Access control rule sources                            |
| `/src/utils`            | Utilities               | backend  | shared     | Stream & helper abstractions                           |
| `/src/cli`              | CLI Layer               | backend  | ops        | Indexing & workflow invocation CLI                     |
| `/corpus`               | Sample Corpus           | content  | rag        | Source docs for indexing w/ classification             |
| `/hooks`                | React Hooks             | frontend | ui         | Reusable client-side logic                             |

To update: when adding a new `AGENTS.md`, append a row and ensure consistent tags.

---

## Original Overview

## Project Overview

This is a Next.js application implementing a secure, governed Retrieval-Augmented Generation (RAG) system with role-based access control using Mastra. It features a multi-agent architecture with 15+ specialized agents for secure document retrieval and AI-powered responses.

**Key Technologies:** Next.js, TypeScript, Mastra, Qdrant, LibSQL, Tailwind CSS, shadcn/ui, Zod

## Architectural Diagram

```mermaid
C4Context
    title Governed RAG System Architecture

    System_Boundary(system, "Governed RAG System") {

        Container(frontend, "Frontend Application", "Next.js App Router, React, TypeScript", "User Interface & Interaction") {
            Component(app_router, "/app", "Next.js App Router", "Pages, Layouts, Route Structure")
            Component(app_components, "/components", "App-Level Components", "High-level composed UI (Chat, Auth, Indexing)")
            Component(cedar_components, "/cedar", "Cedar Core Components", "Low-level Cedar UI primitives (roadmap, chat, buttons)")
            Component(cedar_os_integration, "/app/cedar-os", "Cedar OS Integration", "Product Roadmap / Cedar Integration")
            Component(lib_shared, "/lib", "Shared Frontend Libraries", "Auth, JWT utilities, MDX plugins")
            Component(lib_mastra_client, "/lib/mastra", "Mastra Browser Client", "Frontend Mastra client factory")
            Component(lib_actions, "/lib/actions", "Frontend Server Actions", "Minimal privileged server actions")
            Component(hooks, "/hooks", "React Hooks", "Reusable client-side logic")
        }

        Container(backend, "Backend Services", "Node.js, TypeScript, Mastra, Qdrant, LibSQL", "API Endpoints & AI Orchestration") {
            Component(src_root, "/src", "Backend Source Root", "Entry point, types, utils, Mastra integration")
            Component(api_route_handlers, "/app/api", "API Route Handlers", "Chat & Indexing Endpoints; Streaming")
            Component(mastra_core, "/src/mastra", "Mastra Core Orchestration", "Orchestration, Registration, Tracing")
            Component(mastra_agents, "/src/mastra/agents", "Mastra Agents", "Single-responsibility Reasoning Units")
            Component(mastra_workflows, "/src/mastra/workflows", "Mastra Workflows", "Multi-step Orchestration Definitions")
            Component(mastra_networks, "/src/mastra/networks", "Mastra vNext Networks", "Non-deterministic LLM-based Multi-agent Orchestration")
            Component(mastra_tools, "/src/mastra/tools", "Mastra Tools", "Safe Callable Functions for Agents")
            Component(mastra_services, "/src/mastra/services", "Mastra Services", "Business/Domain Logic Modules")
            Component(mastra_schemas, "/src/mastra/schemas", "Mastra Schemas", "Zod Contracts & Data Validation")
            Component(mastra_config, "/src/mastra/config", "Mastra Configuration", "External Service Setup (Qdrant, Models)")
            Component(mastra_policy, "/src/mastra/policy", "Mastra Policy / ACL", "Access Control Rule Sources")
            Component(src_utils, "/src/utils", "Backend Utilities", "Stream & Helper Abstractions")
            Component(src_cli, "/src/cli", "CLI Layer", "Indexing & Workflow Invocation CLI")
        }

        Container(data_stores, "Data Stores", "Qdrant, LibSQL", "Vector Database & Persistent Storage") {
            Component(qdrant, "Qdrant", "Vector Database", "Stores document embeddings and metadata")
            Component(libsql, "LibSQL", "SQLite-based Database", "Persistent storage for Mastra memory, etc.")
        }

        Container(content, "Content Corpus", "Markdown files", "Source documents for RAG") {
            Component(corpus, "/corpus", "Sample Corpus", "Source docs for indexing with classification")
        }

        Container(documentation, "Documentation System", "MD/MDX files", "Project documentation") {
            Component(docs, "/docs", "Documentation", "MD/MDX architecture & publishing")
        }
    }

    Rel(app_router, "Mounts", app_components)
    Rel(app_router, "Integrates with", cedar_os_integration)
    Rel(app_router, "Calls", api_route_handlers, "HTTP/S")
    Rel(app_router, "Uses", lib_shared)
    Rel(app_router, "Uses", hooks)

    Rel(app_components, "Composes from", cedar_components)
    Rel(app_components, "Uses", lib_shared)

    Rel(cedar_os_integration, "Consumes", cedar_components)
    Rel(cedar_os_integration, "Exposes state to", mastra_agents, "via Cedar OS hooks")

    Rel(lib_shared, "Uses", lib_mastra_client)
    Rel(lib_shared, "Uses", lib_actions)

    Rel(api_route_handlers, "Invokes", mastra_core, "Mastra Workflows")

    Rel(mastra_core, "Orchestrates", mastra_agents)
    Rel(mastra_core, "Orchestrates", mastra_workflows)
    Rel(mastra_core, "Orchestrates", mastra_networks)
    Rel(mastra_core, "Uses", mastra_tools)
    Rel(mastra_core, "Uses", mastra_services)
    Rel(mastra_core, "Validates with", mastra_schemas)
    Rel(mastra_core, "Configured by", mastra_config)
    Rel(mastra_core, "Enforces policies from", mastra_policy)
    Rel(mastra_core, "Uses", src_utils)

    Rel(mastra_agents, "Call", mastra_tools)
    Rel(mastra_workflows, "Chain", mastra_agents)
    Rel(mastra_workflows, "Chain", mastra_tools)
    Rel(mastra_workflows, "Chain", mastra_services)
    Rel(mastra_networks, "Route to", mastra_agents, "Dynamic LLM routing")
    Rel(mastra_networks, "Route to", mastra_workflows, "Dynamic LLM routing")
    Rel(mastra_networks, "Use memory from", libsql, "Task history")

    Rel(mastra_tools, "Utilize", mastra_services)
    Rel(mastra_tools, "Interact with", qdrant, "Vector Search")
    Rel(mastra_tools, "Interact with", libsql, "Data Storage")

    Rel(mastra_services, "Interact with", qdrant, "Vector Storage")
    Rel(mastra_services, "Interact with", libsql, "Data Storage")

    Rel(src_cli, "Invokes", mastra_core, "Mastra Workflows")

    Rel(qdrant, "Stores", corpus, "Embeddings & Metadata")
    Rel(libsql, "Stores", corpus, "Memory & Metadata")

    Rel(corpus, "Indexed by", mastra_workflows, "governed-rag-index")
    Rel(docs, "Content for", app_router)
```

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
- Shared utilities in `${file://~/mastra-governed-rag/src/utils/}` `src/utils/`
- Type definitions in `${file://~/mastra-governed-rag/src/types/}` `src/types/`
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

## Documentation File Index (Auto-Link)

> This section enumerates every other `AGENTS.md` in the repository for quick navigation. Regenerate after structural changes (or integrate into a future automation step).

| Title                     | Path                                                             | Layer    | Domain(s)  | Status |
| ------------------------- | ---------------------------------------------------------------- | -------- | ---------- | ------ |
| Next.js App Router        | [app/AGENTS.md](app/AGENTS.md)                                   | frontend | ui         | stable |
| Next.js API Routes        | [app/api/AGENTS.md](app/api/AGENTS.md)                           | backend  | rag        | stable |
| Auth API Routes           | [app/api/auth/AGENTS.md](app/api/auth/AGENTS.md)                 | backend  | auth       | beta   |
| Chat API Route            | [app/api/chat/AGENTS.md](app/api/chat/AGENTS.md)                 | backend  | rag        | stable |
| Indexing API Route        | [app/api/index/AGENTS.md](app/api/index/AGENTS.md)               | backend  | rag        | stable |
| Cedar OS Integration      | [app/cedar-os/AGENTS.md](app/cedar-os/AGENTS.md)                 | frontend | ui         | stable |
| Cedar UI Components       | [cedar/AGENTS.md](cedar/AGENTS.md)                               | frontend | ui         | stable |
| Application Components    | [components/AGENTS.md](components/AGENTS.md)                     | frontend | ui         | stable |
| Documentation System      | [docs/AGENTS.md](docs/AGENTS.md)                                 | docs     | docs       | stable |
| Shared Frontend Library   | [lib/AGENTS.md](lib/AGENTS.md)                                   | frontend | shared     | stable |
| Mastra Browser Client     | [lib/mastra/AGENTS.md](lib/mastra/AGENTS.md)                     | frontend | rag        | stable |
| Frontend Actions Layer    | [lib/actions/AGENTS.md](lib/actions/AGENTS.md)                   | frontend | auth       | stable |
| Backend Source Root       | [src/AGENTS.md](src/AGENTS.md)                                   | backend  | rag        | stable |
| Mastra Core Orchestration | [src/mastra/AGENTS.md](src/mastra/AGENTS.md)                     | backend  | rag        | stable |
| Mastra Agents             | [src/mastra/agents/AGENTS.md](src/mastra/agents/AGENTS.md)       | backend  | rag        | stable |
| Mastra Workflows          | [src/mastra/workflows/AGENTS.md](src/mastra/workflows/AGENTS.md) | backend  | rag        | stable |
| Mastra vNext Networks     | [src/mastra/networks/AGENTS.md](src/mastra/networks/AGENTS.md)   | ai       | rag        | stable |
| Mastra Tools              | [src/mastra/tools/AGENTS.md](src/mastra/tools/AGENTS.md)         | backend  | rag        | stable |
| Mastra Services           | [src/mastra/services/AGENTS.md](src/mastra/services/AGENTS.md)   | backend  | rag        | stable |
| Mastra Schemas            | [src/mastra/schemas/AGENTS.md](src/mastra/schemas/AGENTS.md)     | backend  | validation | stable |
| Mastra Config             | [src/mastra/config/AGENTS.md](src/mastra/config/AGENTS.md)       | backend  | infra      | stable |
| Mastra Policy             | [src/mastra/policy/AGENTS.md](src/mastra/policy/AGENTS.md)       | backend  | policy     | stable |
| Backend Utility Layer     | [src/utils/AGENTS.md](src/utils/AGENTS.md)                       | backend  | shared     | stable |
| Operations CLI            | [src/cli/AGENTS.md](src/cli/AGENTS.md)                           | backend  | ops        | stable |
| Corpus Source Documents   | [corpus/AGENTS.md](corpus/AGENTS.md)                             | content  | rag        | stable |
| React Hooks Directory     | [hooks/AGENTS.md](hooks/AGENTS.md)                               | frontend | ui         | stable |

_Total:_ 26 subordinate documentation files indexed.

@/\*\*/AGENTS.md

---

Any `${input:folder}` that contains an `AGENTS.md` file can be referenced using the following glob pattern:

```bash
cat $(find . -name 'AGENTS.md' -print)
```
