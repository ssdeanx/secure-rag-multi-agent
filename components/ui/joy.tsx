/**
 * Joy UI Primitives - Index
 *
 * Central export file for all Joy UI primitive components.
 * Import from this file for easy access to all components.
 *
 * @example
 * ```tsx
 * import { Button, Input, Card } from '@/components/ui/joy'
 * ```
 */

export { Button } from './button.joy'
export type { ButtonProps } from './button.joy'

export { Input, FormControl, FormLabel, FormHelperText } from './input.joy'
export type {
    InputProps,
    FormControlProps,
    FormLabelProps,
    FormHelperTextProps,
} from './input.joy'

export { Textarea } from './textarea.joy'
export type { TextareaProps } from './textarea.joy'

export { Select, Option } from './select.joy'
export type { SelectProps, OptionProps } from './select.joy'

export { Checkbox } from './checkbox.joy'
export type { CheckboxProps } from './checkbox.joy'

export { Chip, Badge } from './chip.joy'
export type { ChipProps } from './chip.joy'

export { Avatar, AvatarGroup, AvatarImage, AvatarFallback } from './avatar.joy'
export type {
    AvatarProps,
    AvatarGroupProps,
    AvatarImageProps,
    AvatarFallbackProps,
} from './avatar.joy'

export {
    Card,
    CardContent,
    CardCover,
    CardOverflow,
    CardActions,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from './card.joy'
export type {
    CardProps,
    CardContentProps,
    CardCoverProps,
    CardOverflowProps,
    CardActionsProps,
} from './card.joy'

// Layout components
export { Box, Grid, Stack } from './layout.joy'
export type { BoxProps, GridProps, StackProps } from './layout.joy'

export { Divider, Separator } from './divider.joy'
export type { DividerProps } from './divider.joy'

// Navigation & interaction
export {
    AccordionGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from './accordion.joy'
export type {
    AccordionGroupProps,
    AccordionProps,
    AccordionSummaryProps,
    AccordionDetailsProps,
} from './accordion.joy'

export { Tabs, TabList, Tab, TabPanel } from './tabs.joy'
export type {
    TabsProps,
    TabListProps,
    TabProps,
    TabPanelProps,
} from './tabs.joy'

export {
    Dropdown,
    MenuButton,
    Menu,
    MenuItem,
    MenuDivider,
    MenuItemDecorator,
} from './menu.joy'
export type {
    DropdownProps,
    MenuButtonProps,
    MenuProps,
    MenuItemProps,
} from './menu.joy'

export { Link } from './link.joy'
export type { LinkProps } from './link.joy'

// Overlays & dialogs
export {
    Modal,
    ModalDialog,
    ModalHeader,
    ModalContent,
    ModalFooter,
    ModalClose,
    Dialog,
    DialogHeader,
    DialogContent,
    DialogFooter,
} from './modal.joy'
export type { ModalProps, ModalDialogProps } from './modal.joy'

export { Drawer, DrawerHeader, DrawerContent, DrawerFooter } from './drawer.joy'
export type { DrawerProps } from './drawer.joy'

export {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from './sheet.joy'
export type { SheetProps } from './sheet.joy'

export {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from './tooltip.joy'
export type { TooltipProps } from './tooltip.joy'

// Feedback
export { Alert, AlertTitle, AlertDescription } from './alert.joy'
export type { AlertProps } from './alert.joy'

export { Progress, LinearProgress, CircularProgress } from './progress.joy'
export type {
    ProgressProps,
    LinearProgressProps,
    CircularProgressProps,
} from './progress.joy'

export { Skeleton } from './skeleton.joy'
export type { SkeletonProps } from './skeleton.joy'

// Navigation helpers
export {
    Breadcrumbs,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from './breadcrumbs.joy'
export type { BreadcrumbsProps, BreadcrumbItemProps } from './breadcrumbs.joy'

export {
    List,
    ListItem,
    ListItemButton,
    ListItemContent,
    ListItemDecorator,
    ListDivider,
} from './list.joy'
export type { ListProps, ListItemProps, ListItemButtonProps } from './list.joy'

// Typography
export {
    Typography,
    H1,
    H2,
    H3,
    H4,
    P,
    Lead,
    Small,
    Muted,
} from './typography.joy'
export type { TypographyProps } from './typography.joy'

// Data display
export {
    Table,
    TableHead,
    TableBody,
    TableFooter,
    TableRow,
    TableCell,
    TableHeader,
    TableCaption,
    TableContainer,
} from './table.joy'
export type { TableProps } from './table.joy'

// Form controls - advanced
export { RadioGroup, Radio, RadioGroupItem } from './radio.joy'
export type { RadioGroupProps, RadioProps } from './radio.joy'

export { Switch, Toggle } from './switch.joy'
export type { SwitchProps } from './switch.joy'

export { Slider } from './slider.joy'
export type { SliderProps } from './slider.joy'

// Button variants
export { ButtonGroup, ToggleButtonGroup } from './button-group.joy'
export type {
    ButtonGroupProps,
    ToggleButtonGroupProps,
} from './button-group.joy'

// Utility
export { AspectRatio } from './aspect-ratio.joy'
export type { AspectRatioProps } from './aspect-ratio.joy'
