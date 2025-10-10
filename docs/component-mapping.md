# Shadcn/UI to MUI Joy Component Mapping

This document provides the mapping between Shadcn/UI components and their MUI Joy UI equivalents.

## Status Legend

- ✅ Direct 1:1 mapping
- 🔄 Needs adaptation
- ⚠️ Requires custom implementation
- ❌ No direct equivalent

## Core Components

| Shadcn Component | Joy UI Component  | Status | Notes                                  |
| ---------------- | ----------------- | ------ | -------------------------------------- |
| Button           | Button            | ✅     | Direct mapping with variant system     |
| Input            | Input             | ✅     | Similar API, some prop differences     |
| Textarea         | Textarea          | ✅     | Direct mapping                         |
| Select           | Select            | ✅     | Similar API with Option children       |
| Checkbox         | Checkbox          | ✅     | Direct mapping                         |
| Radio            | Radio, RadioGroup | ✅     | Use RadioGroup for groups              |
| Switch           | Switch            | ✅     | Direct mapping                         |
| Slider           | Slider            | ✅     | Similar API                            |
| Badge            | Badge             | ✅     | Direct mapping with variants           |
| Avatar           | Avatar            | ✅     | Direct mapping                         |
| Progress         | LinearProgress    | ✅     | Use LinearProgress or CircularProgress |

## Layout Components

| Shadcn Component | Joy UI Component    | Status | Notes                                          |
| ---------------- | ------------------- | ------ | ---------------------------------------------- |
| Card             | Card + variants     | ✅     | Use Card, CardContent, CardCover, CardOverflow |
| Separator        | Divider             | ✅     | Direct mapping                                 |
| ScrollArea       | Sheet + sx overflow | 🔄     | Use Box/Sheet with overflow styling            |
| AspectRatio      | AspectRatio         | ✅     | Direct mapping                                 |
| Skeleton         | Skeleton            | ✅     | Direct mapping                                 |

## Navigation Components

| Shadcn Component | Joy UI Component                              | Status | Notes                              |
| ---------------- | --------------------------------------------- | ------ | ---------------------------------- |
| Tabs             | Tabs, TabList, Tab, TabPanel                  | ✅     | Similar structure                  |
| Menubar          | Menu, MenuButton                              | 🔄     | Use Menu with trigger pattern      |
| DropdownMenu     | Dropdown, Menu, MenuItem                      | ✅     | Direct mapping                     |
| NavigationMenu   | Tabs or custom                                | 🔄     | Use Tabs or build custom with List |
| Breadcrumb       | Breadcrumbs                                   | ✅     | Direct mapping                     |
| Accordion        | Accordion, AccordionDetails, AccordionSummary | ✅     | Direct mapping                     |
| Collapsible      | Accordion                                     | ✅     | Use single Accordion item          |

## Overlay Components

| Shadcn Component | Joy UI Component            | Status | Notes                                     |
| ---------------- | --------------------------- | ------ | ----------------------------------------- |
| Dialog           | Modal                       | ✅     | Direct mapping with ModalDialog           |
| AlertDialog      | Modal + ModalDialog variant | 🔄     | Use Modal with warning color              |
| Sheet            | Drawer or Modal             | ✅     | Use Drawer for side panels                |
| Drawer           | Drawer                      | ✅     | Direct mapping                            |
| Popover          | Popover or Menu             | ✅     | Use Menu for clickable, Tooltip for hover |
| Tooltip          | Tooltip                     | ✅     | Direct mapping                            |
| HoverCard        | Popover on hover            | 🔄     | Use Popover with hover trigger            |
| ContextMenu      | Menu                        | 🔄     | Use Menu with contextmenu event           |

## Feedback Components

