# Design Document

## Overview

This design document outlines the technical approach for migrating the Mastra Governed RAG project from Tailwind CSS v3 to v4. The migration involves transitioning from JavaScript-based configuration to CSS-first configuration, updating import syntax, and leveraging advanced Tailwind v4 features while preserving all existing functionality.

The project currently uses Tailwind CSS v4.1.13 (already updated) with traditional v3 patterns including `@tailwind` directives and CSS custom properties for theming. The migration will modernize the styling system to use Tailwind v4's native features including `@theme`, `@utility`, and `@variant` directives.

## Architecture

### Current Architecture

- **Styling System**: Tailwind CSS v4.1.13 with v3 patterns
- **Configuration**: CSS-based using `@tailwind` directives and CSS custom properties
- **Build System**: Next.js 15.5.3 with built-in CSS processing
- **Theme System**: CSS custom properties in `:root` and `.dark` selectors
- **Components**: React components using Tailwind utility classes
- **Custom Utilities**: Defined in `@layer utilities` with CSS custom properties

### Target Architecture

- **Styling System**: Tailwind CSS v4 with native CSS-first configuration
- **Configuration**: `@theme` directive with CSS custom properties
- **Build System**: Next.js with Tailwind v4's improved compilation pipeline
- **Theme System**: Enhanced theme configuration with fluid scaling and modern CSS features
- **Components**: Enhanced with advanced Tailwind v4 utilities and container queries
- **Custom Utilities**: Migrated to `@utility` directive with semantic naming

### Migration Strategy

1. **Phase 1**: Update import syntax and basic configuration
2. **Phase 2**: Migrate theme configuration to `@theme` directive
3. **Phase 3**: Enhance with advanced Tailwind v4 features
4. **Phase 4**: Implement modern CSS techniques and optimizations

## Components and Interfaces

### Configuration Migration

#### Current CSS Structure (`app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    :root {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;
        /* ... other CSS custom properties */
    }
}

@layer utilities {
    .animate-pulse-slow {
        /* ... */
    }
    .gradient-border {
        /* ... */
    }
    .glass-effect {
        /* ... */
    }
    /* ... other custom utilities */
}
```

#### Target CSS Structure

```css
@import 'tailwindcss';

@theme {
    --color-background: 0 0% 100%;
    --color-foreground: 222.2 84% 4.9%;
    --color-primary: 222.2 47.4% 11.2%;

    /* Fluid spacing system */
    --spacing-xs: clamp(0.25rem, 0.5vw, 0.5rem);
    --spacing-sm: clamp(0.5rem, 1vw, 1rem);
    --spacing-md: clamp(1rem, 2vw, 2rem);

    /* Fluid typography */
    --font-size-xs: clamp(0.75rem, 0.8rem + 0.2vw, 0.875rem);
    --font-size-sm: clamp(0.875rem, 0.9rem + 0.3vw, 1rem);
    --font-size-base: clamp(1rem, 1rem + 0.4vw, 1.125rem);

    /* Animation tokens */
    --animation-duration-fast: 150ms;
    --animation-duration-normal: 300ms;
    --animation-duration-slow: 500ms;

    /* Modern color spaces */
    --color-accent-oklch: oklch(0.7 0.15 200);
    --color-primary-p3: color(display-p3 0.2 0.4 0.8);
}

@utility pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@utility gradient-border {
    background: linear-gradient(
        to right,
        theme(colors.blue.500),
        theme(colors.purple.500),
        theme(colors.pink.500)
    );
    padding: 1px;
}

@utility glass-effect {
    background: color-mix(in srgb, theme(colors.gray.900) 70%, transparent);
    backdrop-filter: blur(10px);
    border: 1px solid color-mix(in srgb, theme(colors.white) 10%, transparent);
}

@variant has-focus (&:has(:focus)) {
    /* Custom variant for parent styling when child is focused */
}
```

### Component Enhancement Strategy

#### Security Badge Components

Current implementation uses CSS classes with `@apply`:

```css
.security-badge-public {
    @apply bg-green-500/10 text-green-400 border-green-500/20;
}
```

Enhanced implementation with semantic utilities:

```css
@utility security-badge {
    @apply inline-flex items-center px-2 py-1 rounded-full border text-xs font-medium;
}

@utility security-badge-public {
    @apply security-badge bg-green-500/10 text-green-400 border-green-500/20;
}

@utility security-badge-internal {
    @apply security-badge bg-yellow-500/10 text-yellow-400 border-yellow-500/20;
}

@utility security-badge-confidential {
    @apply security-badge bg-red-500/10 text-red-400 border-red-500/20;
}
```

#### Glass Effect Enhancement

Enhanced with modern CSS features:

```css
@utility glass-effect-enhanced {
    background: color-mix(in oklch, theme(colors.gray.900) 70%, transparent);
    backdrop-filter: blur(clamp(8px, 1vw, 16px));
    border: 1px solid color-mix(in oklch, theme(colors.white) 8%, transparent);
    box-shadow:
        0 4px 6px -1px color-mix(in srgb, theme(colors.black) 10%, transparent),
        0 2px 4px -1px color-mix(in srgb, theme(colors.black) 6%, transparent),
        inset 0 1px 0 color-mix(in srgb, theme(colors.white) 5%, transparent);
}
```

### Responsive Design Enhancement

#### Container Queries Implementation

```css
@utility chat-container {
    container-type: inline-size;
    container-name: chat;
}

