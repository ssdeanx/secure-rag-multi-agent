# Technical Context

**Updated:** 2025-01-XX

## Technologies Used

### Frontend Stack

**Framework**: Next.js 15.5.4

- App Router for file-based routing
- Server Components for performance
- Streaming SSR for progressive rendering
- Turbopack for fast hot reload during development
- Production builds with optimized output

**UI Library**: React 19.1.1

- Latest concurrent features
- Streaming and Suspense support
- Server Actions for mutations
- Server Components by default

**Styling**: Tailwind CSS 4.1.13 (v4 release)

- Utility-first CSS framework
- Custom Supabase-inspired theme (zinc/yellow/teal/red/green)
- Neon glow effects (blue/yellow/teal/red/green - NO pink/purple)
- Glass effects (glass-effect, glass-light, glass-dark, glass-subtle)
- Gradient animations (gradient-shift, animated-gradient)
- 47 shadcn/ui components
- Dark/light theme support with next-themes
- Typography plugin for prose content
- Forms plugin for input styling

**Plugins**:

- `@tailwindcss/forms` - Enhanced form input styling
- `@tailwindcss/typography` - Beautiful prose styling for MDX
- `tw-animate-css` - Animation utilities
- `tailwindcss-motion` - Motion utilities

**Type Safety**: TypeScript 5.9.2

- Strict mode enabled (`strict: true`)
- Runtime validation with Zod schemas
- Full type coverage across codebase
- No `any` types allowed

### Backend Stack

**AI Orchestration**: Mastra 0.18.0

- Multi-agent coordination (16 agents)
- Workflow orchestration (9 workflows)
- State management with suspend/resume
- Memory persistence (LibSQL/PostgreSQL backends)
- Multiple AI provider support (OpenAI, Google, Anthropic, Vertex AI)
- Built-in observability with custom Langfuse exporter

**Additional Mastra Packages**:

- `@mastra/rag` 1.2.6 - Vector and graph RAG
- `@mastra/libsql` 0.14.3 - Development database backend
- `@mastra/pg` 0.16.1 - Production PostgreSQL backend
- `@mastra/evals` 0.13.8 - Evaluation metrics and testing integration
- `@mastra/langfuse` 0.10.5 - Langfuse observability (custom exporter)
- `@mastra/mcp` 0.11.2 - Model Context Protocol support

**Runtime**: Node.js >= 20.9.0

- ES modules (`"type": "module"`)
- Native fetch API
- TypeScript compilation with tsx

**AI Providers**:

- **Google Gemini**: 2.5 Pro, 2.5 Flash, 2.5 Flash-Lite, embedding-001
- **OpenAI**: gpt-4o-mini, text-embedding-3-small
- **OpenRouter**: Multi-model provider aggregation
- **Anthropic**: Claude models via `@ai-sdk/anthropic`
- **Google Vertex AI**: v3.0.33 integration

**AI SDK**: Vercel AI SDK 5.x

- Unified interface across providers
- Streaming support
- Tool calling capabilities
- Type-safe API

### Data Storage

**Vector Database**: Qdrant 0.11.13

- Docker deployment on port 6333
- Metadata filtering with security tags
- HNSW indexing for fast similarity search
- gRPC and HTTP APIs
- 1568-dimension embeddings (Google gemini-embedding-001)

**Metadata Storage**:

- **Development**: LibSQL (SQLite-compatible)
    - `deep-research.db` - Main storage
    - `vector-store.db` - Vector metadata
    - File-based, no server required
- **Production**: PostgreSQL with pgvector
    - Full SQL database
    - pgvector extension for embeddings
    - Migration scripts for data transition

**Caching**: Redis

- Docker deployment on port 6379
- Session storage
- Query result caching
- Workflow state caching

### Development Tools

**Package Manager**: npm (Node >= 20.9.0)

- No workspaces (single package)
- package-lock.json for reproducibility
- Scripts for dev, build, test, CLI

**Linting**: ESLint 9.x

- TypeScript rules (@typescript-eslint/parser)
- React rules (eslint-plugin-react)
- Next.js rules (@next/eslint-plugin-next)
- Custom configuration in eslint.config.js

**Formatting**: Prettier 3.x

- Consistent code style
- 4 spaces indentation
- Single quotes
- ES5 trailing commas
- Config in prettier.config.js

**Testing**: Vitest 3.2.4

- Fast unit tests with hot reload
- jsdom environment for React components
- Coverage reporting with V8 provider
- 10-second timeout for tests
- Integration with @mastra/evals
- Mocking with vi.mock()

**Build**: Next.js Build System

- Turbopack bundler (dev mode)
- Webpack bundler (production)
- TypeScript compilation
- Asset optimization
- Static page generation
- Server-side rendering

## Development Setup

### Required Software

