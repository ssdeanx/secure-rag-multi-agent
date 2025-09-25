---
title: Public Frontend Design and Implementation Specification
version: 1.0.0
date_created: 2025-09-25
last_updated: 2025-09-25
owner: Frontend Development Team
tags: design, frontend, ui, user-experience, production-ready, tailwind-v4, mdx, docs
---

# Introduction

This specification defines the requirements, constraints, and implementation guidelines for completing the public frontend of the Mastra Governed RAG application. The frontend must provide a production-grade user experience with consistent styling, responsive design, accessibility compliance, and seamless integration with the existing Next.js architecture.

## 1. Purpose & Scope

This specification covers the design and implementation of all public-facing pages and components in the Next.js application, ensuring a cohesive, professional, and performant user interface. The scope includes:

- Landing page completion (Hero section)
- Static content pages (About, Blog, Contact)
- Authentication flow (Login/Signup)
- Documentation system (MDX-based docs)
- Navigation and layout consistency
- Responsive design across all devices
- Accessibility compliance (WCAG 2.1 AA)
- Performance optimization
- Theme consistency (light/dark mode)

The specification focuses on frontend presentation layer only, excluding API integrations and backend functionality.

## 2. Definitions

- **UI Primitives**: Reusable components in `components/ui/` (Radix UI based)
- **Landing Components**: High-level page sections in `components/landing/`
- **Brutalist Design**: The application's signature aesthetic with neon glows, gradients, and bold typography
- **Responsive Breakpoints**: Mobile (< 640px), Tablet (640px - 1024px), Desktop (> 1024px)
- **Theme System**: CSS custom properties supporting light/dark mode switching
- **Tailwind CSS v4**: Modern utility-first CSS framework with CSS custom properties and advanced features
- **MDX**: Markdown with JSX support for rich documentation content
- **Documentation System**: MDX-based docs with dynamic routing and component integration

## 3. Requirements, Constraints & Guidelines

### Technology Stack Constraints

- **TEC-001**: Must use Tailwind CSS v4.1.13 with CSS custom properties for theming
- **TEC-002**: All styling must leverage Tailwind's utility classes and custom properties
- **TEC-003**: CSS custom properties must be defined in `:root` and `.dark` selectors
- **TEC-004**: No hardcoded color values - all colors must use CSS custom properties
- **TEC-005**: Utilize Tailwind's new features like `tw-animate-css` integration
- **TEC-006**: MDX compilation using `next-mdx-remote/rsc` with custom plugins
- **TEC-007**: Documentation pages must support dynamic routing with `generateStaticParams`

### Content Management Requirements

- **CON-001**: Blog posts must use MDX format with frontmatter metadata
- **CON-002**: Documentation must support component imports and interactive elements
- **CON-003**: Content must be statically generated for optimal performance
- **CON-004**: MDX files must support table of contents generation
- **CON-005**: Documentation must include syntax highlighting for code blocks

### Design System Requirements

- **DES-001**: All UI components must use primitives from `components/ui/` directory
- **DES-002**: Maintain brutalist aesthetic with neon glow effects and gradient backgrounds
- **DES-003**: Implement consistent spacing using Tailwind's spacing scale (4px increments)
- **DES-004**: Use CSS custom properties for theming, no hardcoded colors
- **DES-005**: Ensure 4:1 contrast ratio minimum for text accessibility

### Layout & Navigation Requirements

- **LAY-001**: Sticky navigation header with backdrop blur effect
- **LAY-002**: Maximum content width of 7xl (1280px) with auto margins
- **LAY-003**: Consistent padding: 4 (16px) on mobile, 6 (24px) on tablet+, 8 (32px) on desktop
- **LAY-004**: Footer component with links and branding (to be implemented)
- **LAY-005**: Breadcrumb navigation for multi-level pages
- **LAY-006**: Documentation sidebar with table of contents
- **LAY-007**: Blog listing with pagination and category filtering

### Page-Specific Requirements

