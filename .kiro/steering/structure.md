# Project Structure & Organization

## Root Level
- **app/**: Next.js App Router structure (pages, API routes, layouts)
- **components/**: Reusable React components with TypeScript
- **src/**: Core application logic and Mastra configuration
- **corpus/**: Sample documents with security classifications (markdown files)
- **lib/**: Shared utilities (JWT helpers, demo token generation)
- **logs/**: Generated log files (workflow.log)
- **dist/**: Compiled TypeScript output for CLI
- **.kiro/**: Kiro IDE configuration and steering rules

## Core Architecture (`src/mastra/`)

### Agents (`agents/`) - Multi-Agent Pipeline
- `answerer.agent.ts`: Generates answers from authorized contexts only, strict no-external-knowledge policy
- `identity.agent.ts`: JWT validation and user identity extraction
- `policy.agent.ts`: Converts user claims to access filters based on role hierarchy
- `rerank.agent.ts`: Orders retrieved contexts by relevance using LLM
- `retrieve.agent.ts`: Queries vector database with security filters applied
- `verifier.agent.ts`: Validates answers for security compliance and data leakage

### Workflows (`workflows/`) - Orchestrated Pipelines
- `governed-rag-answer.workflow.ts`: Main query pipeline with 4 steps:
  1. Authentication (JWT verification + policy generation)
  2. Retrieval + Rerank (secure document retrieval with relevance scoring)
  3. Answer Generation (LLM response from authorized contexts)
  4. Verification (security compliance check)
- `governed-rag-index.workflow.ts`: Document indexing with security metadata and chunking

### Services (`services/`) - Business Logic Layer
- `AuthenticationService.ts`: JWT verification (jose), policy generation, role expansion
- `DocumentIndexingService.ts`: Document processing, chunking, embedding coordination (legacy wrapper)
- `DocumentProcessorService.ts`: Enhanced document processing with batch operations
- `ChunkingService.ts`: Text chunking with multiple strategies (character, sentence, semantic)
- `EmbeddingService.ts`: OpenAI embedding generation with caching and batch processing
- `VectorStorageService.ts`: Qdrant vector storage with batch operations and error handling
- `VectorQueryService.ts`: Secure vector database queries with hierarchical role filtering
- `RoleService.ts`: Role hierarchy management, access control, inheritance logic
- `ValidationService.ts`: Input validation, security checks, environment validation
- `WorkflowDecorators.ts`: Workflow enhancement utilities

### Tools (`tools/`) - Agent Integration
- `jwt-auth.tool.ts`: JWT authentication tool for agents with error handling
- `vector-query.tool.ts`: Vector database query tool with security filters and logging

### Configuration (`config/`)
- `openai.ts`: OpenAI provider setup with timeout handling (600s), separate embedding config
- `logger.ts`: Structured logging with Pino, file logging, workflow tracking
- `role-hierarchy.ts`: Role-based access control definitions with inheritance rules

### Policy (`policy/`)
- `acl.yaml`: Access control list configuration for document permissions

### Schemas (`schemas/`)
- `agent-schemas.ts`: Zod schemas for all agent inputs/outputs, JWT claims, access filters

## Next.js Structure (`app/`)
- `api/chat/route.ts`: Chat API endpoint with streaming responses, 60s timeout
- `api/index/route.ts`: Document indexing API endpoint
- `page.tsx`: Main application UI with role-based authentication
- `layout.tsx`: Root layout with Tailwind CSS and metadata
- `globals.css`: Global styles with Tailwind imports and custom glass effects

## Components (`components/`) - React UI Components
- `AuthPanel.tsx`: Role selection and JWT generation with demo tokens
- `ChatInterface.tsx`: Main chat UI with streaming responses and citation display
- `IndexingPanel.tsx`: Document indexing interface with progress tracking
- `SecurityIndicator.tsx`: Visual security level indicators (public/internal/confidential)

## CLI Structure (`src/cli/`)
- `index.ts`: Command-line interface with document indexing and querying capabilities

## Utilities (`lib/`)
- `jwt-utils.ts`: JWT token generation for demo purposes with role-based claims

## Sample Data (`corpus/`)
- `finance-policy.md`: Internal finance department policies (role: finance.viewer)
- `engineering-handbook.md`: Public engineering documentation (role: engineering.viewer)
- `hr-confidential.md`: Confidential HR documents (role: hr.admin, stepUp required)

## File Naming Conventions
- **Agents**: `*.agent.ts` (lowercase with descriptive name)
- **Workflows**: `*.workflow.ts` (kebab-case with descriptive name)
- **Services**: PascalCase with `Service` suffix (e.g., `AuthenticationService.ts`)
- **Tools**: `*.tool.ts` (kebab-case with descriptive name)
- **Components**: PascalCase React components (e.g., `ChatInterface.tsx`)
- **API Routes**: `route.ts` (Next.js App Router convention)
- **Schemas**: `*-schemas.ts` (kebab-case with schemas suffix)
- **Config**: lowercase with hyphens (e.g., `role-hierarchy.ts`)

## Security Architecture

### Document Security Model
- **Security Tags**: `role:*`, `tenant:*`, `classification:*`
- **Classifications**: public (all users) → internal (role-based) → confidential (admin + stepUp)
- **Role Hierarchy**: Inheritance system where higher roles inherit lower role permissions
- **Tenant Isolation**: Multi-tenant support with tenant-specific access

### Access Control Flow
1. **JWT Verification**: Token validation with jose library (HS256)
2. **Role Expansion**: Hierarchical role inheritance (e.g., admin inherits all roles)
3. **Policy Generation**: Convert roles to security filters
4. **Database Filtering**: Qdrant filters applied at query time (not post-retrieval)
5. **Answer Verification**: Multi-agent validation to prevent data leakage

### Role Hierarchy Example
```typescript
'admin': ['hr.admin', 'finance.admin', 'engineering.admin', 'employee', 'public']
'finance.admin': ['finance.viewer', 'employee', 'public']
'finance.viewer': ['employee', 'public']
'employee': ['public']
'public': []
```

### Security Validation Layers
1. **Input Validation**: Zod schemas for all inputs
2. **JWT Validation**: Token signature, expiry, claims structure
3. **Role Validation**: Known roles, hierarchy consistency
4. **Query Filtering**: Database-level security filters
5. **Response Validation**: Answer compliance with authorized contexts
6. **Audit Logging**: All security events logged with context

## Data Flow Architecture

### Query Processing Pipeline
```
User Query + JWT → Authentication → Policy Generation → Vector Query → Reranking → Answer Generation → Verification → Secure Response
```

### Document Indexing Pipeline
```
Document Files → Processing → Chunking → Embedding → Security Tagging → Vector Storage
```

### Logging and Observability
- **Request Tracing**: Unique request IDs (REQ-timestamp-random)
- **Performance Metrics**: Step timing, token usage, document counts
- **Security Events**: Authentication, authorization, access violations
- **Error Tracking**: Structured error logging with context and stack traces