| Shadcn Component | Joy UI Component                       | Status | Notes                                         |
| ---------------- | -------------------------------------- | ------ | --------------------------------------------- |
| Alert            | Alert                                  | ✅     | Direct mapping with color variants            |
| Toast (Sonner)   | Snackbar                               | 🔄     | Joy Snackbar or keep Sonner temporarily       |
| Form             | FormControl, FormLabel, FormHelperText | ✅     | More granular component structure             |
| Label            | FormLabel or Typography                | ✅     | Use FormLabel for forms, Typography otherwise |

## Data Display Components

| Shadcn Component | Joy UI Component | Status | Notes                                        |
| ---------------- | ---------------- | ------ | -------------------------------------------- |
| Table            | Table, Sheet     | ✅     | Direct mapping with Sheet for layout         |
| Command          | Custom           | ⚠️     | Build custom with Autocomplete + Modal       |
| Calendar         | Custom           | ⚠️     | No built-in, use date-fns + custom component |
| Pagination       | Pagination       | ❌     | Build custom or keep existing                |
| Chart            | Keep recharts    | ✅     | Joy UI has no chart components               |

## Utility Components

| Shadcn Component | Joy UI Component            | Status | Notes                             |
| ---------------- | --------------------------- | ------ | --------------------------------- |
| Resizable        | Keep react-resizable-panels | ✅     | No Joy equivalent                 |
| Sidebar          | Custom using Drawer/Sheet   | 🔄     | Build with List, ListItem, Drawer |
| Carousel         | Keep embla-carousel-react   | ✅     | No Joy equivalent                 |

## Variant Mapping

### Button Variants

- Shadcn `default` → Joy `solid`
- Shadcn `outline` → Joy `outlined`
- Shadcn `ghost` → Joy `plain`
- Shadcn `link` → Joy `plain` + `component="a"`
- Shadcn `destructive` → Joy `solid` + `color="danger"`
- Shadcn `secondary` → Joy `solid` + `color="neutral"`

### Size Mapping

- Shadcn `sm` → Joy `sm`
- Shadcn `default` → Joy `md`
- Shadcn `lg` → Joy `lg`
- Shadcn `icon` → Joy size with icon only

## Color Mapping

| Semantic Color | Shadcn      | Joy UI                    |
| -------------- | ----------- | ------------------------- |
| Primary        | primary     | primary                   |
| Secondary      | secondary   | neutral                   |
| Destructive    | destructive | danger                    |
| Muted          | muted       | neutral + soft variant    |
| Accent         | accent      | primary (use primary-600) |
| Success        | N/A         | success                   |
| Warning        | N/A         | warning                   |

## Migration Priority Order

1. **Phase 1**: Button, Input, Badge, Avatar, Progress
2. **Phase 2**: Card, Separator, Dialog, Sheet
3. **Phase 3**: Form components, Select, Checkbox, Radio, Switch, Slider
4. **Phase 4**: Menubar, DropdownMenu, Tabs, Breadcrumb
5. **Phase 5**: Alert, Tooltip, Popover
6. **Phase 6**: Table, Accordion
7. **Phase 7**: Drawer, Sidebar, Skeleton, AspectRatio
8. **Custom**: Command, Calendar (if needed)

## Common Prop Differences

### Button

```tsx
// Shadcn
<Button variant="outline" size="sm" asChild>

// Joy UI
<Button variant="outlined" size="sm" component="a">
```

### Input

```tsx
// Shadcn
<Input className="..." />

// Joy UI
<Input sx={{ ... }} />
```

### Card

```tsx
// Shadcn
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Joy UI
<Card>
  <Typography level="h2">Title</Typography>
  <Typography level="body-sm">Description</Typography>
  <CardContent>Content</CardContent>
</Card>
```

## Styling Approach Changes

### From Tailwind + cn()

```tsx
<div className={cn("flex items-center gap-2", className)}>
```

### To Joy UI sx prop

```tsx
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
```

### Theme Tokens

- Tailwind: `bg-primary text-primary-foreground`
- Joy UI: `bgcolor: 'primary.solidBg', color: 'primary.solidColor'`