- **PAG-001**: Home page must include Hero, InteractiveFeatures, NewsletterForm, and CTA sections
- **PAG-002**: About page must showcase company mission, team, and technology stack
- **PAG-003**: Blog page must display article previews with pagination using MDX content
- **PAG-004**: Contact page must include contact form and company information
- **PAG-005**: Login page must support both authentication modes (login/signup)
- **PAG-006**: Documentation pages must render MDX content with interactive components
- **PAG-007**: Blog posts must support MDX rendering with frontmatter metadata

### Responsive Design Requirements

- **RES-001**: Mobile-first approach with progressive enhancement
- **RES-002**: Flexible grid layouts using CSS Grid and Flexbox
- **RES-003**: Touch-friendly interactive elements (minimum 44px touch targets)
- **RES-004**: Optimized typography scaling across breakpoints
- **RES-005**: Image optimization with responsive srcsets

### Animation & Interaction Requirements

- **ANI-001**: Use Framer Motion for all animations with reduced motion support
- **ANI-002**: Page transitions with fade and slide effects
- **ANI-003**: Hover states with lift and glow effects (defined in global.css)
- **ANI-004**: Loading states for all async operations
- **ANI-005**: Micro-interactions for form validation feedback

### Performance Requirements

- **PER-001**: First Contentful Paint < 1.5 seconds
- **PER-002**: Largest Contentful Paint < 2.5 seconds
- **PER-003**: Cumulative Layout Shift < 0.1
- **PER-004**: Bundle size < 500KB for initial load
- **PER-005**: 90+ Lighthouse performance score
- **PER-006**: MDX compilation must be statically cached
- **PER-007**: Documentation pages must support ISR (Incremental Static Regeneration)

### Accessibility Requirements

- **ACC-001**: WCAG 2.1 AA compliance for all interactive elements
- **ACC-002**: Keyboard navigation support for all functionality
- **ACC-003**: Screen reader compatibility with proper ARIA labels
- **ACC-004**: Focus management for modals and forms
- **ACC-005**: Color-independent design (no color-only information conveyance)
- **ACC-006**: Skip links for documentation navigation
- **ACC-007**: Semantic HTML structure for content hierarchy

### Browser Support Requirements

- **BRS-001**: Modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **BRS-002**: Mobile browsers: iOS Safari 14+, Chrome Mobile 90+
- **BRS-003**: Graceful degradation for older browsers
- **BRS-004**: Progressive enhancement for modern features

## 4. Interfaces & Data Contracts

### Component Props Interfaces

```typescript
// Hero component props
interface HeroProps {
  title: string;
  subtitle: string;
  ctaPrimary: {
    text: string;
    href: string;
  };
  ctaSecondary?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
}

// Navigation link structure
interface NavLink {
  href: string;
  label: string;
  external?: boolean;
  requiresAuth?: boolean;
}

// Form validation interface
interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ZodSchema;
}

// MDX frontmatter interface
interface MDXFrontmatter {
  title: string;
  description?: string;
  date?: string;
  author?: string;
  tags?: string[];
  category?: string;
  published?: boolean;
}

// Blog post interface
interface BlogPost {
  slug: string;
  frontmatter: MDXFrontmatter;
  content: ReactElement;
  readingTime?: number;
}
```

### Theme Configuration

```typescript
interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
  };
}
```

### MDX Compilation Configuration

```typescript
interface MDXConfig {
  components: Record<string, ComponentType>;
  options: {
    parseFrontmatter: boolean;
    mdxOptions: {
      remarkPlugins: Array<Plugin>;
      rehypePlugins: Array<Plugin>;
    };
  };
}
```

## 5. Acceptance Criteria

### Functional Acceptance Criteria

- **AC-001**: Given a user visits the home page, When the page loads, Then all sections (Hero, Features, Newsletter, CTA) render correctly
- **AC-002**: Given a user on mobile device, When navigating the site, Then all content is readable and interactive elements are accessible
- **AC-003**: Given a user with reduced motion preference, When interacting with animated elements, Then animations are disabled or simplified
- **AC-004**: Given a user using keyboard navigation, When tabbing through the page, Then focus indicators are visible and logical
- **AC-005**: Given a user in dark mode, When switching themes, Then all components adapt their colors appropriately
- **AC-006**: Given a user visits a documentation page, When the MDX content loads, Then all components render correctly and syntax highlighting works
- **AC-007**: Given a user visits the blog, When browsing posts, Then MDX content renders with proper frontmatter and pagination works

