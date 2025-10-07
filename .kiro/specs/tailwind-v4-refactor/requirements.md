# Requirements Document

## Introduction

This specification outlines the requirements for refactoring the existing Mastra Governed RAG project to use Tailwind CSS v4. The project currently uses Tailwind CSS v3 with a JavaScript configuration file and PostCSS setup. Tailwind v4 introduces significant architectural changes including CSS-first configuration, new import syntax, and updated build integrations that require careful migration.

## Requirements

### Requirement 1: Update Tailwind CSS Dependencies

**User Story:** As a developer, I want to upgrade to Tailwind CSS v4 so that I can benefit from improved performance, modern CSS features, and the new CSS-first configuration approach.

#### Acceptance Criteria

1. WHEN upgrading dependencies THEN the project SHALL use `tailwindcss@^4.1.11` instead of the current v3 version
2. WHEN updating package.json THEN the project SHALL remove `autoprefixer` and `postcss` dependencies as they are no longer required
3. WHEN updating dependencies THEN the project SHALL add any new v4-specific packages if needed
4. WHEN dependencies are updated THEN all existing functionality SHALL continue to work without breaking changes

### Requirement 2: Migrate Configuration from JavaScript to CSS

**User Story:** As a developer, I want to use CSS-first configuration so that I can define my design system directly in CSS using modern CSS features and have better integration with the compilation pipeline.

#### Acceptance Criteria

1. WHEN migrating configuration THEN the existing `tailwind.config.js` file SHALL be removed
2. WHEN migrating configuration THEN the existing `postcss.config.js` file SHALL be removed
3. WHEN creating CSS configuration THEN a `@theme` block SHALL be added to `app/globals.css`
4. WHEN defining theme values THEN CSS custom properties SHALL be used instead of JavaScript objects
5. WHEN migrating colors THEN existing color values SHALL be preserved using CSS variable syntax
6. WHEN migrating spacing THEN existing spacing values SHALL be preserved using CSS variable syntax
7. WHEN migrating typography THEN existing font configurations SHALL be preserved using CSS variable syntax
8. WHEN configuration is complete THEN all existing design tokens SHALL be accessible in the same way

### Requirement 3: Update CSS Import Syntax

**User Story:** As a developer, I want to use the new v4 import syntax so that I can take advantage of the improved compilation pipeline and CSS-first approach.

#### Acceptance Criteria

1. WHEN updating imports THEN the existing `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;` directives SHALL be replaced
2. WHEN updating imports THEN a single `@import "tailwindcss";` statement SHALL be used instead
3. WHEN updating imports THEN the import SHALL be placed at the top of `app/globals.css`
4. WHEN imports are updated THEN all existing Tailwind utilities SHALL continue to work
5. WHEN imports are updated THEN custom CSS SHALL be preserved and continue to function

### Requirement 4: Preserve Existing Styling and Functionality

**User Story:** As a developer, I want all existing UI components and styling to work exactly the same after the migration so that no visual regressions are introduced.

#### Acceptance Criteria

1. WHEN migration is complete THEN all existing React components SHALL render with identical styling
2. WHEN migration is complete THEN all existing utility classes SHALL continue to work
3. WHEN migration is complete THEN all existing custom CSS SHALL continue to work
4. WHEN migration is complete THEN responsive design SHALL work identically
5. WHEN migration is complete THEN dark mode functionality SHALL work identically
6. WHEN migration is complete THEN all existing animations and transitions SHALL work identically
7. WHEN testing is performed THEN no visual differences SHALL be detectable in the UI

### Requirement 5: Update Build Configuration

**User Story:** As a developer, I want the build process to work seamlessly with Tailwind v4 so that development and production builds continue to work efficiently.

#### Acceptance Criteria

1. WHEN updating build configuration THEN Next.js SHALL be configured to work with Tailwind v4
2. WHEN running development mode THEN hot reloading SHALL work correctly with CSS changes
3. WHEN running production builds THEN CSS SHALL be optimized and minified correctly
4. WHEN building for production THEN unused CSS SHALL be purged correctly
5. WHEN build is complete THEN bundle sizes SHALL be comparable or smaller than before
6. WHEN build configuration is updated THEN no build errors SHALL occur

### Requirement 6: Maintain Development Experience

