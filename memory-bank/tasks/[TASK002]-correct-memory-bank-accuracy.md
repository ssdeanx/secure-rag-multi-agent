# [TASK002] - Correct Memory Bank with Accurate Project Information

**Status:** In Progress  
**Added:** 2025-09-30, 15:00 EST  
**Updated:** 2025-09-30, 15:00 EST  
**Priority:** Critical  
**Challenge Level:** Medium  
**Completion Percentage:** 50%  
**Notes:** Fix assumptions - memory bank must reflect actual codebase

## Original Request

User: "its close but alot of it is assumptions. i have way more agents then that. have more worflows & trying to combine cedar with mastra agents tools workflows components then i have public part. this will have secure rag but i also will have research agents, productmanager ect. also right now im using libsql but in production i plan to go with pg. also role-hierarchy.ts agent-schemas.ts policy config services - its critical you have accurate info so we can not have gaps."

## Thought Process

The initial memory bank was created with assumptions rather than reading actual source code. This is a CRITICAL failure - the memory bank must be 100% accurate or it will cause AI agents to make wrong decisions.

**Actual Facts from Codebase:**

### Agents (16 total, not "15+")

1. answerer.agent.ts - RAG answer composer
2. assistant.ts - Full-featured assistant with tools
3. copywriterAgent.ts - Content creation
4. editorAgent.ts - Content editing/refinement
5. evaluationAgent.ts - Result evaluation
6. identity.agent.ts - JWT validation (Security Pipeline)
7. learningExtractionAgent.ts - Extract learnings from content
8. policy.agent.ts - Access filter generation (Security Pipeline)
9. productRoadmapAgent.ts - Product/roadmap management
10. reportAgent.ts - Report generation
11. rerank.agent.ts - Relevance scoring (Security Pipeline)
12. researchAgent.ts - Multi-phase research
13. retrieve.agent.ts - Vector search (Security Pipeline)
14. selfReferencingAgent.ts - Self-referential tasks
15. starterAgent.ts - Template/starter agent
16. verifier.agent.ts - Compliance checking (Security Pipeline)

### Workflows (9 total, not vague "workflows")

1. governed-rag-answer.workflow.ts - Secure RAG pipeline
2. governed-rag-index.workflow.ts - Document indexing
3. researchWorkflow.ts - Multi-phase research
4. generateReportWorkflow.ts - Report compilation
5. chatWorkflow.ts - Chat orchestration (Cedar integration)
6. chatWorkflow1.ts - Chat variant
7. chatWorkflowSharedTypes.ts - Shared schemas
8. chatWorkflowTypes.ts - Type definitions
9. chatWorkflowTypes1.ts - Additional types

### Tools (11 total)

1. jwt-auth.tool.ts - JWT verification
2. vector-query.tool.ts - Secure vector search
3. web-scraper-tool.ts - Content fetching
4. data-file-manager.ts - File operations
5. copywriter-agent-tool.ts - Copywriter as tool
6. editor-agent-tool.ts - Editor as tool
7. starter-agent-tool.ts - Starter agent invocation
8. evaluateResultTool.ts - Evaluation tool
9. extractLearningsTool.ts - Learning extraction
10. roadmapTool.ts - Roadmap interactions (Cedar OS)
11. weather-tool.ts - Example external API

### Services (10 total)

1. AuthenticationService.ts - JWT & policy coordination
2. RoleService.ts - Role expansion & hierarchy
3. VectorQueryService.ts - Secure vector search assembly
4. DocumentProcessorService.ts - Indexing orchestration
5. ChunkingService.ts - Text segmentation
6. EmbeddingService.ts - Embedding generation
7. VectorStorageService.ts - Qdrant persistence
8. ValidationService.ts - Common validations
9. WorkflowDecorators.ts - Step wrappers
10. DocumentIndexingService.ts - Document processing

### Cedar OS Integration

- **Purpose**: Interactive 3D UI with ReactFlow roadmap
- **Status**: **PLANNED - NOT YET INTEGRATED**
- **Current State**: demo-rag folder has old RAG implementation
- **Future Work**: Cedar integration into governed RAG workflow requires Cedar types
- **Components Designed**:
    - RoadmapCanvas, FeatureNode, RoadmapNode
    - ChatModeSelector
    - FloatingCedarChat, SidePanelCedarChat, EmbeddedCedarChat
    - Spells: QuestioningSpell, RadialMenuSpell, TooltipMenuSpell
    - Debugger panel