@utility chat-message {
    @apply p-4 rounded-lg;

    @container chat (min-width: 400px) {
        @apply p-6;
    }

    @container chat (min-width: 600px) {
        @apply p-8 text-lg;
    }
}
```

#### Advanced Grid Layouts

```css
@utility responsive-grid {
    display: grid;
    grid-template-columns: repeat(
        auto-fit,
        minmax(clamp(250px, 30vw, 350px), 1fr)
    );
    gap: clamp(1rem, 3vw, 2rem);
}
```

## Data Models

### Theme Configuration Schema

```typescript
interface ThemeConfig {
    colors: {
        primary: ColorScale
        secondary: ColorScale
        accent: ColorScale
        semantic: {
            success: ColorScale
            warning: ColorScale
            error: ColorScale
        }
    }
    spacing: FluidSpacingScale
    typography: FluidTypographyScale
    animations: AnimationTokens
    shadows: LayeredShadowSystem
}

interface ColorScale {
    50: string
    100: string
    // ... standard scale
    900: string
    950: string
}

interface FluidSpacingScale {
    xs: string // clamp() function
    sm: string
    md: string
    lg: string
    xl: string
}
```

### Component Styling Patterns

```typescript
interface ComponentStyleConfig {
    base: string // Base utility classes
    variants: {
        [key: string]: string // Variant-specific classes
    }
    sizes: {
        [key: string]: string // Size-specific classes
    }
    states: {
        [key: string]: string // State-specific classes
    }
}
```

## Error Handling

### Migration Error Prevention

1. **Gradual Migration**: Implement changes incrementally to catch issues early
2. **Fallback Strategies**: Maintain compatibility during transition
3. **Validation**: Verify CSS compilation at each step
4. **Testing**: Visual regression testing for all components

### Build Error Handling

```javascript
// next.config.js enhancement for Tailwind v4
const nextConfig = {
    experimental: {
        optimizeCss: true, // Enable CSS optimization
    },
    webpack: (config) => {
        // Ensure proper CSS processing
        config.module.rules.push({
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
        })
        return config
    },
}
```

### Runtime Error Handling

- **CSS Loading**: Graceful degradation if advanced CSS features aren't supported
- **Container Queries**: Fallback to media queries for older browsers
- **Color Functions**: Fallback colors for unsupported color spaces

## Testing Strategy

### Visual Regression Testing

1. **Component Screenshots**: Before/after comparison for all components
2. **Responsive Testing**: Verify layouts at all breakpoints
3. **Theme Testing**: Verify light/dark mode functionality
4. **Interactive Testing**: Verify hover, focus, and active states

### Browser Compatibility Testing

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Container Queries**: Chrome 105+, Firefox 110+, Safari 16+
- **Color Functions**: Chrome 111+, Firefox 113+, Safari 16.4+

### Performance Testing

1. **Bundle Size**: Compare CSS bundle sizes before/after
2. **Load Times**: Measure CSS loading performance
3. **Runtime Performance**: Verify no performance regressions
4. **Build Times**: Compare compilation times

### Automated Testing

```javascript
// Example test for theme configuration
describe('Tailwind v4 Migration', () => {
    test('should preserve all existing utility classes', () => {
        const existingClasses = [
            'glass-effect',
            'security-badge-public',
            'security-badge-internal',
            'security-badge-confidential',
            'animate-pulse-slow',
            'gradient-border',
        ]

        existingClasses.forEach((className) => {
            expect(document.querySelector(`.${className}`)).toBeTruthy()
        })
    })

    test('should support new Tailwind v4 features', () => {
        const newFeatures = [
            'container queries',
            'color-mix functions',
            'fluid typography',
            'advanced animations',
        ]

        // Test implementation of new features
    })
})
```

## Implementation Phases

### Phase 1: Basic Migration (Requirements 1-6)

- Update import syntax from `@tailwind` to `@import "tailwindcss"`
- Migrate theme configuration to `@theme` directive
- Preserve all existing functionality
- Verify build process works correctly

### Phase 2: Advanced Features (Requirements 7-8)

- Implement fluid typography and spacing
- Add container query support
- Enhance color system with modern CSS functions
- Create semantic utility classes

### Phase 3: Optimization and Enhancement

- Implement advanced animations and interactions
- Add performance optimizations
- Enhance accessibility features
- Create comprehensive documentation

### Phase 4: Validation and Testing (Requirement 9)

- Comprehensive visual regression testing
- Performance benchmarking
- Browser compatibility verification
- Documentation and training materials

## Security Considerations

### CSS Security

- **Content Security Policy**: Ensure inline styles are properly handled
- **CSS Injection**: Validate any dynamic CSS generation
- **Asset Integrity**: Verify CSS file integrity in production

### Performance Security

- **Bundle Analysis**: Monitor for unexpected CSS bloat
- **Resource Loading**: Ensure efficient CSS loading strategies
- **Caching**: Implement proper CSS caching strategies

## Deployment Strategy

### Development Environment

1. Local development with hot reloading
2. CSS source maps for debugging
3. Development-specific optimizations

### Production Environment

1. CSS minification and optimization
2. Critical CSS extraction
3. Progressive enhancement for advanced features

### Rollback Plan

1. Maintain backup of current configuration
2. Feature flags for new CSS features
3. Gradual rollout strategy
4. Monitoring and alerting for CSS-related issues