**User Story:** As a developer, I want the development experience to remain smooth and efficient so that productivity is maintained or improved during development.

#### Acceptance Criteria

1. WHEN developing locally THEN CSS changes SHALL be reflected immediately in the browser
2. WHEN using development tools THEN CSS debugging SHALL work correctly
3. WHEN writing new styles THEN IntelliSense and autocomplete SHALL work for Tailwind classes
4. WHEN using the browser inspector THEN generated CSS SHALL be readable and debuggable
5. WHEN making changes THEN build times SHALL be comparable or faster than before

### Requirement 7: Implement Advanced Tailwind v4 Features and Modern Techniques

**User Story:** As a developer, I want to leverage advanced Tailwind CSS v4 features and cutting-edge 2025 techniques so that the application uses the most modern and efficient styling approaches available.

#### Acceptance Criteria

1. WHEN implementing text effects THEN new `text-shadow-*` utilities (2xs, xs, sm, md, lg) SHALL be used for enhanced typography
2. WHEN implementing visual effects THEN new `mask-*` utilities SHALL be used for image masking and gradient effects
3. WHEN implementing responsive design THEN Container Queries (`@container`, `@sm`, `@md`) SHALL be used for component-based responsive design
4. WHEN implementing 3D effects THEN new 3D transform utilities SHALL be used for spatial transformations
5. WHEN implementing gradients THEN expanded gradient APIs (radial, conic, interpolation modes) SHALL be used
6. WHEN implementing animations THEN `@starting-style` support SHALL be used for enter/exit transitions without JavaScript
7. WHEN implementing conditional styling THEN `not-*` variant SHALL be used for inverse styling conditions
8. WHEN implementing colors THEN modernized P3 color palette and `color-mix()` functions SHALL be used
9. WHEN implementing device targeting THEN `pointer-*` and `any-pointer-*` variants SHALL be used for touch/mouse specific styling
10. WHEN implementing text wrapping THEN `overflow-wrap` utilities SHALL be used for better text handling
11. WHEN implementing alignment THEN `items-baseline-last` and `self-baseline-last` utilities SHALL be used for advanced flex/grid alignment
12. WHEN implementing safe layouts THEN `safe` alignment utilities SHALL be used to prevent content from disappearing
13. WHEN implementing source control THEN `@source not` directive SHALL be used to optimize build performance
14. WHEN implementing utility safelisting THEN `@source inline()` directive SHALL be used for dynamic class inclusion

### Requirement 8: Enhance Design System with Modern CSS Variables

**User Story:** As a developer, I want to create a sophisticated design system using modern CSS custom properties so that the styling is more maintainable and leverages the latest CSS capabilities.

#### Acceptance Criteria

1. WHEN defining color tokens THEN CSS custom properties SHALL use modern color space syntax (oklch, p3)
2. WHEN defining spacing tokens THEN fluid spacing using `clamp()` SHALL be implemented
3. WHEN defining typography tokens THEN fluid typography scales SHALL be implemented using `clamp()`
4. WHEN defining animation tokens THEN CSS custom properties SHALL be used for consistent timing functions
5. WHEN defining shadow tokens THEN layered shadows using multiple box-shadow values SHALL be implemented
6. WHEN defining border tokens THEN modern border techniques including `border-image` SHALL be used where appropriate
7. WHEN implementing dark mode THEN CSS custom properties SHALL automatically adapt using `color-scheme` property

### Requirement 9: Validate Migration Success

**User Story:** As a developer, I want to verify that the migration was successful so that I can be confident that all functionality works correctly with Tailwind v4.

#### Acceptance Criteria

1. WHEN running the application THEN all pages SHALL load without errors
2. WHEN testing components THEN all interactive elements SHALL work correctly
3. WHEN testing responsive design THEN all breakpoints SHALL work correctly
4. WHEN testing dark mode THEN theme switching SHALL work correctly
5. WHEN running builds THEN no CSS-related warnings or errors SHALL appear
6. WHEN comparing before/after THEN visual output SHALL be identical or improved
7. WHEN performance testing THEN CSS loading performance SHALL be maintained or improved
8. WHEN testing modern CSS features THEN all new 2025 styling techniques SHALL work correctly across supported browsers