1. **Node.js**: >= 20.9.0 (check with `node --version`)
2. **Docker**: For infrastructure services (Qdrant, Redis)
3. **Docker Compose**: For service orchestration
4. **Git**: Version control

### Environment Variables

Create `.env` file in project root:

```bash
# AI APIs (at least one required)
OPENAI_API_KEY=your_openai_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Vector Database (Qdrant)
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=governed_rag

# Authentication
JWT_SECRET=your_secure_jwt_secret_min_32_chars
TENANT=acme

# Storage (Development - LibSQL)
DATABASE_URL=file:deep-research.db
VECTOR_STORE_URL=file:./vector-store.db

# Storage (Production - PostgreSQL)
# DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# Optional: Observability (Langfuse)
LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
LANGFUSE_SECRET_KEY=your_langfuse_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com

# Optional: Supabase Auth (Production)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Setup Commands (Run in Order)

```bash
# 1. Clone and install dependencies
git clone https://github.com/ssdeanx/governed-rag-ai.git
cd mastra-governed-rag
npm install

# 2. Copy environment template
cp .env.example .env
# Edit .env with your API keys (OpenAI or Google Gemini)

# 3. Start infrastructure services (Qdrant + Redis)
docker-compose up -d

# 4. Verify services are running
curl http://localhost:6333/health  # Qdrant health check
# Should return: {"status":"ok"}

# 5. Index sample documents from corpus/
npm run cli index

# 6. Start development servers (Next.js port 3000 + Mastra port 4111)
npm run dev
```

### Development Scripts

**Core Development**:

```bash
npm run dev              # Next.js (3000) + Mastra (4111) concurrently
npm run dev:next         # Next.js only (http://localhost:3000)
npm run dev:mastra       # Mastra backend only (http://localhost:4111)
```

**Build and Production**:

```bash
npm run build            # Production Next.js build (.next/)
npm run build-cli        # CLI build (dist/index.js)
npm start                # Production server (after build)
```

**Testing**:

```bash
npm test                 # All tests with Vitest
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:coverage    # Generate coverage report (tests/test-results/)
```

**Code Quality**:

```bash
npm run lint             # ESLint check (errors/warnings)
npm run pretty           # Prettier format (writes changes)
```

**CLI Operations**:

```bash
npm run cli index        # Index documents from corpus/
npm run cli query "$(npm run jwt:finance)" "What is expense policy?"
npm run cli demo         # Interactive demo mode
```

**JWT Token Generation (Testing)**:

```bash
npm run jwt:finance      # Finance viewer JWT
npm run jwt:hr           # HR admin JWT
npm run jwt:admin        # Admin JWT
npm run jwt:engineering  # Engineering viewer JWT
```

### Development Workflow

**Typical Development Session**:

1. Start infrastructure: `docker-compose up -d`
2. Start dev servers: `npm run dev`
3. Open browser: http://localhost:3000
4. Make changes (hot reload active)
5. Run tests: `npm test`
6. Lint code: `npm run lint`
7. Format code: `npm run pretty`
8. Commit changes

**Dual-Server Setup**:

The `npm run dev` script uses `concurrently` to run both:

- **Next.js** (Terminal 1 - blue output): Frontend on port 3000
- **Mastra** (Terminal 2 - green output): Backend on port 4111

This allows frontend and backend to run independently with separate hot reload.

## Technical Constraints

### Performance Constraints

- **Query Response Time**: <2 seconds target (identity → policy → retrieve → rerank → answer → verify)
- **Embedding Generation**: ~100ms per 500-token document chunk
- **Vector Search**: <500ms for 10K documents with metadata filtering
- **Concurrent Users**: 100+ supported (limited by Mastra backend concurrency)
- **Streaming Latency**: <100ms first token, then continuous stream

### Security Constraints

- **JWT Expiration**: 2 hours default (configurable in lib/actions/auth.ts)
- **No Client-Side Role Manipulation**: Server-side validation at every step
- **Server-Side Validation Required**: All API routes validate JWT before processing
- **HTTPS in Production**: Required for JWT transmission security
- **Secrets Management**: Via environment variables (`.env` file, never committed)
- **Zero-Trust Model**: Access validation at every pipeline stage
- **Audit Logging**: PinoLogger with file transport (logs/workflow.log, logs/mastra.log)

### Scalability Constraints

- **Single-Tenant Architecture**: Each deployment serves one organization
- **Document Limit**: 100K+ documents (Qdrant sharding available if needed)
- **Concurrent Workflow Limit**: 50 simultaneous workflows (Mastra backend limitation)
- **Memory**: 2GB minimum for Mastra backend, 4GB recommended
- **Storage**: LibSQL file-based (dev), PostgreSQL with connection pooling (prod)

### Browser Support

- **Modern Evergreen Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript Required**: Full React application, no SSR fallback
- **LocalStorage**: Used for theme persistence and session tokens
- **Server-Sent Events (SSE)**: Required for streaming responses (/chat/stream)

### Database Constraints

**LibSQL (Development)**:

- File-based, single-process access
- No concurrent writes from multiple processes
- 1GB file size recommended max

**PostgreSQL (Production)**:

- Requires pgvector extension
- Connection pooling recommended
- 1568-dimension embeddings (storage consideration)

### Infrastructure Requirements

**Docker Services**:

- Qdrant: 512MB RAM minimum, 1GB recommended
- Redis: 256MB RAM minimum
- Ports: 6333 (Qdrant), 6379 (Redis), 3000 (Next.js), 4111 (Mastra)

## Dependencies

### Production Dependencies

```json
{
    "@mastra/core": "^0.17.0",
    "@qdrant/js-client-rest": "^1.12.0",
    "@ai-sdk/google": "^1.1.9",
    "@ai-sdk/openai": "^1.0.15",
    "ai": "^4.1.4",
    "next": "15.5.3",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "zod": "^3.24.2",
    "jsonwebtoken": "^9.0.2"
}
```

### Development Dependencies

```json
{
    "typescript": "5.9.2",
    "eslint": "^9.18.0",
    "prettier": "^3.4.2",
    "vitest": "^2.1.8",
    "@types/node": "^22.10.5",
    "@types/react": "^19.0.11"
}
```

## Versioning Strategy

### Semantic Versioning

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes

### Version Control

- **Git**: Source control
- **Branches**:
    - `main`: Production-ready code
    - `develop`: Integration branch
    - `feature/*`: Feature branches
    - `fix/*`: Bug fix branches

### Release Process

1. Feature development on `feature/*` branch
2. PR to `develop` branch
3. Testing and validation
4. PR to `main` branch
5. Tag release with version
6. Deploy to production

## Build Configuration

### TypeScript Configuration

```json
{
    "compilerOptions": {
        "strict": true,
        "target": "ES2022",
        "lib": ["ES2022"],
        "module": "ESNext",
        "moduleResolution": "bundler",
        "jsx": "preserve",
        "incremental": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    }
}
```

### Next.js Configuration

```javascript
{
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
}
```

### Vitest Configuration

```javascript
{
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      exclude: ['node_modules', 'tests', '**/*.test.ts'],
    },
    testTimeout: 10000,
  },
}
```

## Infrastructure Services

### Qdrant Configuration

```yaml
services:
    qdrant:
        image: qdrant/qdrant:latest
        ports:
            - '6333:6333'
            - '6334:6334'
        volumes:
            - ./qdrant_storage:/qdrant/storage
        environment:
            - QDRANT__SERVICE__HTTP_PORT=6333
