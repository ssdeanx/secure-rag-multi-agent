# MUI Joy UI Primitives - Usage Guide

## Overview

This document provides quick reference for the MUI Joy UI primitive components we've created to replace Shadcn/UI components. All components maintain API compatibility with Shadcn while leveraging Joy UI's design system.

## Component Directory

All Joy UI wrapper components are in `/components/ui/` with `.joy.tsx` extension:

```
components/ui/
├── avatar.joy.tsx      # Avatar, AvatarGroup, AvatarImage, AvatarFallback
├── badge.joy.tsx       # Badge (using Joy Chip)
├── button.joy.tsx      # Button with variant mapping
├── input.joy.tsx       # Input with focus ring
├── progress.joy.tsx    # Progress (Linear + Circular)
└── textarea.joy.tsx    # Textarea with auto-resize
```

Original Shadcn components are preserved in `/components/ui/shadnui/`.

---

## Button

**Import:**

```tsx
import { Button } from '@/components/ui/button.joy'
```

**Variants:**

- `default` → Joy `solid` + `primary` color
- `destructive` → Joy `solid` + `danger` color
- `outline` → Joy `outlined` + `neutral` color
- `secondary` → Joy `soft` + `neutral` color
- `ghost` → Joy `plain` + `neutral` color
- `link` → Joy `plain` with underline

**Sizes:** `sm`, `md` (default), `lg`, `icon`

**Example:**

```tsx
<Button variant="default" size="md">
    Click me
</Button>
```

---

## Input

**Import:**

```tsx
import { Input } from '@/components/ui/input.joy'
```

**Features:**

- Auto-styled focus ring (2px primary-200)
- Outlined variant by default
- Full HTML input attributes supported

**Example:**

```tsx
<Input type="email" placeholder="Enter email" disabled={false} />
```

---

## Badge

**Import:**

```tsx
import { Badge } from '@/components/ui/badge.joy'
```

**Variants:**

- `default` → Joy `soft` + `primary` color
- `secondary` → Joy `soft` + `neutral` color
- `destructive` → Joy `soft` + `danger` color
- `outline` → Joy `outlined` + `neutral` color

**Example:**

```tsx
<Badge variant="default">New</Badge>
```

---

## Avatar

**Import:**

```tsx
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
    AvatarGroup,
} from '@/components/ui/avatar.joy'
```

**Sizes:** `sm`, `md` (default), `lg`

**Variants:** `solid`, `soft` (default), `outlined`, `plain`

**Example:**

```tsx
<Avatar size="md" variant="soft">
    <AvatarImage src="/avatar.jpg" alt="User" />
    <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

**Group Example:**

```tsx
<AvatarGroup>
    <Avatar>
        <AvatarImage src="/user1.jpg" />
    </Avatar>
    <Avatar>
        <AvatarImage src="/user2.jpg" />
    </Avatar>
    <Avatar>
        <AvatarFallback>+3</AvatarFallback>
    </Avatar>
</AvatarGroup>
```

---

## Progress

**Import:**

```tsx
import { Progress, CircularProgress } from '@/components/ui/progress.joy'
```

**Linear Progress (default):**

```tsx
<Progress value={60} variant="soft" />
```

**Circular Progress:**

```tsx
;<CircularProgress value={75} size="lg" variant="soft" />

{
    /* Indeterminate (loading) */
}
;<CircularProgress size="md" />
```

**Variants:** `solid`, `soft` (default), `outlined`, `plain`

---

## Textarea

**Import:**

```tsx
import { Textarea } from '@/components/ui/textarea.joy'
```

**Features:**

- Auto-resizing based on content
- Custom focus ring styling (matches Input)
- Support for `minRows` and `maxRows`

**Example:**

```tsx
<Textarea
    placeholder="Enter your message..."
    minRows={3}
    maxRows={10}
    variant="outlined"
/>
```

---

## Joy UI Variants System

All components support Joy UI's global variant system:

| Variant    | Description       | Use Case                         |
| ---------- | ----------------- | -------------------------------- |
| `solid`    | Filled background | Primary actions, emphasis        |
| `soft`     | Subtle background | Secondary actions, default state |
| `outlined` | Border only       | Form inputs, neutral actions     |
| `plain`    | Minimal styling   | Text-like, ghost buttons         |

## Joy UI Color Palette

Available colors for all components:

- `primary` - Supabase green (hsl(153 60% 53%))
- `neutral` - Gray scale
- `danger` - Red for destructive actions
- `success` - Green for success states
- `warning` - Yellow/orange for warnings

## Theming

Global theme configuration in `/lib/theme/joy-theme.ts`:

```tsx
import { joyTheme } from '@/lib/theme/joy-theme'

// Theme provides:
// - Color palettes (light/dark)
// - Typography scale
// - Border radius tokens
// - Shadow tokens
// - Global variant definitions
```

## Focus Ring Customization

Components use CSS variables for focus styling:

```tsx
sx={{
  '--Input-focusedInset': 'var(--any, )',
  '--Input-focusedThickness': '2px',
  '--Input-focusedHighlight': 'var(--joy-palette-primary-500)',
}}
```

## Size Mapping

| Shadcn           | Joy UI | Pixel Size   |
| ---------------- | ------ | ------------ |
| `sm`             | `sm`   | ~32px height |
| `default` / `md` | `md`   | ~40px height |
| `lg`             | `lg`   | ~48px height |

## Next Steps

1. **Test components individually** - Create test page in `app/tests/joy-components/page.tsx`
2. **Update consuming code** - Replace imports from `@/components/ui/[component]` to `@/components/ui/[component].joy`
3. **Visual regression** - Compare Shadcn and Joy versions side-by-side
4. **Accessibility audit** - Verify keyboard nav and screen reader support

## Migration Pattern

```tsx
// Before (Shadcn)
import { Button } from '@/components/ui/button'

// After (Joy UI)
import { Button } from '@/components/ui/button.joy'

// API remains the same!
;<Button variant="default" size="md">
    Click
</Button>
```

## Troubleshooting

**Import errors:**

- Make sure MUI Joy packages are installed: `npm install @mui/joy`
- Joy components use **default exports**: `import JoyButton from '@mui/joy/Button'`

**Styling issues:**

- Joy uses Emotion's `sx` prop instead of Tailwind classes
- Theme tokens are accessed via `--joy-palette-*` CSS variables
- Use `slotProps` to style internal elements

**Type errors:**

- Joy components have different ref types than HTML elements
- Use `React.ComponentProps<typeof JoyComponent>` for full type inference
- `ForwardedRef<HTMLDivElement>` is common for Joy container components

## Resources

- [MUI Joy UI Docs](https://mui.com/joy-ui/getting-started/)
- [Component API Reference](https://mui.com/joy-ui/api/)
- [Migration Plan](/plan/upgrade-shadcn-tailwind-to-mui-joy-1.md)
- [Component Mapping Guide](/docs/component-mapping.md)