- **Integration Plan**: productRoadmapAgent will bridge Mastra <-> Cedar state (future)

### Database Strategy

- **Development**: LibSQL (SQLite-compatible, file-based)
    - `DATABASE_URL=file:deep-research.db`
    - `VECTOR_DATABASE_URL=file:./vector-store.db`
- **Production Plan**: PostgreSQL with pgvector
    - Config ready in `pg-storage.ts`
    - Supports connection pooling, SSL, monitoring
    - 1568 dimension embeddings

### Configuration Files

- `role-hierarchy.ts`: 10 roles with inheritance mapping
- `agent-schemas.ts`: 20+ Zod schemas for all agents
- `acl.yaml`: Document-level access control rules
- `libsql-storage.ts`: 1143 lines - comprehensive storage layer
- `pg-storage.ts`: 544 lines - production PostgreSQL setup
- **AI Provider Configs**:
    - `google.ts`: Gemini 2.5 Pro, Flash, Flash-Lite, Embedding-001
    - `openai.ts`: GPT models and embeddings
    - `openrouter.ts`: Multi-model provider support
    - `anthropic.ts`: Claude models
    - `vertex.ts`: Google Vertex AI
- `logger.ts`: PinoLogger with file transport (logs/workflow.log, logs/mastra.log)
- `vector-store.ts`: Qdrant vector database configuration

### Root-Level Mastra Files (CRITICAL - Previously Missed!)

- **`ai-tracing.ts`**: Custom Langfuse exporter for AI observability
    - Exports traces, spans, LLM generations, and events to Langfuse
    - Supports realtime mode (flushes after each event)
    - Graceful handling of missing credentials (disables if not configured)
    - Maps Mastra AI tracing events to Langfuse trace/span/generation hierarchy
    - Used in index.ts: `LangfuseExporter` with sampling strategy
- **`apiRegistry.ts`**: API route registration for Mastra backend
    - `/chat` (POST): Standard request-response chat endpoint
    - `/chat/stream` (POST): Server-sent events (SSE) for streaming responses
    - Uses `chatWorkflow.createRunAsync()` to execute workflows
    - Zod schema validation with OpenAPI documentation
    - SSE streaming with `createSSEStream()` from utils/streamUtils
    - Integrates Cedar-OS frontend with Mastra agents

### Testing Infrastructure

- **Vitest 3.2.4**: Test runner with jsdom environment
- **Configuration**: vitest.config.ts with coverage, reporters, timeouts
    - Coverage: V8 provider with HTML/JSON/LCOV reports
    - Test timeout: 10 seconds
    - Include: src/**/\*.{test,spec}.{ts,tsx}, tests/**/\*.{test,spec}.{ts,tsx}
    - Reporters: dot, json (output to tests/test-results/)
- **globalSetup.ts**: @mastra/evals global setup
- **testSetup.ts**:
    - Mocks env-sensitive providers (Gemini)
    - Mocks Mastra instance for component tests
    - Attaches @mastra/evals listeners to Mastra
    - Imports @testing-library/jest-dom
    - Provides roadmap API placeholder symbols

### Tailwind CSS v4.1.13 Configuration

- **Version**: Tailwind CSS 4.1.13 (latest v4)
- **Plugins**:
    - @tailwindcss/forms (form styling)
    - @tailwindcss/typography (prose styling)
    - tw-animate-css (animation utilities)
    - tailwindcss-motion (motion utilities)
- **Custom Theme** (global.css):
    - Supabase-inspired color palette (zinc/yellow/teal/red/green)
    - Neon glow effects (blue, yellow, teal, red, green - NO pink/purple)
    - Glass effects (glass-effect, glass-light, glass-dark, glass-subtle)
    - Gradient animations (gradient-shift, animated-gradient)
    - Enhanced hover effects (hover-lift, hover-glow)
    - Security badges (public, internal, confidential)
    - Button utilities (btn, btn-ghost, btn-primary, btn-sm)
    - Prism syntax highlighting (light + dark modes)
    - Heading anchor styles
    - Accessibility (reduced motion support)