### Performance Acceptance Criteria

- **AC-008**: Given a user on 3G connection, When loading the home page, Then time to interactive is under 5 seconds
- **AC-009**: Given Lighthouse audit runs, When analyzing the site, Then performance score is 90+ and accessibility score is 95+
- **AC-010**: Given a user resizes the browser, When viewport changes, Then layout adapts smoothly without horizontal scroll
- **AC-011**: Given images are present, When loading on slow connection, Then appropriate placeholders are shown
- **AC-012**: Given MDX pages are cached, When revisiting documentation, Then pages load instantly from static generation

### Design Acceptance Criteria

- **AC-013**: Given the design system, When implementing new components, Then they match the brutalist aesthetic with neon effects
- **AC-014**: Given form elements, When focused, Then they display the primary color outline with glow effect
- **AC-015**: Given buttons, When hovered, Then they lift and glow according to the hover-lift class
- **AC-016**: Given the navigation, When active page is current, Then it shows primary color background with 5% opacity
- **AC-017**: Given MDX content, When rendered, Then it maintains design consistency with the rest of the site

## 6. Test Automation Strategy

### Testing Frameworks

- **TST-001**: Vitest for unit testing React components
- **TST-002**: React Testing Library for component behavior testing
- **TST-003**: Playwright for end-to-end user journey testing
- **TST-004**: Lighthouse CI for performance regression testing
- **TST-005**: MDX compilation tests to ensure content renders correctly

### Test Coverage Requirements

- **TST-006**: Component unit tests: 80% coverage minimum
- **TST-007**: Integration tests for page layouts: 100% coverage
- **TST-008**: E2E tests for critical user journeys: Login, Navigation, Form submission, Documentation browsing
- **TST-009**: Accessibility tests using axe-core integration
- **TST-010**: Visual regression tests for key components
- **TST-011**: MDX rendering tests for documentation and blog content

### Test Data Management

- **TST-012**: Mock data for component testing using fixtures
- **TST-013**: Test utilities for theme and responsive testing
- **TST-014**: Performance budgets defined in Lighthouse configuration
- **TST-015**: Sample MDX files for testing content rendering

## 7. Rationale & Context

The brutalist design aesthetic was chosen to differentiate the product in the enterprise AI space, creating a memorable and distinctive brand identity. The neon glow effects and gradient backgrounds provide visual interest while maintaining professional appearance.

Next.js 15 with React 19 was selected for its performance optimizations and modern React features. Tailwind CSS v4 provides efficient styling with CSS custom properties for theming. Radix UI primitives ensure accessibility and consistent behavior across components.

MDX was chosen for documentation and blog content to allow rich formatting while maintaining the developer-friendly Markdown syntax. The dynamic routing system enables scalable content management without rebuilding the entire application.

The mobile-first responsive approach ensures the application works well on all devices, which is critical for enterprise users who may access the system from various environments.

## 8. Dependencies & External Integrations

### UI Component Libraries

- **LIB-001**: Radix UI - Headless UI components for accessibility
- **LIB-002**: Tailwind CSS v4.1.13 - Utility-first CSS framework
- **LIB-003**: Framer Motion - Animation library with React integration
- **LIB-004**: Lucide React - Icon library for consistent iconography
- **LIB-005**: next-mdx-remote - MDX compilation for Next.js
- **LIB-006**: remark/rehype plugins - MDX processing and enhancement

### Design System Dependencies

- **DSN-001**: CSS Custom Properties - Theme variable system
- **DSN-002**: Tailwind Configuration - Design token definitions
- **DSN-003**: Global CSS - Base styles and utility classes
- **DSN-004**: MDX Components - Reusable components for documentation

### Development Tooling

