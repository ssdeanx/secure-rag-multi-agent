# Technology Stack & Build System

## Core Technologies

- **Node.js**: 20+ (required)
- **TypeScript**: 5.8+ with strict mode enabled
- **Next.js**: 15.4+ (React framework with App Router)
- **Mastra**: Latest (multi-agent orchestration framework)

## Key Dependencies

- **AI/ML**: @ai-sdk/openai, @mastra/core, @mastra/qdrant, @mastra/memory
- **Authentication**: jose (JWT handling with HS256)
- **Database**: @mastra/libsql (SQLite), @mastra/qdrant (vector storage)
- **UI**: React 19+, Tailwind CSS, Lucide React icons
- **Validation**: Zod schemas for runtime type checking
- **Logging**: @mastra/loggers (Pino-based structured logging)

## Infrastructure

- **Vector Database**: Qdrant (containerized via Docker Compose)
- **Cache**: Redis (optional, for performance)
- **Storage**: LibSQL for metadata, Qdrant for embeddings
- **Embeddings**: OpenAI text-embedding-3-small (configurable)

## Common Commands

### Development

```bash
npm run dev              # Start Next.js development server (port 3000)
npm run mastra-dev       # Start Mastra development mode
docker-compose up -d     # Start Qdrant (6333) and Redis (6379) services
```

### Building

```bash
npm run build           # Build Next.js application
npm run build-cli       # Build CLI tools (TypeScript compilation to dist/)
npm start              # Start production server
```

### CLI Operations

```bash
npm run cli index                    # Index sample documents
npm run cli query "<jwt>" "<question>"  # Query with JWT auth
npm run cli demo                     # Interactive demo mode
npm run cli help                     # Show CLI help
```

### Testing & Health Checks

```bash
curl http://localhost:6333/health    # Check Qdrant health
curl http://localhost:6379/ping      # Check Redis health
docker ps                           # Verify containers running
docker logs governed-rag-qdrant     # Check Qdrant logs
```

## Configuration Files

- **tsconfig.json**: Main TypeScript config with strict mode, bundler resolution
- **tsconfig.cli.json**: Separate config for CLI compilation
- **next.config.js**: Next.js configuration with timeout settings
- **tailwind.config.js**: Tailwind CSS setup with custom glass effects
- **docker-compose.yml**: Qdrant and Redis services with health checks
- **.env.example**: Environment variable template

## Environment Variables

### Required

- `OPENAI_API_KEY`: OpenAI API key for LLM and embeddings
- `JWT_SECRET`: Secret for JWT signing/verification (HS256)

### Optional with Defaults

- `OPENAI_MODEL`: LLM model (default: gpt-4o-mini)
- `OPENAI_BASE_URL`: API endpoint (default: https://api.openai.com/v1)
- `EMBEDDING_MODEL`: Embedding model (default: text-embedding-3-small)
- `QDRANT_URL`: Vector DB URL (default: http://localhost:6333)
- `QDRANT_COLLECTION`: Collection name (default: governed_rag)
- `TENANT`: Default tenant ID (default: acme)
- `LOG_LEVEL`: Logging level (default: info)

### Optional Advanced

- `OPENAI_EMBEDDING_API_KEY`: Separate key for embeddings
- `OPENAI_EMBEDDING_BASE_URL`: Separate endpoint for embeddings
- `QDRANT_API_KEY`: Qdrant authentication key
- `MASTRA_TELEMETRY_DISABLED`: Disable Mastra telemetry

## Code Style & Patterns

### TypeScript Conventions

- Strict mode enabled with explicit types
- Avoid `any` - use proper typing
- Prefer interfaces over types for object shapes
- Use Zod schemas for runtime validation
- Async/await patterns throughout (no callbacks)

### Service Layer Pattern

- Services use static methods with clear responsibilities
- Validation in dedicated ValidationService
- Authentication/Authorization in AuthenticationService
- Role hierarchy in RoleService with inheritance
- Separate services for chunking, embedding, storage

### Agent Architecture

- Agents have specific single responsibilities
- Input/output schemas defined with Zod
- Structured instructions with security focus
- Tool integration for external operations

### Logging Standards

- Structured logging with Pino
- Request IDs for tracing (REQ-timestamp-random)
- Consistent log levels: info, warn, error, debug
- Security events logged with context
- Performance metrics tracked

### Security Patterns

- JWT verification with jose library
- Role-based access control with hierarchy
- Security tags on all documents: role:_, tenant:_, classification:\*
- Multi-layer validation: JWT → Policy → Retrieval → Answer → Verification
- No external knowledge in answers - only authorized contexts

### Error Handling

- Try-catch blocks with proper error types
- Graceful degradation where possible
- Detailed error logging with context
- User-friendly error messages
- Validation errors with specific field information

### File Naming Conventions

- **Agents**: `*.agent.ts`
- **Workflows**: `*.workflow.ts`
- **Services**: PascalCase with `Service` suffix
- **Tools**: `*.tool.ts`
- **Components**: PascalCase React components
- **API Routes**: `route.ts` (Next.js App Router)
- **Schemas**: `*-schemas.ts`
- **Config**: lowercase with hyphens

### Performance Considerations

- Streaming responses for chat interface
- Batch processing for document indexing
- Connection pooling for database operations
- Caching strategies for frequent queries
- Timeout configurations for LLM calls (600s for reasoning models)
