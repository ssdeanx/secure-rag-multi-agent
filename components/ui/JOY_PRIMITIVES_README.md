# Joy UI Primitives - Production-Ready Components

✅ **8 Core Components Created** | 🎨 **Supabase Green Theme** | ♿ **WCAG 2.1 AA Compliant**

## Overview

This collection provides production-ready MUI Joy UI primitive components that integrate seamlessly with your existing Supabase green theme (`hsl(153 60% 53%)`). All components are fully typed, accessible, and follow Joy UI's design system principles.

## Components

### 1. Button (`button.joy.tsx`)

Full-featured button component with loading states and decorators.

**Features:**

- ✅ 4 variants: `solid`, `soft`, `outlined`, `plain`
- ✅ 3 sizes: `sm`, `md`, `lg`
- ✅ 5 colors: `primary`, `neutral`, `danger`, `success`, `warning`
- ✅ Loading state with `aria-busy`
- ✅ Start/end decorators for icons
- ✅ Minimum 44x44px touch target (WCAG AA)
- ✅ Proper ref forwarding

**Example:**

```tsx
import { Button } from '@/components/ui/joy'
;<Button variant="solid" color="primary" loading>
    Submit
</Button>
```

---

### 2. Input (`input.joy.tsx`)

Text input with custom focus ring and form integration.

**Features:**

- ✅ Custom focus ring with 3:1 contrast ratio
- ✅ FormControl integration (auto ID generation)
- ✅ Error state with `aria-invalid`
- ✅ Start/end decorators
- ✅ All input types supported

**Example:**

```tsx
import {
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
} from '@/components/ui/joy'
;<FormControl>
    <FormLabel>Email</FormLabel>
    <Input type="email" placeholder="you@example.com" />
    <FormHelperText>We'll never share your email</FormHelperText>
</FormControl>
```

---

### 3. Textarea (`textarea.joy.tsx`)

Auto-resizing textarea with custom styling.

**Features:**

- ✅ Auto-resize based on content
- ✅ `minRows` and `maxRows` configuration
- ✅ Custom focus ring matching Input
- ✅ Start/end decorators
- ✅ Form integration support

**Example:**

```tsx
import { Textarea } from '@/components/ui/joy'
;<Textarea placeholder="Enter your message..." minRows={3} maxRows={10} />
```

---

### 4. Select (`select.joy.tsx`)

Dropdown select with full keyboard navigation.

**Features:**

- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ `aria-expanded` on trigger
- ✅ `aria-selected` on options
- ✅ Multiple selection mode
- ✅ Start/end decorators

**Example:**

```tsx
import { Select, Option } from '@/components/ui/joy'
;<Select placeholder="Choose category">
    <Option value="tech">Technology</Option>
    <Option value="design">Design</Option>
    <Option value="marketing">Marketing</Option>
</Select>
```

---

### 5. Checkbox (`checkbox.joy.tsx`)

Checkbox with proper label association and indeterminate state.

**Features:**

- ✅ Proper label association via FormControl
- ✅ Indeterminate state (`aria-checked="mixed"`)
- ✅ Custom focus ring
- ✅ Icon customization
- ✅ Minimum 44x44px touch target

**Example:**

```tsx
import { Checkbox } from '@/components/ui/joy'
;<Checkbox label="Accept terms and conditions" required />
```

---

### 6. Chip / Badge (`chip.joy.tsx`)

Status indicators, tags, and badges.

**Features:**

- ✅ 4 variants: `solid`, `soft`, `outlined`, `plain`
- ✅ 5 colors
- ✅ Delete functionality
- ✅ Clickable mode
- ✅ Start/end decorators

**Example:**

```tsx
import { Chip, Badge } from '@/components/ui/joy'

<Chip variant="soft" color="success">
  Active
</Chip>

<Badge variant="solid" color="primary">
  New
</Badge>
```

---

### 7. Avatar (`avatar.joy.tsx`)

User profile pictures with fallback support.

**Features:**

- ✅ Image with `alt` text for accessibility
- ✅ Fallback content (initials, icons)
- ✅ 3 sizes: `sm`, `md`, `lg`
- ✅ Avatar groups with overlap
- ✅ 4 variants

**Example:**

```tsx
import { Avatar, AvatarGroup, AvatarImage, AvatarFallback } from '@/components/ui/joy'

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

<AvatarGroup max={3}>
  <Avatar>JD</Avatar>
  <Avatar>AB</Avatar>
  <Avatar>XY</Avatar>
</AvatarGroup>
```

---

### 8. Card (`card.joy.tsx`)

Content container with composition pattern.

**Features:**

- ✅ 4 variants: `solid`, `soft`, `outlined`, `plain`
- ✅ Horizontal and vertical orientation
- ✅ CardCover for background images/videos
- ✅ CardContent for main content
- ✅ CardActions for button groups
- ✅ Backward compatibility with Shadcn naming

**Example:**

```tsx
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
    CardActions,
    Button,
} from '@/components/ui/joy'
;<Card>
    <CardContent>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a card description.</CardDescription>
    </CardContent>
    <CardActions>
        <Button variant="solid">Action</Button>
        <Button variant="outlined">Cancel</Button>
    </CardActions>
</Card>
```

---

## Central Export

All components are exported from a single file for convenience:

```tsx
import {
    Button,
    Input,
    Textarea,
    Select,
    Option,
    Checkbox,
    Chip,
    Badge,
    Avatar,
    Card,
    FormControl,
    FormLabel,
    FormHelperText,
} from '@/components/ui/joy'
```

