---
goal: Migrate Frontend from Shadcn/UI + Tailwind CSS to MUI Joy UI
version: 1.0
date_created: 2025-10-08
last_updated: 2025-10-08
owner: System Architect
status: 'In progress'
tags: ['upgrade', 'frontend', 'ui', 'migration', 'mui', 'joy-ui']
---

# Introduction

![Status: In progress](https://img.shields.io/badge/status-In%20progress-yellow)

This implementation plan outlines the systematic migration from Shadcn/UI + Tailwind CSS to MUI Joy UI. The migration addresses critical issues with CSS complexity, bundle size, and maintainability while maintaining existing functionality and improving the overall developer experience.

Based on analysis of the codebase, approximately 20+ Shadcn/UI components are in use across 48 component files, with heavy Tailwind utility class usage throughout. This migration will replace all Shadcn components with MUI Joy equivalents and eliminate Tailwind dependency.

## 1. Requirements & Constraints

- **REQ-001**: All existing component functionality must be preserved
- **REQ-002**: Zero breaking changes to component APIs for consuming code
- **REQ-003**: Maintain current design language and visual consistency
- **REQ-004**: Preserve all accessibility features and compliance
- **REQ-005**: Support existing dark/light theme switching
- **REQ-006**: Bundle size must not increase more than 10% during transition
- **REQ-007**: All TypeScript types must be properly migrated
- **REQ-008**: Existing test suite must pass with minimal modifications

- **SEC-001**: Maintain WCAG 2.1 Level AA compliance
- **SEC-002**: Ensure keyboard navigation continues to work correctly
- **SEC-003**: Screen reader compatibility must not regress

- **CON-001**: Migration must be completed in phases to allow incremental testing
- **CON-002**: Production deployments must not be blocked during migration
- **CON-003**: Developer workflow must not be significantly disrupted
- **CON-004**: MUI Joy is in beta; monitor for breaking changes

- **GUD-001**: Use MUI Joy's CSS variables for theming
- **GUD-002**: Leverage Joy's global variant system (solid, soft, outlined, plain)
- **GUD-003**: Maintain component composition patterns where possible
- **GUD-004**: Document all component API changes in migration guide

- **PAT-001**: Follow Joy UI's extendTheme pattern for customization
- **PAT-002**: Use Joy's sx prop for one-off styling instead of utility classes
- **PAT-003**: Implement custom components using Joy's styled API
- **PAT-004**: Centralize theme configuration in single source of truth

## 2. Implementation Steps

### Phase 0: Preparation & Setup

**GOAL-001**: Install dependencies, configure MUI Joy, establish theme foundation, create migration utilities

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Install MUI Joy packages (@mui/joy, @mui/material for icons) | ✅ | 2025-10-08 |
| TASK-002 | Create Joy UI theme configuration file (lib/theme/joy-theme.ts) matching current design tokens | ✅ | 2025-10-08 |
| TASK-003 | Set up CSS baseline and global styles integration in app/layout.tsx | ✅ | 2025-10-08 |
| TASK-004 | Create component mapping document (Shadcn → Joy equivalents) | ✅ | 2025-10-08 |
| TASK-005 | Build codemods/migration scripts for common patterns | | |
| TASK-006 | Create parallel import structure to allow gradual migration | ✅ | 2025-10-08 |
| TASK-007 | Document Joy UI coding standards and patterns | | |
| TASK-008 | Set up bundle size monitoring baseline | | |

### Phase 1: Core UI Primitives Migration

**GOAL-002**: Replace foundational components (Button, Input, Badge, Avatar, Progress) that have minimal dependencies

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-009 | Migrate Button component (components/ui/button.tsx → Joy Button) | ✅ | 2025-10-08 |
| TASK-010 | Update all Button usages in app/ and components/ directories | | |
| TASK-011 | Migrate Badge component and update usages | ✅ | 2025-10-08 |
| TASK-012 | Migrate Avatar component and update usages | ✅ | 2025-10-08 |
| TASK-013 | Migrate Progress component and update usages | ✅ | 2025-10-08 |
| TASK-014 | Migrate Input component maintaining form compatibility | ✅ | 2025-10-08 |
| TASK-015 | Migrate Textarea component | ✅ | 2025-10-08 |
| TASK-016 | Run visual regression tests on updated components | | |
| TASK-017 | Update component documentation and Storybook (if exists) | | |

### Phase 2: Layout & Container Components

**GOAL-003**: Migrate structural components (Card, Sheet, Dialog, Separator, ScrollArea)

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-018 | Migrate Card component (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter) | ✅ | 2025-10-08 |
| TASK-019 | Update all Card usages in blog, docs, and main components | | |
| TASK-020 | Migrate Sheet component to Joy Modal/Drawer | ✅ | 2025-10-08 |
| TASK-021 | Update Sheet usages in TopNavigation and mobile menus | | |
| TASK-022 | Migrate Dialog/AlertDialog to Joy Modal with variants | ✅ | 2025-10-08 |
| TASK-023 | Migrate Separator component to Joy Divider | ✅ | 2025-10-08 |
| TASK-024 | Migrate ScrollArea to Joy custom implementation | | |
| TASK-025 | Test responsive behavior across breakpoints | | |

### Phase 3: Form & Input Components

**GOAL-004**: Migrate form-related components maintaining validation and accessibility

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-026 | Migrate Form, FormField, FormLabel, FormControl to Joy alternatives | ✅ | 2025-10-08 |
| TASK-027 | Migrate Select component to Joy Select | ✅ | 2025-10-08 |
| TASK-028 | Migrate Checkbox component | ✅ | 2025-10-08 |
| TASK-029 | Migrate Radio Group component | ✅ | 2025-10-08 |
| TASK-030 | Migrate Switch/Toggle components | ✅ | 2025-10-08 |
| TASK-031 | Migrate Slider component | ✅ | 2025-10-08 |
| TASK-032 | Update react-hook-form integration patterns | | |
| TASK-033 | Migrate Calendar/DatePicker (requires custom implementation) | | |
| TASK-034 | Test form validation and accessibility features | | |

### Phase 4: Navigation Components

**GOAL-005**: Migrate navigation components (Menubar, DropdownMenu, NavigationMenu, Breadcrumb, Tabs)

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-035 | Migrate Menubar component to Joy Menu | ✅ | 2025-10-08 |
| TASK-036 | Update TopNavigation to use Joy Menu system | | |
| TASK-037 | Migrate DropdownMenu to Joy Dropdown | ✅ | 2025-10-08 |
| TASK-038 | Migrate NavigationMenu for main site navigation | | |
| TASK-039 | Migrate Breadcrumb component to Joy Breadcrumbs | ✅ | 2025-10-08 |
| TASK-040 | Migrate Tabs component to Joy Tabs | ✅ | 2025-10-08 |
| TASK-041 | Migrate Collapsible component to Joy Accordion equivalent | ✅ | 2025-10-08 |
| TASK-042 | Test keyboard navigation and focus management | | |

### Phase 5: Feedback & Overlay Components

**GOAL-006**: Migrate user feedback components (Alert, Toast, Tooltip, HoverCard, Popover)

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-043 | Migrate Alert component to Joy Alert | ✅ | 2025-10-08 |
| TASK-044 | Update SecurityIndicator to use Joy Alert | | |
| TASK-045 | Migrate Tooltip component | ✅ | 2025-10-08 |
| TASK-046 | Migrate HoverCard to Joy custom component | | |
| TASK-047 | Migrate Popover component | | |
| TASK-048 | Migrate Toast/Sonner to Joy Snackbar | | |
| TASK-049 | Migrate ContextMenu to Joy Menu variant | | |
| TASK-050 | Test all overlay positioning and z-index behavior | | |

### Phase 6: Data Display Components

**GOAL-007**: Migrate complex data components (Table, Accordion, Command, Chart)

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-051 | Migrate Table component to Joy Table or custom implementation | ✅ | 2025-10-08 |
| TASK-052 | Update data-heavy pages to use new Table | | |
| TASK-053 | Migrate Accordion component to Joy Accordion | ✅ | 2025-10-08 |
| TASK-054 | Migrate Command palette (may need custom implementation) | | |
| TASK-055 | Update DocsSearch to use Joy alternatives | | |
| TASK-056 | Migrate Chart components or keep recharts integration | | |
| TASK-057 | Migrate Carousel using embla-carousel-react | | |
| TASK-058 | Test performance with large datasets | | |

### Phase 7: Utility & Advanced Components

**GOAL-008**: Migrate remaining specialized components (Resizable, Drawer, Sidebar, Skeleton)

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-059 | Migrate or retain ResizablePanels (may keep react-resizable-panels) | | |
| TASK-060 | Migrate Drawer component to Joy Drawer | ✅ | 2025-10-08 |
| TASK-061 | Migrate Sidebar component to Joy navigation pattern | | |
| TASK-062 | Migrate Skeleton component to Joy Skeleton | ✅ | 2025-10-08 |
| TASK-063 | Migrate Pagination component | | |
| TASK-064 | Migrate AspectRatio component | ✅ | 2025-10-08 |
| TASK-065 | Review and migrate any remaining Radix primitives | | |

### Phase 8: Theme & Styling System

**GOAL-009**: Complete Tailwind removal and finalize Joy UI theming

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-066 | Map all Tailwind utility classes to Joy sx equivalents | | |
| TASK-067 | Convert global.css custom styles to Joy theme tokens | | |
| TASK-068 | Update ThemeProvider to use Joy CssVarsProvider | | |
| TASK-069 | Implement dark/light mode toggle with Joy theme | | |
| TASK-070 | Remove Tailwind config and dependencies | | |
| TASK-071 | Remove unused @tailwindcss/* packages | | |
| TASK-072 | Update PostCSS config to remove Tailwind | | |
| TASK-073 | Clean up cn() utility or replace with Joy's styled | | |
| TASK-074 | Document theme customization patterns | | |

### Phase 9: Cleanup & Optimization

**GOAL-010**: Remove old dependencies, optimize bundle, finalize documentation

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-075 | Remove all Shadcn UI component files from components/ui/ | | |
| TASK-076 | Remove Radix UI dependencies no longer needed | | |
| TASK-077 | Remove Tailwind CSS and related packages | | |
| TASK-078 | Remove class-variance-authority if no longer used | | |
| TASK-079 | Remove tailwind-merge (clsx can remain) | | |
| TASK-080 | Update components.json if needed | | |
| TASK-081 | Run bundle size analysis and optimization | | |
| TASK-082 | Update ESLint rules for Joy UI patterns | | |
| TASK-083 | Update Prettier config if needed | | |

### Phase 10: Testing & Documentation

**GOAL-011**: Comprehensive testing, accessibility audit, migration guide completion

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-084 | Run full test suite (unit, integration, E2E) | | |
| TASK-085 | Perform accessibility audit with axe-core | | |
| TASK-086 | Test keyboard navigation across all components | | |
| TASK-087 | Test screen reader compatibility | | |
| TASK-088 | Visual regression testing with Playwright | | |
| TASK-089 | Cross-browser testing (Chrome, Firefox, Safari, Edge) | | |
| TASK-090 | Mobile responsive testing | | |
| TASK-091 | Performance testing and Core Web Vitals check | | |
| TASK-092 | Create comprehensive migration guide for team | | |
| TASK-093 | Update all component documentation | | |
| TASK-094 | Document troubleshooting and common issues | | |

## 3. Alternatives

- **ALT-001**: **Continue with Shadcn/UI + Tailwind** - Maintain current stack with targeted fixes to global.css and CSS optimization. *Rejected*: Doesn't address fundamental issues with CSS complexity, bundle size growth, and long-term maintenance burden.

- **ALT-002**: **Migrate to traditional Material UI (MUI Core)** - Replace with full Material Design implementation using @mui/material. *Rejected*: Material Design aesthetic may not align with current design language; Joy UI provides more modern, flexible approach with better customization.

- **ALT-003**: **Build custom component library** - Create bespoke components without external dependencies. *Rejected*: High development cost, ongoing maintenance burden, missing out on mature ecosystem benefits, accessibility features, and community support.

- **ALT-004**: **Migrate to Mantine UI** - Alternative modern React component library with built-in theming. *Rejected*: Smaller ecosystem and community compared to MUI; less comprehensive component coverage; less enterprise adoption.

- **ALT-005**: **Migrate to Ant Design** - Comprehensive design system with extensive components. *Rejected*: Opinionated design language may clash with requirements; larger bundle size; different theming approach.

- **ALT-006**: **Keep Tailwind, replace only Shadcn** - Maintain Tailwind CSS while replacing Shadcn components with headless UI libraries. *Rejected*: Doesn't solve the core CSS complexity issues; Tailwind + component library integration often causes conflicts.

- **ALT-007**: **Hybrid approach** - Keep some Shadcn components while migrating others to Joy UI. *Rejected*: Maintaining two component libraries increases complexity, bundle size, and developer confusion; inconsistent theming.

- **ALT-008**: **CSS Modules + headless components** - Use CSS Modules with Radix UI or similar headless components. *Rejected*: Doesn't provide comprehensive design system; more manual styling work required; missing Joy UI's variant system benefits.

## 4. Dependencies

- **DEP-001**: **@mui/joy@^5.0.0-beta.52** - Core MUI Joy UI component library
- **DEP-002**: **@emotion/react@^11.14.0** - Already installed, required for Joy UI styling
- **DEP-003**: **@emotion/styled@^11.14.1** - Already installed, required for Joy UI styling
- **DEP-004**: **@mui/material** (icons only) - For Material Icons if needed, or migrate to Lucide
- **DEP-005**: React 19.2.0+ (already satisfied)
- **DEP-006**: TypeScript 5.9.3+ (already satisfied)

**Packages to Remove:**

- tailwindcss
- @tailwindcss/forms
- @tailwindcss/typography
- @tailwindcss/postcss
- tailwind-merge
- tw-animate-css
- Most @radix-ui/* packages (some may be retained if Joy UI uses them internally)

**Packages to Retain:**

- lucide-react (icons)
- framer-motion (animations)
- react-hook-form (form management)
- zod (validation)
- next-themes (may need adaptation for Joy theming)
- clsx (general className utility)

## 5. Files

### Core Configuration Files

- **FILE-001**: `lib/theme/joy-theme.ts` - New Joy UI theme configuration
- **FILE-002**: `app/layout.tsx` - Root layout with CssVarsProvider integration
- **FILE-003**: `components/ThemeProvider.tsx` - Updated theme provider wrapper
- **FILE-004**: `tailwind.config.js` - To be deleted
- **FILE-005**: `postcss.config.js` - To be updated (remove Tailwind)
- **FILE-006**: `app/global.css` - Major refactor to remove Tailwind utilities

### Component Migration (48 files estimated)

- **FILE-007**: `components/ui/*.tsx` - All 48 Shadcn component files to be replaced
- **FILE-008**: `components/*.tsx` - 15+ app-level components using Shadcn
- **FILE-009**: `app/**/*.tsx` - Page components using Shadcn
- **FILE-010**: `cedar/*.tsx` - Cedar components if using Shadcn

### Documentation Files

- **FILE-011**: `docs/migration-guide.md` - New comprehensive migration guide
- **FILE-012**: `README.md` - Update setup instructions
- **FILE-013**: `AGENTS.md` files - Update component technology references

### Test Files

- **FILE-014**: `tests/components/*.test.tsx` - Update component tests
- **FILE-015**: `vitest.config.ts` - May need adjustments for Joy UI

## 6. Testing

- **TEST-001**: **Unit Tests** - All existing component unit tests must pass with Joy UI components
- **TEST-002**: **Integration Tests** - Form flows, navigation, and user interactions must work correctly
- **TEST-003**: **Visual Regression** - Playwright screenshots to catch visual changes
- **TEST-004**: **Accessibility Tests** - Automated axe-core checks, manual screen reader testing, keyboard navigation
- **TEST-005**: **Bundle Size Tests** - Compare before/after bundle sizes, ensure <10% increase
- **TEST-006**: **Performance Tests** - Lighthouse CI, Core Web Vitals, Time to Interactive
- **TEST-007**: **Cross-browser Tests** - Chrome, Firefox, Safari, Edge compatibility
- **TEST-008**: **Responsive Tests** - Mobile, tablet, desktop breakpoints
- **TEST-009**: **Theme Toggle Tests** - Dark/light mode switching works correctly
- **TEST-010**: **Form Validation** - react-hook-form integration with Joy components

## 7. Risks & Assumptions

- **RISK-001**: **MUI Joy is in beta** - Potential breaking changes in future releases. *Mitigation*: Lock Joy version, monitor changelog, maintain migration capability.

- **RISK-002**: **Learning curve** - Team unfamiliar with Joy UI patterns. *Mitigation*: Comprehensive documentation, pair programming, code reviews.

- **RISK-003**: **Bundle size increase** - Joy UI may be larger than Shadcn/Tailwind. *Mitigation*: Use tree-shaking, monitor bundle size, lazy load components.

- **RISK-004**: **Component API mismatches** - Not all Shadcn props have Joy equivalents. *Mitigation*: Create wrapper components, document breaking changes.

- **RISK-005**: **Migration timeline overrun** - Complexity may exceed estimates. *Mitigation*: Phased approach allows early value delivery, parallel work tracks.

- **RISK-006**: **Regression in accessibility** - New components may have different a11y implementations. *Mitigation*: Comprehensive accessibility testing at each phase.

- **RISK-007**: **Performance degradation** - Joy UI may have different performance characteristics. *Mitigation*: Performance testing at each phase, profiling, optimization.

- **RISK-008**: **Design consistency issues** - Joy UI defaults may not match current design. *Mitigation*: Comprehensive theme customization upfront.

- **ASSUMPTION-001**: Team has capacity for 8-12 weeks of migration work
- **ASSUMPTION-002**: Production deployments can continue during migration
- **ASSUMPTION-003**: Joy UI will provide necessary flexibility for custom designs
- **ASSUMPTION-004**: Bundle size will ultimately decrease after Tailwind removal
- **ASSUMPTION-005**: MUI will continue to support and develop Joy UI
- **ASSUMPTION-006**: Current design language can be replicated with Joy theming
- **ASSUMPTION-007**: No major feature development conflicting with migration timeline

## 8. Related Specifications / Further Reading

- [ADR-0001: Migrate Frontend from Shadcn/UI + Tailwind to MUI Joy](/home/sam/mastra-governed-rag/docs/adr/adr-0001-migrate-shadcn-tailwind-to-mui-joy.md)
- [MUI Joy UI Documentation](https://mui.com/joy-ui/getting-started/)
- [Joy UI Theme Customization](https://mui.com/joy-ui/customization/theme-tokens/)
- [Joy UI Global Variants](https://mui.com/joy-ui/main-features/global-variants/)
- [MUI Joy Migration Guide](https://mui.com/joy-ui/migration/migrating-default-theme/)
- [Emotion Documentation](https://emotion.sh/docs/introduction)
- [Next.js with MUI Joy](https://mui.com/joy-ui/integrations/next-js-app-router/)