### Component Library (Accurate Count)

- **47 shadcn/ui components** (not 50+):
    - Layout: accordion, collapsible, resizable, scroll-area, separator, tabs
    - Forms: button, checkbox, input, label, radio-group, select, slider, switch, textarea, form
    - Overlays: alert-dialog, dialog, drawer, dropdown-menu, hover-card, menubar, navigation-menu, popover, sheet, tooltip
    - Feedback: alert, progress, skeleton, sonner (toast)
    - Data: avatar, badge, card, table, chart
    - Date: calendar, day-picker
    - Navigation: breadcrumb, context-menu, sidebar, toggle, toggle-group
    - Other: aspect-ratio, carousel, command, input-otp

### Development Workflow

- **npm run dev**: Runs concurrently (dual-server setup)
    - Terminal 1 (blue): Next.js dev server on port 3000 (with Turbopack)
    - Terminal 2 (green): Mastra dev server on port 4111
    - Uses concurrently package for parallel execution
    - Color-coded output for easy identification
- **npm run dev:next**: Next.js only
- **npm run dev:mastra**: Mastra backend only
- **npm run build**: Production build (Next.js)
- **npm test**: Vitest test runner
- **npm run lint**: ESLint checking
- **npm run pretty**: Prettier formatting

### Architecture: API-Backend Separation

**CRITICAL ARCHITECTURAL PATTERN**:

- **Never import Mastra directly in Next.js API routes**
- **Always use `lib/mastra/mastra-client.ts`** as the bridge layer
- **`lib/` directory** = connection layer between Next.js APIs and Mastra backend
- Flow: `app/api/* → lib/mastra-client.ts (MastraClient) → Mastra backend`
- `mastra-client.ts` handles:
    - Base URL configuration (localhost:4111 dev, configurable prod)
    - JWT token injection per-request (user tokens, not service token)
    - Proper client-server separation

### Frontend Structure: Public Website + Demo Apps

**Public Website** (main landing):

- `/` - Hero, InteractiveFeatures, Newsletter, CTA (components/landing/)
- `/about` - AboutHero, TeamGrid, ValuesGrid (components/about/)
- `/blog` - MDX blog with ArticleCard, Pagination (blog/\*.mdx, lib/blog.ts for parsing)
- `/docs` - MDX documentation with DocsLayout, DocsSearch, DocsTOC (docs/\*.mdx)
- `/contact` - ContactForm (components/contact/)
- `/login` - AuthForm with dual auth (JWT or Supabase)

**Demo/Testing Apps**:

- `/demo-rag` - Old RAG implementation (pre-Cedar)
- `/cedar-os` - Cedar OS showcase (future integration target)
- `/tests` - Testing page

**Component Organization**:

- Top-level: ChatInterface, AuthPanel, IndexingPanel, SecurityIndicator, TopNavigation, Footer
- Feature folders: landing/, docs/, blog/, about/, contact/, login/
- ui/: 47 shadcn/ui components (button, card, dialog, etc.)

**Content Management**:

- Blog: MDX files in /blog with frontmatter (title, date, excerpt, tags, author)
- Docs: MDX files in /docs with TOC generation
- lib/blog.ts: Frontmatter parser, reading time calculator, pagination
- lib/mdx-plugins.ts: Custom MDX processing

### Authentication Strategy

**Dual Auth Support** (configurable):

1. **Custom JWT** (current dev setup):
    - `lib/actions/auth.ts`: generateDemoJWT() server action
    - Role mapping: finance, engineering, hr, executive
    - Uses JWT_SECRET from env
    - 2-hour expiration, HS256 signing

2. **Supabase** (production-ready):
    - `lib/auth.ts`: getSupabaseAuthToken()
    - Uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
    - signInWithPassword flow
    - Returns session access_token

**Current**: Development uses custom JWT generation for demo roles

### Project Scope (Corrected)

This is NOT just "governed RAG" - it's a **multi-agent AI platform** with:

1. **Secure RAG** (6-agent security pipeline)
2. **Research capabilities** (research agent + workflows)
3. **Content creation** (copywriter, editor, report agents)
4. **Product management** (productRoadmap agent + Cedar OS)
5. **Interactive UI** (Cedar 3D components)
6. **Public facing features** (not mentioned in initial docs)

## Implementation Plan

1. ✅ Update projectbrief.md - expand scope, correct agent count
2. ✅ Update productContext.md - add research/product management personas
3. ⏳ Update systemPatterns.md - document Cedar integration, correct architecture
4. ⏳ Update techContext.md - document LibSQL->PG migration strategy
5. ⏳ Update progress.md - correct feature lists, add Cedar capabilities
6. ⏳ Update activeContext.md - reflect expanded scope
7. ⏳ Create design documents for:
    - Cedar OS Integration Design
    - Multi-Agent Platform Architecture
    - Database Migration Strategy
8. ⏳ Validate all cross-references are accurate

## Current Progress: 60% Complete (8/13 subtasks done)

## Progress Tracking

**Overall Status:** In Progress - 35%

### Subtasks

| ID   | Description                   | Status      | Updated               | Notes                                           |
| ---- | ----------------------------- | ----------- | --------------------- | ----------------------------------------------- |
| 2.1  | Read all agent source files   | Complete    | 2025-09-30, 15:00 EST | 16 agents identified                            |
| 2.2  | Read all workflow files       | Complete    | 2025-09-30, 15:00 EST | 9 workflows identified                          |
| 2.3  | Read all tool files           | Complete    | 2025-09-30, 15:00 EST | 11 tools identified                             |
| 2.4  | Read all service files        | Complete    | 2025-09-30, 15:00 EST | 10 services identified                          |
| 2.5  | Document Cedar OS integration | Complete    | 2025-09-30, 15:00 EST | ReactFlow + agent bridge                        |
| 2.6  | Document database strategy    | Complete    | 2025-09-30, 15:00 EST | LibSQL dev, PG prod                             |
| 2.7  | Update projectbrief.md        | Complete    | 2025-09-30, 16:00 EST | Corrected Cedar status, added lib/ architecture |
| 2.8  | Update productContext.md      | Not Started | -                     | Add personas                                    |
| 2.9  | Update systemPatterns.md      | Not Started | -                     | Cedar architecture                              |
| 2.10 | Update techContext.md         | Not Started | -                     | Database migration                              |
| 2.11 | Update progress.md            | Not Started | -                     | Correct features                                |
| 2.12 | Create Cedar design doc       | Not Started | -                     | New design                                      |
| 2.13 | Validate all accuracy         | Not Started | -                     | Final check                                     |

## Progress Log

### 2025-09-30, 17:30 EST

- **FINAL DETAILS DOCUMENTED** (User: "yes complete it"):
    - **Testing Infrastructure**:
        - Vitest 3.2.4 with jsdom environment
        - @mastra/evals integration (globalSetup.ts, testSetup.ts)
        - V8 coverage provider with HTML/JSON/LCOV reports
        - 10-second timeouts, mocks for Gemini and Mastra instance
        - Test files: src/**/\*.{test,spec}.{ts,tsx}, tests/**/\*.{test,spec}.{ts,tsx}
    - **Tailwind CSS v4.1.13**:
        - Custom Supabase-inspired theme (zinc/yellow/teal/red/green)
        - Neon glow effects (NO pink/purple per user requirements)
        - Glass effects, gradient animations, hover effects
        - Plugins: @tailwindcss/forms, @tailwindcss/typography, tw-animate-css
        - Prism syntax highlighting for code blocks
        - Security badge styling, button utilities
    - **Corrected Component Count**: 47 shadcn/ui components (NOT 50+)
        - Categories: Layout, Forms, Overlays, Feedback, Data, Date, Navigation
    - **Dual-Server Development**:
        - npm run dev uses concurrently package
        - Starts Next.js (blue, port 3000) + Mastra (green, port 4111) simultaneously
        - Color-coded terminal output for easy identification
- **Updated projectbrief.md** with accurate testing, Tailwind v4, component count
- User feedback: "you got basically the whole picture"
- Task ready for final validation and completion of remaining memory bank files

