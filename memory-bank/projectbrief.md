# Project Brief

**Project Name:** Mastra Governed RAG  
**Created:** 2025-09-30  
**Updated:** 2025-09-30  
**Status:** Active Development

## Project Vision

This project is a **multi-agent AI platform** that combines:

1. **Secure RAG System**: Enterprise-grade Retrieval-Augmented Generation with hierarchical role-based access control (RBAC)
2. **Research Capabilities**: Multi-phase research workflows with suspend/resume for human-in-loop processes
3. **Content Creation**: Specialized agents for copywriting, editing, and report generation
4. **Product Management**: Product roadmap agent with future Cedar OS 3D visualization (planned)

The security pipeline validates user identity, generates access filters, retrieves authorized documents, reranks results based on relevance and access constraints, generates secure responses, and verifies compliance.

The system ensures:

1. Users only access information they're authorized to view
2. Document classification (public, internal, confidential) is enforced
3. 10-role hierarchy with inheritance (admin → dept admins → dept viewers → employee → reader → public)
4. All security decisions are auditable
5. Step-up authentication protects highly sensitive content

## Success Metrics

1. **Security**: Zero unauthorized document access incidents
2. **Performance**: Query response time < 2 seconds for RAG, < 30 seconds for research workflows
3. **Accuracy**: RAG responses cite correct sources with 95%+ relevance scores
4. **Usability**: Developers can integrate in < 1 hour
5. **Compliance**: 100% audit trail coverage
6. **Research**: Multi-phase research workflows complete with human review checkpoints
7. **Content**: Generated content meets quality standards (evaluated by evaluation agent)

## Technical Architecture

1. **16 Specialized Agents**: Identity validation, policy generation, vector retrieval, reranking, answer generation, compliance verification, copywriter, editor, evaluation, research, learning extraction, report generation, product roadmap, self-referencing, assistant, starter
2. **9 Orchestrated Workflows**: Secure RAG answer, document indexing, multi-phase research, report generation, chat (with productRoadmap example and starter template)
3. **11 Reusable Tools**: JWT auth, vector query, web scraper, file manager, agent-as-tool compositions (copywriter, editor, starter), evaluation, learning extraction, roadmap, weather API
4. **10 Business Services**: Authentication, Role management, Vector querying, Document processing, Chunking, Embedding, Vector storage, Validation, Workflow decorators, Document indexing
5. **API-Backend Bridge**: lib/ layer with mastra-client.ts for proper client-server separation
6. **CLI Infrastructure**: src/cli/index.ts for corpus loading and document indexing (example tenant: "acme")
7. **Type Definitions**: src/types.ts (Principal, AccessFilter, Document, Chunk interfaces for security and data models)
8. **API Routes**: apiRegistry.ts with /chat (standard) and /chat/stream (SSE) endpoints
9. **Observability**: ai-tracing.ts with custom Langfuse exporter for traces, spans, generations

### Security & Access Control

6. **6-Agent Security Pipeline**: identity → policy → retrieve → rerank → answer → verifier
7. **10-Role Hierarchy**: admin(100) > dept admins(80) > dept viewers(60) > employee(40) > reader(35) > public(10)
8. **Document Classification**: Public, internal, confidential with ACL.yaml policy enforcement
9. **JWT Authentication**: Token-based auth with role claims and step-up authentication
10. **Audit Logging**: Comprehensive security event tracking with citations

### AI Capabilities

11. **Secure RAG**: Vector search with role-based filters using Qdrant/LibSQL
12. **Research Workflows**: Multi-phase research with suspend/resume for human review
13. **Content Creation**: Copywriter, editor, and report generation agents
14. **Evaluation System**: Quality assessment and learning extraction
15. **Multi-Model Support**: Google Gemini (primary), OpenAI, OpenRouter, Anthropic, Vertex AI

### Database Strategy

16. **Development**: LibSQL (SQLite-compatible, file-based) for fast local development
17. **Production**: PostgreSQL with pgvector for scalability, connection pooling, monitoring

## Constraints and Assumptions

### Technical Constraints

- Node.js >= 20.9.0 required
- External dependencies: OpenAI/Gemini API, Qdrant, LibSQL
- Docker Compose for infrastructure services
- TypeScript strict mode enforced
- **Architecture**: Next.js API routes MUST use lib/mastra-client.ts (never direct Mastra imports)
- **Client-Server Separation**: lib/ directory acts as bridge layer between APIs and Mastra backend

### Assumptions

- Users authenticate before accessing the system
- Documents are pre-classified with appropriate security levels
- Vector embeddings are generated using OpenAI or Gemini models
- Infrastructure services (Qdrant, Redis) are available

### Security Constraints

- Zero-trust architecture: validate at every pipeline stage
- No client-side role manipulation
- JWT tokens include role claims validated server-side
- Access control rules enforced at vector database level

