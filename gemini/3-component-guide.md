# Mastra Governed RAG: Component Guide

This project uses a combination of custom components and the `shadcn/ui` component library, which is built on Radix UI and styled with Tailwind CSS.

## 1. Component Directories

- **`components/`**: Contains high-level, application-specific components that compose the main layout and features.
    - `ChatInterface.tsx`: The primary component for user interaction.
    - `AuthPanel.tsx`: UI for generating JWTs for different user roles for demo purposes.
    - `AppSidebar.tsx`, `TopNavigation.tsx`, `Footer.tsx`: Structural layout components.

- **`cedar/`**: Contains more generic, reusable UI components. This seems to be the project's internal name for its design system, based on `shadcn/ui`.
    - Primitives like `Button.tsx`, `Input.tsx`, `Card.tsx` are found here.
    - These components should be used for building any new UI elements to maintain consistency.

- **`components/ui/`**: This directory is the standard location for `shadcn/ui` components. It appears you have placed them in `cedar/` instead. When adding new shadcn/ui components, continue to place them in the `cedar/` directory to maintain consistency.

## 2. Using Existing Components

Before creating a new component, always check the `cedar/` and `components/` directories to see if a suitable one already exists. Reusing components is key to maintaining a consistent look and feel.

**Example: Using a Button**

```tsx
import { Button } from '@/cedar/button';

const MyComponent = () => {
  return <Button onClick={() => alert('Clicked!')}>Click Me</Button>;
};
```

## 3. Adding New Components

If a new, reusable component is needed, it should be added to the `cedar/` directory.

- **For `shadcn/ui` components:** Use the `shadcn-ui` CLI to add new components. Make sure to configure it to place them in the correct directory (`cedar/`).
- **For custom components:** Create a new file in `cedar/` and follow the existing patterns (e.g., using `clsx` and `tailwind-merge` for dynamic styling).

## 4. Styling

- All styling is done with **Tailwind CSS**.
- Utility classes are preferred over custom CSS.
- The `tailwind.config.js` file contains the theme configuration.
- The `globals.css` file contains base styles and Tailwind layer definitions.
