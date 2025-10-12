---
title: 'ADR-0002: Dual UI Architecture - Joy Dashboard and Tailwind Cedar-OS'
status: 'Accepted'
date: '2025-10-10'
authors: ['System Architect', 'AI Assistant']
tags: ['architecture', 'decision', 'ui', 'frontend', 'separation-of-concerns']
supersedes: ''
superseded_by: ''
---

# ADR-0002: Dual UI Architecture - Joy Dashboard and Tailwind Cedar-OS

## Status

**Accepted**

## Context

The Governed RAG system has evolved to require two distinct user experiences:

1. **Administrative Control Plane**: Settings, user management, document indexing, system monitoring, policy configuration
2. **AI Interaction Plane**: Real-time chat, workflow execution, voice interactions, visual AI experiences

**Current State:**

- Supabase authentication is now functional
- Backend supports 16+ specialized agents with role-based access control
- Mastra orchestration for workflows and multi-agent systems
- PostgreSQL + PgVector for vector storage
- Two styling systems already in use: MUI Joy v5 (partially migrated) and Tailwind v4 (Cedar-OS)

**Problem Statement:**
We need an architecture that:

- Exposes the full power of the backend through intuitive UIs
- Maintains clear separation between administrative and interactive experiences
- Avoids CSS conflicts and specificity wars
- Enables independent evolution of both UI systems
- Shares authentication and data layers efficiently

## Decision

We will implement a **dual UI architecture** with clear separation of concerns:

### Dashboard - Administrative Control Plane

**Location**: `/app/protected/dash/*`  
**Styling**: MUI Joy v5 beta.52  
**Purpose**: Administrative and configuration interfaces

**Features:**

- User settings and profile management
- Theme preferences and UI customization
- Document management (upload, indexing, classification)
- User administration and role assignment
- System monitoring (agent logs, workflow status, performance metrics)
- Policy configuration (ACL rules, role-based permissions)
- API key and model configuration

**Technology Stack:**