## Target Users

### Public Website Visitors

1. **Prospective Users**: Learn about the platform through landing page, blog, and docs
2. **Documentation Readers**: Access technical documentation and guides
3. **Blog Readers**: Follow updates, architecture insights, and governance best practices

### Platform Users

4. **Enterprise Employees**: Access internal company knowledge through secure RAG
5. **Researchers**: Use multi-phase research workflows with web scraping and evaluation
6. **Product Managers**: Manage product roadmaps (Cedar OS integration planned)
7. **Content Creators**: Generate and edit content using AI-powered copywriter and editor agents
8. **Department Administrators**: Manage department-specific content with elevated access
9. **System Administrators**: Full system access and configuration
10. **Developers**: Integrate and extend the multi-agent platform with Mastra
11. **Compliance Officers**: Audit access logs and security events

## Technology Stack

- **Frontend**: Next.js 15.5.4, React 19.1.1, TypeScript 5.9.2, Tailwind CSS 4.1.13
- **UI Components**: shadcn/ui (47 components), Framer Motion (animations), Lucide React (icons)
- **Content**: MDX for blog and docs with frontmatter parsing (lib/blog.ts, lib/mdx-plugins.ts)
- **Backend**: Mastra 0.18.0, Node.js >= 20.9.0, TypeScript
- **Authentication**:
    - Custom JWT (dev): lib/actions/auth.ts with generateDemoJWT()
    - Supabase (prod-ready): lib/auth.ts with signInWithPassword()
- **AI Models**:
    - Google Gemini 2.5 Flash (primary agent model)
    - Google gemini-embedding-001 (embeddings)
    - OpenAI gpt-4o-mini (alternative)
    - OpenRouter (multi-model support)
- **Mastra Ecosystem**:
    - @mastra/core 0.18.0 (orchestration)
    - @mastra/rag 1.2.6 (vector & graph RAG)
    - @mastra/libsql 0.14.3 (SQLite vectors)
    - @mastra/pg 0.16.1 (PostgreSQL support)
    - @mastra/evals 0.13.8 (evaluation metrics)
    - @mastra/mcp 0.11.2 (Model Context Protocol)
    - @mastra/langfuse 0.10.5 (observability - custom exporter in ai-tracing.ts)
- **Storage**:
    - Qdrant 0.11.13 (vector database)
    - LibSQL (development - file-based SQLite)
    - PostgreSQL (production - with pgvector extension)
    - Redis (caching)
- **Cedar OS**: ReactFlow 11.11.4 (planned integration)
- **Infrastructure**: Docker Compose
- **Development**:
    - ESLint, Prettier (code quality)
    - Vitest 3.2.4 testing with @mastra/evals
    - Turbopack (Next.js fast refresh)
    - Concurrently (dual-server: Next.js port 3000 + Mastra port 4111)

## Project Boundaries

### In Scope

- **Public Website**: Landing page, about, blog (MDX), docs (MDX), contact, login
- **Component Library**: shadcn/ui with 47 components (forms, overlays, feedback, data display)
- **Tailwind CSS v4**: Custom theme with Supabase colors, neon glows, glass effects, typography
- Role-based document access control with 10-role hierarchy
- Secure RAG pipeline implementation (6-agent security workflow)
- Multi-phase research workflows with suspend/resume capabilities
- Content creation with copywriter, editor, and report generation agents
- Product roadmap management (Cedar OS integration planned)
- Document indexing and retrieval with vector and graph RAG
- Real-time chat interface (ChatInterface component)
- Audit logging and compliance features
- Developer documentation and API reference
- Database migration strategy (LibSQL to PostgreSQL)
- Dual authentication (custom JWT for dev, Supabase for prod)

### Out of Scope

- User management UI (assumes external identity provider like Auth0, Clerk)
- Document authoring/editing tools (focuses on retrieval, not creation of source docs)
- Multi-tenant architecture (single tenant 'acme' assumed)
- Real-time document updates (uses batch indexing via CLI)
- Mobile native applications (web-first responsive design)
- **Cedar OS Integration**: Planned for future but not yet implemented (demo-rag has old implementation)

## Success Criteria

1. Security requirements verified through testing (zero unauthorized access)
2. All 16 agents functioning correctly with proper tool integration
3. 9 workflows operational (RAG, research, chat, report generation)
4. Cedar OS roadmap visualization synchronized with agent state
5. Research workflows support suspend/resume for human-in-loop
6. Content generation agents produce quality output (verified by evaluation agent)
7. Database migration path validated (LibSQL → PostgreSQL)
8. Complete documentation for setup and usage
9. Performance benchmarks met (< 2s RAG, < 30s research)
10. Successful deployment to production environment