---

## Theme Integration

All components integrate with your existing `joyTheme` configuration in `/lib/theme/joy-theme.ts`:

### Color Palette

- **Primary**: Supabase green (`#3ECF8E` / `hsl(153 60% 53%)`)
- **Neutral**: Gray scale for text and borders
- **Danger**: Red for destructive actions
- **Success**: Teal/cyan for success states
- **Warning**: Amber for warnings

### Variants

- **Solid**: Filled background, high contrast
- **Soft**: Subtle background, medium contrast
- **Outlined**: Border only, minimal style
- **Plain**: No background, text-like

### Sizes

- **sm**: ~32px height
- **md**: ~40px height (default)
- **lg**: ~48px height

---

## Accessibility Compliance

All components meet **WCAG 2.1 Level AA** standards:

✅ **Focus Indicators**: 3:1 contrast ratio  
✅ **Touch Targets**: Minimum 44x44px  
✅ **ARIA Attributes**: Proper labels, roles, and states  
✅ **Keyboard Navigation**: Full keyboard support  
✅ **Screen Reader**: Compatible with assistive technology  
✅ **Color Contrast**: Text meets 4.5:1 ratio

---

## TypeScript Support

All components are fully typed with:

- ✅ Generic ref forwarding (`React.forwardRef<HTMLElement, Props>`)
- ✅ Strict prop interfaces (no `any` types)
- ✅ SxProps for theme-aware styling
- ✅ Proper HTML attribute inheritance
- ✅ Full IntelliSense support

---

## Testing

A comprehensive test page is available at:

```
/app/test-components/joy-primitives/page.tsx
```

Navigate to `/test-components/joy-primitives` in your browser to see all components in action with:

- ✅ All variants demonstrated
- ✅ Interactive state testing
- ✅ Form integration examples
- ✅ Accessibility testing
- ✅ Dark mode support

---

## Next Steps

### Phase 1 Complete ✅

- [x] Button
- [x] Input + Form components
- [x] Textarea
- [x] Select + Option
- [x] Checkbox
- [x] Chip / Badge
- [x] Avatar + AvatarGroup
- [x] Card + subcomponents

### Phase 2 (Next)

- [ ] Radio + RadioGroup
- [ ] Switch / Toggle
- [ ] Slider
- [ ] Progress (Linear + Circular) _already exists_
- [ ] Tabs + TabList + Tab + TabPanel
- [ ] Modal / Dialog
- [ ] Drawer
- [ ] Alert
- [ ] Tooltip

---

## Migration Strategy

To migrate from Shadcn components:

1. **Import from new file:**

    ```tsx
    // Before
    import { Button } from '@/components/ui/button'

    // After
    import { Button } from '@/components/ui/joy'
    ```

2. **Update variant names (if needed):**
    - Shadcn `default` → Joy `solid`
    - Shadcn `destructive` → Joy `solid` + `color="danger"`
    - Shadcn `ghost` → Joy `plain`

3. **Replace Tailwind classes with `sx` prop:**

    ```tsx
    // Before
    <Button className="bg-primary text-white">Click</Button>

    // After
    <Button variant="solid" color="primary">Click</Button>
    ```

4. **Test accessibility:** Use the test page to verify all components work correctly.

---

## Architecture Decisions

### Why Joy UI?

1. **Theme-first design**: CSS variables make customization easier
2. **Accessibility built-in**: WCAG compliance out of the box
3. **TypeScript native**: Better DX with full type support
4. **Smaller bundle**: Tree-shakeable components
5. **Modern API**: Cleaner props and better composition

### Why Not Material UI?

- Material Design is opinionated (doesn't fit all brands)
- Joy UI is more flexible for custom design systems
- Joy UI has better TypeScript experience

### Why Custom Wrappers?

- **Consistency**: Maintain existing API where possible
- **Type Safety**: Add project-specific types
- **Theme Integration**: Inject Supabase green palette
- **Accessibility**: Ensure minimum standards are met

---

## Troubleshooting

### Import Errors

```tsx
// ❌ Wrong
import Button from '@mui/joy/Button'

// ✅ Correct
import { Button } from '@/components/ui/joy'
```

### Type Errors

All components use proper TypeScript types. If you see type errors:

1. Ensure `@mui/joy` and `@mui/system` are installed
2. Check that you're using the correct prop names
3. Use `sx` prop for custom styles, not `className`

### Styling Issues

Joy UI uses Emotion's `sx` prop:

```tsx
// ❌ Won't work
<Button className="bg-red-500">Click</Button>

// ✅ Correct
<Button sx={{ bgcolor: 'danger.500' }}>Click</Button>
```

---

## Resources

- [MUI Joy UI Docs](https://mui.com/joy-ui/getting-started/)
- [Component API Reference](https://mui.com/joy-ui/api/)
- [Migration Plan](/plan/upgrade-shadcn-tailwind-to-mui-joy-1.md)
- [Component Mapping](/docs/component-mapping.md)
- [Joy Primitives Guide](/docs/joy-primitives-guide.md)

---

## Contributing

When adding new components:

1. Follow the existing naming pattern: `component.joy.tsx`
2. Include comprehensive JSDoc comments
3. Add examples in the component file
4. Export from `joy.tsx` index file
5. Update this README
6. Add to the test page
7. Ensure WCAG 2.1 AA compliance

---

## License

MIT - Same as the main project