### 2025-09-30, 17:00 EST

- **FOUND MISSING ROOT-LEVEL FILES** (User: "i think u missed 2 folders"):
    - `ai-tracing.ts` (339 lines): Custom LangfuseExporter for AI observability
        - Exports traces, spans, LLM generations, events to Langfuse
        - Realtime mode support (flushes after each event)
        - Graceful credential handling (disables if missing keys)
        - Integrated in index.ts with sampling strategy
    - `apiRegistry.ts` (98 lines): API route registration for Mastra backend
        - POST /chat: Standard request-response endpoint
        - POST /chat/stream: SSE streaming endpoint
        - Uses chatWorkflow.createRunAsync() for execution
        - Zod validation with OpenAPI schema generation
        - SSE with createSSEStream() from utils/streamUtils
        - **Bridges Cedar-OS frontend to Mastra agents**
- These are CRITICAL infrastructure files at src/mastra/ root level
- ai-tracing.ts handles all observability/monitoring
- apiRegistry.ts defines how frontend communicates with backend
- Updated task documentation with these files

### 2025-09-30, 16:30 EST

- **DISCOVERED: Public-facing website with multiple sections**
    - Landing page: Hero, InteractiveFeatures, Newsletter, CTA (Framer Motion animations)
    - About page: AboutHero, TeamGrid, ValuesGrid
    - Blog: MDX files with frontmatter parsing (lib/blog.ts), ArticleCard, Pagination
    - Docs: MDX documentation with DocsLayout, DocsSearch, DocsTOC
    - Contact: ContactForm
    - Login: AuthForm with dual auth support
- **Component organization clarified**:
    - Top-level: ChatInterface, AuthPanel, IndexingPanel, SecurityIndicator, TopNavigation, Footer
    - Feature folders: landing/, docs/, blog/, about/, contact/, login/
    - ui/: 50+ shadcn components (button, card, dialog, dropdown, etc.)
- **MDX content system**:
    - blog/\*.mdx with frontmatter (title, date, excerpt, tags, author)
    - docs/\*.mdx with table of contents generation
    - lib/blog.ts: parseFrontmatter(), readingTime(), pagination
    - lib/mdx-plugins.ts: Custom MDX processing
- **Dual authentication strategy clarified**:
    - Custom JWT (current dev): lib/actions/auth.ts with generateDemoJWT() server action
    - Supabase (prod-ready): lib/auth.ts with getSupabaseAuthToken()
    - Role mapping in JWT: finance, engineering, hr, executive
- **lib/ layer utilities**:
    - mastra/mastra-client.ts: Bridge to Mastra backend
    - actions/auth.ts: Server actions for JWT generation
    - auth.ts: Supabase integration
    - blog.ts: MDX blog parsing and pagination
    - jwt-utils.ts: JWT helpers
    - mdx-plugins.ts: MDX processing
    - metadata.ts: SEO/metadata utilities
    - utils.ts: General utilities (cn(), etc.)
- Updated projectbrief.md with public website structure, component organization, dual auth
- User feedback: "we are using mdx for blog & docs"

### 2025-09-30, 16:00 EST

- **CRITICAL CORRECTION: Cedar OS is NOT integrated yet**
    - User clarified: Cedar integration is planned but not implemented
    - demo-rag folder has old RAG implementation (pre-Cedar)
    - Moved Cedar from "current features" to "future work / out of scope"
    - productRoadmapAgent exists but Cedar bridge not yet built
- **CRITICAL CORRECTION: Architecture pattern for API-backend connection**
    - MUST use `lib/mastra/mastra-client.ts` - never direct Mastra imports in APIs
    - lib/ directory = bridge layer between Next.js API routes and Mastra backend
    - Pattern: `app/api/* → lib/mastra-client.ts → Mastra backend (localhost:4111)`
    - User emphasized: "cannot put mastra straight into api"
- **Added provider configuration details**:
    - google.ts: gemini-2.5-pro, gemini-2.5-flash, gemini-2.5-flash-lite, gemini-embedding-001
    - openai.ts, openrouter.ts, anthropic.ts, vertex.ts for multi-model support
    - logger.ts: PinoLogger with file transports (logs/workflow.log, logs/mastra.log)
