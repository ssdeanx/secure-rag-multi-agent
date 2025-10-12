# MUI Joy UI Components Reference

> Comprehensive reference for MUI Joy UI components based on official documentation

## Table of Contents

1. [Layout Components](#layout-components)
2. [Navigation Components](#navigation-components)
3. [Surface Components](#surface-components)
4. [Input Components](#input-components)
5. [Data Display](#data-display)
6. [Feedback Components](#feedback-components)
7. [Integration Notes](#integration-notes)

---

## Layout Components

### Box

**Import:** `import Box from '@mui/joy/Box';`

**Purpose:** Generic container with theme-aware styling and MUI System props

**Key Features:**

- Renders as `<div>` by default (use `component` prop to change)
- Full access to MUI System properties
- `sx` prop for theme-aware styling
- Similar to HTML `<div>` but with extra built-in features

**Example:**

```tsx
<Box
    component="section"
    sx={{
        p: 2,
        border: '1px dashed grey',
        display: 'flex',
        gap: 2,
    }}
>
    Content
</Box>
```

### Grid

**Import:** `import Grid from '@mui/joy/Grid';`

**Purpose:** 12-column grid layout system for responsive designs

**Key Features:**

- Based on CSS flexbox (not CSS Grid)
- `size` prop for column widths (1-12)
- Responsive breakpoints: `xs`, `sm`, `md`, `lg`, `xl`
- `spacing` prop for gaps between items
- `columns` prop to change default 12-column layout

**Example:**

```tsx
<Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 6 }}>
        <Item>Left column</Item>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
        <Item>Right column</Item>
    </Grid>
</Grid>
```

**Important:** `size` replaces the old `xs`, `sm`, `md` props

### Stack

**Import:** `import Stack from '@mui/joy/Stack';`

**Purpose:** One-dimensional layout (vertical or horizontal)

**Key Features:**

- Default: vertical column layout
- `direction` prop: `row` | `column`
- `spacing` prop for gaps between children
- `divider` prop for separators
- `useFlexGap` prop for modern flexbox gap implementation

**Example:**

```tsx
<Stack direction="row" spacing={2} divider={<Divider orientation="vertical" />}>
    <Item>Item 1</Item>
    <Item>Item 2</Item>
    <Item>Item 3</Item>
</Stack>
```

**When to use:** Stack vs Grid

- **Stack:** One-dimensional layouts (list of items)
- **Grid:** Two-dimensional layouts (rows AND columns)

---

## Navigation Components

### Menu

**Import:**

```tsx
import Dropdown from '@mui/joy/Dropdown'
import Menu from '@mui/joy/Menu'
import MenuButton from '@mui/joy/MenuButton'
import MenuItem from '@mui/joy/MenuItem'
import MenuList from '@mui/joy/MenuList'
```

**Component Structure:**

```tsx
<Dropdown>
    <MenuButton>Actions</MenuButton>
    <Menu>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem>Logout</MenuItem>
    </Menu>
</Dropdown>
```

**Key Features:**

- `Dropdown` wraps and manages state
- `MenuButton` triggers the menu (uses Button styles)
- `Menu` is the popup listbox (uses List styles)
- `MenuItem` uses ListItemButton styles
- `selected` prop for MenuItem
- Positioning via `placement` prop

**Icon Button Menu:**

```tsx
<Dropdown>
    <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'outlined' } }}
    >
        <MoreVert />
    </MenuButton>
    <Menu>...</Menu>
</Dropdown>
```

### Tabs

**Import:**

```tsx
import Tabs from '@mui/joy/Tabs'
import TabList from '@mui/joy/TabList'
import Tab from '@mui/joy/Tab'
import TabPanel from '@mui/joy/TabPanel'
```

**Component Structure:**

```tsx
<Tabs defaultValue={0}>
    <TabList>
        <Tab>First tab</Tab>
        <Tab>Second tab</Tab>
    </TabList>
    <TabPanel value={0}>First content</TabPanel>
    <TabPanel value={1}>Second content</TabPanel>
</Tabs>
```

**Key Features:**

- WAI-ARIA compliant
- `orientation`: `horizontal` (default) | `vertical`
- `sticky` prop for fixed positioning
- `tabFlex` prop for equal-width tabs
- `underlinePlacement` and `indicatorPlacement` for styling
- Scrollable tabs with CSS scroll-snap

### Drawer

**Import:** `import Drawer from '@mui/joy/Drawer';`

**Purpose:** Side panel for navigation or dialogs

**Key Features:**

- `anchor` prop: `left` | `top` | `right` | `bottom`
- `size` prop: `sm`, `md`, `lg`
- `open` prop for controlled state
- Uses `ModalClose` component for close button
- Transition customization via CSS variables

**Example:**

```tsx
<Drawer open={open} onClose={() => setOpen(false)} anchor="right">
    <ModalClose />
    <DialogTitle>Title</DialogTitle>
    <DialogContent>Content here</DialogContent>
</Drawer>
```

**CSS Variables for transitions:**

- `--Drawer-transitionFunction`
- `--Drawer-transitionDuration`

---

## Surface Components

### Card

**Import:**

```tsx
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import CardCover from '@mui/joy/CardCover'
import CardOverflow from '@mui/joy/CardOverflow'
import CardActions from '@mui/joy/CardActions'
```

**Component Structure:**

```tsx
<Card variant="outlined" size="md">
    <CardCover>
        <img src="background.jpg" alt="Background" />
    </CardCover>
    <CardContent>
        <Typography level="title-lg">Title</Typography>
        <Typography level="body-sm">Description</Typography>
    </CardContent>
    <CardActions>
        <Button>Action</Button>
    </CardActions>
</Card>
```

**Key Features:**

- Variants: `plain`, `outlined` (default), `soft`, `solid`
- Sizes: `sm`, `md` (default), `lg`
- `orientation`: `vertical` (default) | `horizontal`
- `invertedColors` prop for sufficient contrast
- `CardOverflow` removes padding to fill edges
- `CardCover` for background images/videos/gradients
- `CardActions` for button grouping with `buttonFlex` prop

**Card Layers (stacking order):**

1. Card (base)
2. CardCover (background images/gradients)
3. CardContent (foreground content)

### Sheet

**Import:** `import Sheet from '@mui/joy/Sheet';`

**Purpose:** Generic surface container (like Material UI's Paper)

**Key Features:**

- Supports all global variants
- Access to all theme colors via `color` prop
- Alternative to Box when you need variant styling

**Example:**

```tsx
<Sheet variant="outlined" color="neutral" sx={{ p: 4 }}>
    Content
</Sheet>
```

### Accordion

**Import:**

```tsx
import AccordionGroup from '@mui/joy/AccordionGroup'
import Accordion from '@mui/joy/Accordion'
import AccordionSummary from '@mui/joy/AccordionSummary'
import AccordionDetails from '@mui/joy/AccordionDetails'
```

**Component Structure:**

```tsx
<AccordionGroup size="md" disableDivider={false}>
    <Accordion>
        <AccordionSummary>Header</AccordionSummary>
        <AccordionDetails>Content</AccordionDetails>
    </Accordion>
</AccordionGroup>
```

**Key Features:**

- WAI-ARIA compliant
- `expanded` prop for controlled state
- `disabled` prop on Accordion
- `disableDivider` on AccordionGroup
- `transition` prop for animation customization
- `indicator` prop for custom expand icon
- Reuses List component styles

---

## Input Components

### Input

**Import:** `import Input from '@mui/joy/Input';`

**Key Features:**

- Variants: `solid` (default), `soft`, `outlined`, `plain`
- Sizes: `sm`, `md` (default), `lg`
- `startDecorator` and `endDecorator` props
- Custom focus ring via CSS variables
- Form props: `required`, `disabled`, `error`

**Focus Ring CSS Variables:**

```tsx
<Input
    sx={{
        '--Input-focusedInset': 'var(--any, )',
        '--Input-focusedThickness': '2px',
        '--Input-focusedHighlight': 'var(--joy-palette-primary-500)',
    }}
/>
```

**With Form Components:**

```tsx
<FormControl>
    <FormLabel>Label</FormLabel>
    <Input placeholder="Type here" />
    <FormHelperText>Helper text</FormHelperText>
</FormControl>
```

### Textarea

**Import:** `import Textarea from '@mui/joy/Textarea';`

**Key Features:**

- Auto-resizing based on content (uses MUI Base TextareaAutoSize)
- Same variants/sizes as Input
- `minRows` and `maxRows` props
- `startDecorator` and `endDecorator` props
- Same focus ring customization as Input

**Example:**

```tsx
<Textarea
    placeholder="Type anything…"
    minRows={3}
    maxRows={10}
    endDecorator={<Typography level="body-xs">{count} characters</Typography>}
/>
```

### Switch

**Import:** `import Switch from '@mui/joy/Switch';`

**Key Features:**

- Renders with `checkbox` role (not `switch` - better support)
- Variants: `plain`, `outlined`, `soft`, `solid`
- Sizes: `sm`, `md`, `lg`
- `startDecorator` and `endDecorator` props
- `slotProps` for track/thumb customization

**Track/Thumb Children:**

```tsx
<Switch
    slotProps={{
        track: {
            children: (
                <>
                    <Typography component="span">On</Typography>
                    <Typography component="span">Off</Typography>
                </>
            ),
        },
        thumb: {
            children: <DarkMode />,
        },
    }}
/>
```

**CSS Variables:**

- `--Switch-trackRadius`
- `--Switch-trackWidth`
- `--Switch-trackHeight`
- `--Switch-thumbSize`

### Slider

**Import:** `import Slider from '@mui/joy/Slider';`

**Key Features:**

- Variants: `plain`, `outlined`, `soft`, `solid`
- Sizes: `sm`, `md`, `lg`
- `marks` prop for custom tick marks
- `step` prop for increments
- `valueLabelDisplay`: `on` | `off` | `auto`
- `orientation`: `horizontal` | `vertical`
- Range slider via array `value`
- `track` prop: `normal` | `inverted` | `false`

**Example:**

```tsx
<Slider
    defaultValue={30}
    marks={[
        { value: 0, label: '0°C' },
        { value: 100, label: '100°C' },
    ]}
    valueLabelDisplay="auto"
/>
```

---

## Data Display

### Typography

**Import:** `import Typography from '@mui/joy/Typography';`

**Key Features:**

- `level` prop for semantic levels:
    - Headings: `h1`, `h2`, `h3`, `h4`
    - Titles: `title-lg`, `title-md`, `title-sm`
    - Body: `body-lg`, `body-md` (default), `body-sm`, `body-xs`
- `startDecorator` and `endDecorator` props
- `gutterBottom` prop for spacing
- `noWrap` prop for ellipsis
- `levelMapping` prop for custom HTML tags

**Example:**

```tsx
<Typography level="h2" gutterBottom>
  Heading
</Typography>
<Typography level="body-md" startDecorator={<InfoIcon />}>
  Information text
</Typography>
```

---

## Feedback Components

### Circular Progress / Linear Progress

**Import:**

```tsx
import CircularProgress from '@mui/joy/CircularProgress'
import LinearProgress from '@mui/joy/LinearProgress'
```

**Key Features:**

- `determinate` prop for controlled progress
- `value` prop (0-100) when determinate
- Variants: `solid`, `soft`, `outlined`, `plain`
- Sizes: `sm`, `md`, `lg`

**Example:**

```tsx
<LinearProgress determinate value={60} variant="soft" />
<CircularProgress determinate value={75} size="lg" />
```

---

## Integration Notes

### Next.js App Router Setup

**Required setup in app/ThemeRegistry.tsx:**

```tsx
'use client'
import createCache from '@emotion/cache'
import { useServerInsertedHTML } from 'next/navigation'
import { CacheProvider } from '@emotion/react'
import { CssVarsProvider } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'

export default function ThemeRegistry({ children }) {
    // Emotion cache setup for SSR
    const [{ cache, flush }] = React.useState(() => {
        const cache = createCache({ key: 'joy' })
        cache.compat = true
        // ... flush logic
        return { cache, flush }
    })

    useServerInsertedHTML(() => {
        const names = flush()
        if (names.length === 0) return null
        let styles = ''
        for (const name of names) {
            styles += cache.inserted[name]
        }
        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(' ')}`}
                dangerouslySetInnerHTML={{ __html: styles }}
            />
        )
    })

    return (
        <CacheProvider value={cache}>
            <CssVarsProvider>
                <CssBaseline />
                {children}
            </CssVarsProvider>
        </CacheProvider>
    )
}
```

**In app/layout.tsx:**

```tsx
import { getInitColorSchemeScript } from '@mui/joy/styles'

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>{getInitColorSchemeScript()}</head>
            <body>
                <ThemeRegistry>{children}</ThemeRegistry>
            </body>
        </html>
    )
}
```

### CSS Baseline

**Import:** `import CssBaseline from '@mui/joy/CssBaseline';`

**Purpose:** Global reset and baseline styles

**What it does:**

- Removes browser default margins
- Sets `box-sizing: border-box` globally
- Applies theme background colors
- Sets default typography
- Applies color-scheme for native UI elements

**Scoped version:**

```tsx
import ScopedCssBaseline from '@mui/joy/ScopedCssBaseline'
;<ScopedCssBaseline>{/* Only children affected */}</ScopedCssBaseline>
```

### Common Patterns

#### Form with Validation

```tsx
<FormControl error={hasError}>
  <FormLabel>Email</FormLabel>
  <Input
    type="email"
    placeholder="you@example.com"
    startDecorator={<EmailIcon />}
    error={hasError}
  />
  <FormHelperText>
    <InfoOutlined />
    {hasError ? 'Invalid email' : 'We'll never share your email'}
  </FormHelperText>
</FormControl>
```

#### Loading Button

```tsx
<Button
    loading={isLoading}
    loadingPosition="start"
    startDecorator={<SaveIcon />}
    onClick={handleSave}
>
    Save Changes
</Button>
```

#### Card with Image Background

```tsx
<Card sx={{ minHeight: 280 }}>
    <CardCover>
        <img src="background.jpg" alt="" />
    </CardCover>
    <CardCover
        sx={{
            background:
                'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px)',
        }}
    />
    <CardContent sx={{ justifyContent: 'flex-end' }}>
        <Typography level="title-lg" textColor="#fff">
            Card Title
        </Typography>
    </CardContent>
</Card>
```

#### Responsive Grid

```tsx
<Grid container spacing={2}>
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card>Item 1</Card>
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card>Item 2</Card>
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card>Item 3</Card>
    </Grid>
</Grid>
```

---

## Migration Tips

### From Shadcn/UI

1. **Button variants:**
    - `default` → `solid` + `primary`
    - `destructive` → `solid` + `danger`
    - `outline` → `outlined`
    - `ghost` → `plain`
    - `link` → `plain` with custom styling

2. **Form components:**
    - Joy UI requires `FormControl` wrapper
    - Use `FormLabel` instead of `Label`
    - Use `FormHelperText` instead of separate helper components

3. **Card components:**
    - Joy Card has more built-in layers (Cover, Content, Overflow)
    - No need for separate CardHeader/CardFooter - use Typography + CardActions

4. **Focus rings:**
    - Joy uses `::before` pseudo-element for focus rings
    - Customize via CSS variables instead of Tailwind utilities

### Component Equivalents

| Shadcn/UI     | Joy UI            | Notes                                    |
| ------------- | ----------------- | ---------------------------------------- |
| Alert         | Alert             | Direct equivalent                        |
| Avatar        | Avatar            | Direct equivalent                        |
| Badge         | Chip              | Use `size="sm"` for badge-like           |
| Button        | Button            | Map variants                             |
| Card          | Card + subparts   | More layers available                    |
| Checkbox      | Checkbox          | Similar API                              |
| Dialog        | Modal             | Use with Sheet for dialog-like           |
| Drawer        | Drawer            | Direct equivalent                        |
| Input         | Input             | Similar with decorators                  |
| Label         | FormLabel         | Use with FormControl                     |
| Progress      | LinearProgress    | Direct equivalent                        |
| Radio Group   | RadioGroup        | Direct equivalent                        |
| Select        | Select            | Different implementation                 |
| Separator     | Divider           | Direct equivalent                        |
| Sheet         | Sheet/Modal       | Context-dependent                        |
| Switch        | Switch            | Direct equivalent                        |
| Tabs          | Tabs + TabList    | More components involved                 |
| Textarea      | Textarea          | Auto-resize built-in                     |
| Toast/Sonner  | Snackbar          | Different API                            |
| Tooltip       | Tooltip           | Direct equivalent                        |
| Dropdown Menu | Menu + Dropdown   | Requires wrapper component               |
| Accordion     | Accordion + Group | Requires AccordionGroup wrapper          |
| Slider        | Slider            | Direct equivalent                        |
| Table         | Table             | Direct equivalent (not covered in fetch) |

---

## Resources

- [Joy UI Documentation](https://mui.com/joy-ui/getting-started/)
- [Joy UI GitHub](https://github.com/mui/material-ui/tree/master/packages/mui-joy)
- [Joy UI Figma Kit](https://mui.com/store/items/figma-react/)
- [Component API Reference](https://mui.com/joy-ui/api/)
- [Next.js Integration Guide](https://mui.com/joy-ui/integrations/next-js-app-router/)