- **DEV-001**: TypeScript - Type safety for component props
- **DEV-002**: ESLint - Code quality and consistency
- **DEV-003**: Prettier - Code formatting
- **DEV-004**: Next.js - React framework with optimization features
- **DEV-005**: MDX plugins - Content processing and enhancement

### Content Management

- **CON-001**: MDX files in `/docs/` directory - Documentation content
- **CON-002**: MDX files in `/blog/` directory - Blog post content
- **CON-003**: Frontmatter parsing - Metadata extraction from MDX
- **CON-004**: Static generation - Pre-compiled content for performance

## 9. Examples & Edge Cases

### MDX Content Structure

```mdx
---
title: "Getting Started with Governed RAG"
description: "Learn how to set up and configure your secure AI system"
date: "2025-09-25"
author: "Frontend Team"
tags: ["setup", "configuration", "security"]
category: "documentation"
published: true
---

import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

# Getting Started

<Alert>
  <AlertDescription>
    This guide assumes you have Node.js 20.9.0+ installed.
  </AlertDescription>
</Alert>

## Installation

```bash
npm install
```

## Configuration

Edit your `.env` file:

```env
OPENAI_API_KEY=your_key_here
QDRANT_URL=http://localhost:6333
```

<Badge variant="secondary">Important</Badge> Never commit your `.env` file.

### Responsive Breakpoint Examples

```typescript
// Mobile-first breakpoint classes
const responsiveClasses = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8',
  text: 'text-sm sm:text-base lg:text-lg',
  docsSidebar: 'hidden lg:block lg:w-64 lg:pr-8',
  docsContent: 'lg:pl-8',
};
```

### Theme-Aware Component Example

```tsx
import { cn } from '@/lib/utils';

interface ThemedButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function ThemedButton({ variant = 'primary', children }: ThemedButtonProps) {
  return (
    <button
      className={cn(
        'btn',
        variant === 'primary' && 'btn-primary',
        variant === 'secondary' && 'btn-ghost',
        'hover-lift hover-glow'
      )}
    >
      {children}
    </button>
  );
}
```

### MDX Component Integration

```tsx
// In MDX file
import { InteractiveFeatures } from '@/components/landing/InteractiveFeatures'

<InteractiveFeatures />

// Component renders within documentation
```

## 10. Validation Criteria

### Code Quality Validation

- **VAL-001**: ESLint passes with zero errors
- **VAL-002**: TypeScript strict mode compliance
- **VAL-003**: All components have proper TypeScript interfaces
- **VAL-004**: CSS custom properties used instead of hardcoded values
- **VAL-005**: MDX files follow consistent frontmatter structure

### Design System Validation

- **VAL-006**: All colors defined as CSS custom properties
- **VAL-007**: Spacing uses Tailwind scale consistently
- **VAL-008**: Typography follows defined scale
- **VAL-009**: Component variants use class-variance-authority
- **VAL-010**: MDX components maintain design consistency

### Performance Validation

- **VAL-011**: Bundle analyzer shows < 500KB initial load
- **VAL-012**: Core Web Vitals metrics within acceptable ranges
- **VAL-013**: No unused CSS classes in production build
- **VAL-014**: MDX compilation is statically cached
- **VAL-015**: Documentation pages load < 1 second

### Accessibility Validation

- **VAL-016**: axe-core audit passes with zero violations
- **VAL-017**: Keyboard navigation works for all interactive elements
- **VAL-018**: Screen reader testing passes on major screen readers
- **VAL-019**: MDX content has proper heading hierarchy
- **VAL-020**: Skip links implemented for documentation navigation

### Content Validation

- **VAL-021**: All MDX files have required frontmatter
- **VAL-022**: Documentation links are valid and functional
- **VAL-023**: Blog posts have proper metadata
- **VAL-024**: Table of contents generated for long content
- **VAL-025**: Syntax highlighting works for all code blocks

## 11. Related Specifications / Further Reading

- [Mastra Governed RAG Architecture Specification](spec-architecture-cedar-mastra-integration.md)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/v4-beta)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [MDX Documentation](https://mdxjs.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)