<!-- AGENTS-META {"title":"Project Root","version":"1.7.0","last_updated":"2025-10-21T00:00:00Z","applies_to":"/","tags":["layer:root","domain:rag","domain:research","domain:financial","domain:content","domain:interactive","type:overview","status":"stable"],"status":"stable"} -->

# AGENTS.md

> Standardized agent documentation format v1.1.0 (root). This file now serves as the canonical index for all subdirectory `AGENTS.md` files. Update the metadata block above (never remove it) when making structural changes.

## Persona

**Name:** `{root_persona_name}` = "Multi-Domain AI Orchestration Platform Architect"  
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
| 1.7.0   | 2025-10-21 | Updated to reflect multi-domain AI orchestration platform (not just governed RAG) |
| 1.6.0   | 2025-10-08 | Added auto-generated subdirectory AGENTS.md index section          |
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
| `/src/mastra/config`    | Configuration           | backend  | infra      | External service setup (PostgreSQL with PgVector, models)                |
| `/src/mastra/policy`    | Policy / ACL            | backend  | policy     | Access control rule sources                            |
| `/src/utils`            | Utilities               | backend  | shared     | Stream & helper abstractions                           |
| `/src/cli`              | CLI Layer               | backend  | ops        | Indexing & workflow invocation CLI                     |
| `/corpus`               | Sample Corpus           | content  | rag        | Source docs for indexing w/ classification             |
| `/hooks`                | React Hooks             | frontend | ui         | Reusable client-side logic                             |

To update: when adding a new `AGENTS.md`, append a row and ensure consistent tags.

---

## Original Overview

## Project Overview

This is a Next.js application implementing a **Multi-Domain AI Orchestration Platform** with Mastra. It features a comprehensive multi-agent architecture with 27 specialized agents across 5 capability domains: Governed RAG (secure knowledge access), Deep Research (academic & financial intelligence), Financial Intelligence (real-time market analysis), Content Generation (multi-agent synthesis), and Interactive State Management (Cedar OS integration).

**Key Technologies:** Next.js 15+, React 19+, TypeScript ES2022, Mastra 0.16.0+, PostgreSQL + PgVector, MUI Joy UI, Tailwind v4, Zod

## Architectural Diagram

```mermaid
flowchart TD
    %% Frontend Layer
    subgraph "🎨 Frontend Layer"
        A[Next.js App Router<br/>React 19 + TypeScript]
        B[Cedar OS Integration<br/>Product Roadmap UI]
        C[React Components<br/>Chat, Auth, Indexing]
        D[Shared Libraries<br/>JWT, MDX, Hooks]
    end
    
    %% Backend Layer  
    subgraph "⚙️ Backend Layer"
        E[Mastra Core<br/>Orchestration Engine]
        F[AI Agents<br/>27+ Specialized Agents<br/>5 Domains]
        G[Workflows<br/>10+ Multi-step Orchestration<br/>Complex Tasks]
        H[Tools & Services<br/>50+ Tools<br/>Business Logic]
        I[API Routes<br/>Chat & Indexing<br/>Streaming]
    end
    
    %% Data Layer
    subgraph "💾 Data Layer"
        J[(PostgreSQL + PgVector<br/>Vector Embeddings<br/>Document Storage)]
        K[(Content Corpus<br/>Markdown Files<br/>RAG Source)]
    end
    
    %% External Services
    subgraph "🔗 External Services"
        L[Google Gemini<br/>AI Models]
        M[OpenAI<br/>LLM Services]
        N[Data Sources<br/>Alpha Vantage, Finnhub<br/>SerpAPI, Polygon]
        O[Academic Sources<br/>ArXiv, Research APIs]
    end
    
    %% Agent Categories (detailed breakdown)
    subgraph "🤖 Agent Categories"
        P1[Governed RAG Agents<br/>identity, retrieve, rerank<br/>answerer, verifier]
        P2[Domain Agents<br/>research, copywriter<br/>cryptoAnalysis, compliance]
        P3[Specialized Agents<br/>productRoadmap, salesIntelligence<br/>stockAnalysis, voiceAgent]
        P4[Orchestration Agents<br/>a2aCoordinator, assistant<br/>editor, evaluation]
    end
    
    %% Workflow Categories
    subgraph "🔄 Workflow Categories"
        Q1[Chat Workflows<br/>Multiple Versions<br/>Real-time Conversation]
        Q2[Analysis Workflows<br/>Financial Analysis V3<br/>Research Workflow]
        Q3[Content Workflows<br/>Content Generation<br/>Report Generation]
        Q4[RAG Workflows<br/>Governed RAG Answer<br/>Governed RAG Index]
    end
    
    %% Tool Categories
    subgraph "🛠️ Tool Categories"
        R1[Data Tools<br/>Alpha Vantage, Finnhub<br/>Polygon, SerpAPI]
        R2[Processing Tools<br/>Document Chunking<br/>PDF Conversion, Web Scraper]
        R3[Analysis Tools<br/>Competitive Intelligence<br/>Compliance Check, Sales Analysis]
        R4[Specialized Tools<br/>JWT Auth, Vector Query<br/>Graph RAG, Roadmap Tool]
    end
    
    %% Connections
    A --> I
    B --> I
    C --> I
    D --> I
    
    I --> E
    E --> F
    F --> G
    G --> H
    
    H --> J
    H --> K
    J --> H
    K --> H
    
    F --> L
    F --> M
    G --> L
    G --> M
    H --> N
    H --> O
    
    F --> P1
    F --> P2
    F --> P3
    F --> P4
    
    G --> Q1
    G --> Q2
    G --> Q3
    G --> Q4
    
    H --> R1
    H --> R2
    H --> R3
    H --> R4
```