```

### Redis Configuration

```yaml
services:
    redis:
        image: redis:alpine
        ports:
            - '6379:6379'
        volumes:
            - ./redis_data:/data
```

## API Integrations

### OpenAI API

- **Endpoint**: `https://api.openai.com/v1`
- **Models**: `gpt-4`, `text-embedding-ada-002`
- **Rate Limits**: 10K requests/minute
- **Authentication**: Bearer token

### Google Gemini API

- **Endpoint**: `https://generativelanguage.googleapis.com`
- **Models**: `gemini-2.5-flash`, `gemini-2.5-pro`
- **Rate Limits**: 60 requests/minute
- **Authentication**: API key

### Qdrant API

- **Endpoint**: `http://localhost:6333`
- **Protocol**: HTTP REST or gRPC
- **Authentication**: Optional API key
- **Collection**: `governed_rag`

## Monitoring and Logging

### Application Logging

- **Location**: `logs/mastra.log`, `logs/workflow.log`
- **Format**: Structured JSON
- **Levels**: DEBUG, INFO, WARN, ERROR
- **Rotation**: Daily, 7-day retention

### Performance Monitoring

- **Langfuse**: Workflow tracing (optional)
- **Console**: Development logging
- **Custom**: Agent execution metrics

## Security Practices

### Code Security

- No hardcoded secrets
- Environment variable validation
- Input sanitization with Zod
- TypeScript strict mode
- Dependency vulnerability scanning

### API Security

- JWT validation on every request
- CORS configuration
- Rate limiting (planned)
- HTTPS enforcement in production

### Data Security

- Encrypted data at rest (planned)
- Secure token storage
- Role-based access control
- Audit logging for compliance

## Deployment Requirements

### Production Environment

- **Compute**: 2 CPU cores, 4GB RAM minimum
- **Storage**: 20GB SSD for vectors
- **Network**: HTTPS with valid certificate
- **Services**: Qdrant, Redis, LibSQL

### Container Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables (Production)

- All development variables
- `NODE_ENV=production`
- Production database URLs
- Secure JWT secret (32+ characters)
- API keys for external services