- MUI Joy v5 components (`@/components/ui/*.joy.tsx`)
- Joy `CssVarsProvider` with extended theme
- Joy's built-in dark mode via `useColorScheme()`
- Custom dashboard components (`@/components/dashboard/*`)
- CSS-in-JS (Joy's styling system)

### Cedar-OS - AI Interaction Plane

**Location**: `/app/protected/cedar-os/*`  
**Styling**: Tailwind v4  
**Purpose**: Real-time AI interactions and visual experiences

**Features:**

- Real-time chat with AI agents
- Workflow execution and monitoring
- Voice interactions (VoiceIndicator, transcription)
- Visual spells (RadialMenu, TooltipMenu, QuestioningSpell)
- Context-aware AI assistance
- Agent input context (mentions, state subscription)

**Technology Stack:**

- Cedar components (`@/cedar/components/*`)
- Tailwind v4 utility classes
- Custom CSS for advanced animations
- React state management (context.ts, state.ts, hooks.ts)
- Tailwind config at `app/protected/cedar-os/globals.css`

### Shared Layer

**Location**: `/lib/*`, `/hooks/*`, `/src/mastra/*`  
**Purpose**: Common services consumed by both UIs

**Components:**

- Supabase authentication (`lib/auth.ts`)
- Session management (`lib/session.ts`)
- Mastra client factory (`lib/mastra/mastra-client.ts`)
- Data fetching hooks (`hooks/*`)
- Type definitions (`src/types.ts`)
- Zod schemas (`src/mastra/schemas/*`)
- API routes (`src/mastra/apiRegistry.ts`)

## Consequences

### Positive

- **POS-001**: Clear separation prevents CSS conflicts and specificity issues
- **POS-002**: Each UI system is optimized for its specific use case (forms vs. real-time interactions)
- **POS-003**: Independent evolution paths enable faster development
- **POS-004**: Joy UI provides excellent form components and data grids for administrative interfaces
- **POS-005**: Tailwind enables precise control for Cedar's visual effects and animations
- **POS-006**: Single authentication layer shared by both systems
- **POS-007**: Type-safe integration via shared schemas
- **POS-008**: Backend services exposed through appropriate UI paradigms
- **POS-009**: No framework lock-in - either system can be replaced independently
- **POS-010**: Leverages existing Joy UI migration work (ADR-0001)

### Negative

- **NEG-001**: Increased bundle size (~200KB for Joy, ~50KB for Tailwind CSS)
- **NEG-002**: Learning curve for contributors working across both systems
- **NEG-003**: Need to maintain consistency across two different design systems
- **NEG-004**: Potential for component duplication if not carefully managed
- **NEG-005**: Documentation must cover both styling approaches
- **NEG-006**: Testing complexity increases with two UI systems
- **NEG-007**: Build configuration must handle both styling systems correctly

## Alternatives Considered

### Single UI Framework - Joy UI Only

- **ALT-001**: **Description**: Migrate Cedar-OS components entirely to Joy UI
- **ALT-002**: **Rejection Reason**: Joy UI lacks the low-level control needed for Cedar's visual effects (3D transforms, advanced animations, radial menus). Would require significant custom CSS anyway, negating Joy's benefits for this use case.

### Single UI Framework - Tailwind Only

- **ALT-003**: **Description**: Build dashboard components using Tailwind and headless UI libraries
- **ALT-004**: **Rejection Reason**: Would abandon significant Joy UI migration work (ADR-0001). Joy's built-in components (data grids, forms, navigation) are superior for administrative interfaces. Tailwind is better for custom visual experiences, not form-heavy applications.

### Completely Separate Applications

- **ALT-005**: **Description**: Deploy dashboard and Cedar-OS as separate Next.js applications
- **ALT-006**: **Rejection Reason**: Would duplicate authentication, data fetching, API routes, and type definitions. Increases deployment complexity and maintenance burden. Session management across apps is complex. Shared components become npm packages, slowing development.

### Hybrid Component System

- **ALT-007**: **Description**: Create abstraction layer allowing components to render with either Joy or Tailwind
- **ALT-008**: **Rejection Reason**: Adds significant complexity for minimal benefit. Abstraction layer becomes a maintenance burden. Each system's strengths would be diluted by lowest-common-denominator API. The two use cases are different enough that shared components provide little value.

## Implementation Notes

- **IMP-001**: Dashboard layout must wrap content in `CssVarsProvider` with extended Joy theme
- **IMP-002**: Cedar-OS layout must NOT import Joy components or use Joy CSS variables
- **IMP-003**: Shared hooks use `createAuthenticatedMastraClient()` for backend communication
- **IMP-004**: Route structure enforces separation: `/protected/dash/*` vs `/protected/cedar-os/*`
- **IMP-005**: `components.json` Tailwind config points only to `app/protected/cedar-os/globals.css`
- **IMP-006**: Joy components use path alias `@/components/ui/*.joy.tsx`
- **IMP-007**: Cedar components use path alias `@/cedar/components/*`
- **IMP-008**: Dashboard components use path alias `@/components/dashboard/*`
- **IMP-009**: Both systems use `InitColorSchemeScript` to prevent dark mode flicker (Joy and Tailwind have separate implementations)
- **IMP-010**: TypeScript types are shared via `src/types.ts` and Zod schemas
- **IMP-011**: API routes in `/app/api/*` serve both UIs with JWT authentication
- **IMP-012**: Navigation between systems is seamless - user stays authenticated across both

## References

- **REF-001**: ADR-0001 - Migration from shadcn/Tailwind to MUI Joy
- **REF-002**: [MUI Joy UI Documentation](https://mui.com/joy-ui/getting-started/)
- **REF-003**: [Tailwind CSS v4 Alpha](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- **REF-004**: [Cedar OS Design System](https://cedar.dev)
- **REF-005**: Mastra Documentation - Multi-Agent Orchestration
- **REF-006**: Supabase Authentication Documentation
- **REF-007**: Project Memory Bank - Architecture Context

## Migration Path

### Phase 1: Foundation (Week 1)

1. Create dashboard directory structure
2. Implement base dashboard layout with Joy theme provider
3. Create shared authentication hooks
4. Build dashboard navigation component
5. Implement theme toggle for Joy UI dark mode

### Phase 2: Core Dashboard Features (Week 2-3)

1. User settings page (profile, preferences)
2. System overview dashboard (metrics cards)
3. Document management list view
4. Basic monitoring views (agent logs, workflow status)

### Phase 3: Advanced Administration (Week 4-5)

1. User management (CRUD, role assignment)
2. Document upload and indexing interface
3. Policy editor (ACL configuration)
4. Advanced monitoring (performance charts, detailed logs)
5. API configuration interface

### Phase 4: Integration & Polish (Week 6)

1. Comprehensive error handling
2. Loading states and skeletons
3. Responsive design optimization
4. Accessibility audit (WCAG 2.1 AA)
5. Documentation and examples

### Phase 5: Ongoing

- Cedar-OS continues development independently
- Both systems evolve based on user feedback
- Shared layer improves as patterns emerge