## Setup Commands

### Environment Setup

- Install dependencies: `npm install`
- Copy environment template: `cp .env.example .env`
- Start infrastructure: `docker-compose up -d` (PostgreSQL + PgVector database)
- Index documents: `npm run cli index`
- Start development: `npm run dev`

### Required Environment Variables

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/mastra_db
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
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
- PostgreSQL + PgVector database connection required
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
- API keys for external services (Google Gemini, PostgreSQL, PgVector, etc.)

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

#### PostgreSQL + PgVector Connection Failed

```bash
# Check PostgreSQL health
psql postgresql://user:password@localhost:5432/mastra_db -c "SELECT version();"

# Check PgVector extension
psql postgresql://user:password@localhost:5432/mastra_db -c "SELECT * FROM pg_extension WHERE extname = 'vector';"

# View logs
docker-compose logs postgres

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

- Vector search optimization in PgVector
- Batch embedding processing
- Redis caching for frequent queries
- Connection pooling for database operations

## Agent Development Guidelines

### Agent Structure

The system uses **TWO distinct agent patterns** based on complexity and purpose:

**Pattern A: Governed RAG Agents (5 agents - Single Responsibility Pipeline)**

- **Purpose**: Secure pipeline steps with single responsibility
- **Tool Count**: 0-1 tools (ONE tool call OR pure LLM reasoning)
- **Instructions**: Strict numbered steps with MANDATORY/FORBIDDEN sections
- **Examples**: identity, retrieve, rerank, answerer, verifier
- **Use When**: Building secure RAG pipeline with role-based access

**Pattern B: Domain Agents (22+ agents - Multi-Capability Orchestration)**

- **Purpose**: Complex domain tasks requiring multiple capabilities
- **Tool Count**: 3-25+ tools (multiple tool calls per execution)
- **Instructions**: Flexible guidance with domain expertise
- **Processors**: Input (UnicodeNormalizer), Output (BatchPartsProcessor)
- **Scorers**: 5-6+ quality metrics (creativity, taskCompletion, etc.)
- **Memory**: pgMemory enabled for context retention
- **Examples**: research, assistant, copywriter, productRoadmap, cryptoAnalysis
- **Use When**: Building research, analysis, or content generation

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

This AGENTS.md file provides the technical context needed for coding agents to effectively contribute to the multi-domain AI orchestration platform. Refer to README.md for general project information and user-facing documentation.

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
