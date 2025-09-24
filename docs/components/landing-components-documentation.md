---
title: Landing Components - Technical Documentation
component_path: `components/landing/` 
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Frontend / Product
tags: [landing, components, ui, documentation]
---

# Landing Components Documentation

This file documents the small presentational components used on the site landing page: `InteractiveFeatures`, `NewsletterForm`, and `CTA`.

## 1. InteractiveFeatures

- Purpose: Showcase a grid of product features with icons and animated entrance.

- Key details:
  - Uses `framer-motion` for reveal animations.
  - Renders a 3-column responsive grid of `Card` components.
  - Self-contained and purely presentational.

- Props: none.

- Usage: included on the home page to highlight product capabilities.

## 2. NewsletterForm

- Purpose: Collect user email for newsletter subscription.

- Key details:
  - Client-side component with local state for `email`, `submitted`, and `error`.
  - Validates email client-side with a simple regex; posts to `/api/newsletter` on submit.
  - Displays success and error states.

- Props: none.

- Testing notes:
  - Test validation logic, submission flow (mocking fetch), and UI transitions for submitted state.

## 3. CTA (Call to Action)

- Purpose: Render a centered call-to-action card with primary CTAs (Try Demo / Read Docs).

- Key details:
  - Uses `framer-motion` for entrance animation and `Card`/`Button` UI primitives.
  - Buttons use `asChild` to render anchor links under the project's button primitive.

- Props: none.

## 4. Cross-cutting considerations

- Accessibility: Ensure `aria-label` and semantic tags are used for forms and interactive elements.

- Performance: All components are client components and use framer-motion; lazy-load or reduce animation complexity if needed.

## 5. Change history

- 1.0 (2025-09-23) - Initial documentation