- Updated projectbrief.md with accurate Cedar status and lib/ architecture constraint
- User feedback: "its very close to 100% check more config thats where i have providers/logs as well"

### 2025-09-30, 15:30 EST

- **Updated projectbrief.md with accurate information**:
    - Corrected project vision to reflect multi-agent platform (not just secure RAG)
    - Updated success metrics to include Cedar OS, research, and content capabilities
    - Listed all 16 agents, 9 workflows, 11 tools, 10 services with accurate categories
    - Added 10-role hierarchy details (admin=100, dept admins=80, dept viewers=60, employee=40, reader=35, public=10)
    - Documented Cedar OS integration (ReactFlow, spells, interactive 3D UI)
    - Added database strategy (LibSQL for dev, PostgreSQL for prod)
    - Expanded target users to include researchers, product managers, content creators
    - Updated tech stack with precise versions (Mastra 0.18.0, Next 15.5.4, etc.)
    - Clarified project scope and boundaries with Cedar OS features
- Task progressed to 20% complete
- Next: Update productContext.md with research and product management personas

### 2025-09-30, 15:00 EST

- User pointed out critical issue: memory bank has assumptions not facts
- Read actual source files to get ground truth
- Discovered project is much larger than documented:
    - 16 agents (not "15+")
    - 9 workflows (not just 2)
    - 11 tools
    - 10 services
    - Full Cedar OS integration
    - Research + product management capabilities
    - LibSQL->PostgreSQL migration planned
- Created this task to systematically fix all inaccuracies
- Completed subtasks 2.1-2.6 (discovery phase)
- Ready to begin systematic corrections

## Critical Corrections Needed

### 1. Scope Expansion

**Wrong**: "Secure RAG system"  
**Right**: "Multi-agent AI platform with secure RAG, research, content creation, product management, and interactive 3D UI"

### 2. Agent Count

**Wrong**: "15+ specialized agents"  
**Right**: "16 specialized agents across 5 categories: Security (6), Research (4), Content (3), Product (1), Templates (2)"

### 3. Cedar OS

**Wrong**: Not mentioned or unclear integration  
**Right**: "Full Cedar OS integration with ReactFlow roadmaps, 3D UI components, agent-state bridge via productRoadmapAgent"

### 4. Database

**Wrong**: "LibSQL backend"  
**Right**: "LibSQL for development (file-based), PostgreSQL with pgvector for production (migration strategy defined)"

### 5. Workflows

**Wrong**: Vague "workflow orchestration"  
**Right**: "9 workflows: 2 RAG, 2 research, 5 chat variants with Cedar integration"

### 6. Target Users

**Wrong**: Only corporate security use cases  
**Right**: Add researchers, product managers, content creators, developers using interactive UI

## Next Steps

1. Systematically update each core memory bank file
2. Use multi_replace for efficient updates
3. Add Cedar OS as major architectural component
4. Document LibSQL->PG migration path
5. Create new design documents for undocumented features
6. Validate with user before marking complete

## Validation Checklist

- [ ] All 16 agents documented accurately
- [ ] All 9 workflows listed with purposes
- [ ] All 11 tools described
- [ ] All 10 services explained
- [ ] Cedar OS integration fully documented
- [ ] Database strategy (dev vs prod) clear
- [ ] Role hierarchy (10 roles) accurate
- [ ] Policy files documented
- [ ] No remaining assumptions or guesses
- [ ] User confirms accuracy

## Lessons Learned

**CRITICAL LESSON**: Never assume - always read source code first. Memory bank with inaccurate info is worse than no memory bank because it causes AI agents to make confident but wrong decisions.

**Process Fix**: Before creating any memory bank content:

1. List all files in relevant directories
2. Read actual implementation files
3. Count and categorize accurately
4. Document what EXISTS, not what we think exists
5. Validate with user

## Related Documents

- All core memory bank files (require updates)
- src/mastra/agents/\*.ts (source of truth for agents)
- src/mastra/workflows/\*.ts (source of truth for workflows)
- cedar/\*_/_.tsx (Cedar OS implementation)
- src/mastra/config/\*.ts (configuration files)
