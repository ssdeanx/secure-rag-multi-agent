/**
 * Chip Component - Joy UI Primitive (Badge Alternative)
 * 
 * Production-ready chip/badge component for status indicators,
 * tags, and labels with full theme integration.
 * 
 * Features:
 * - 4 variants: solid, soft, outlined, plain
 * - 3 sizes: sm, md, lg
 * - Start/end decorators (icons)
 * - Delete functionality
 * - Color variants matching theme
 */
import * as React from 'react'
import JoyChip from '@mui/joy/Chip'
import type { SxProps } from '@mui/system'

export interface ChipProps {
    /**
     * The variant to use.
     * @default 'soft'
     */
    variant?: 'solid' | 'soft' | 'outlined' | 'plain'

    /**
     * The size of the component.
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * The color of the component.
     * @default 'primary'
     */
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'

    /**
     * If `true`, the chip is disabled.
     * @default false
     */
    disabled?: boolean

    /**
     * The content of the chip.
     */
    children: React.ReactNode

    /**
     * Element placed before the children.
     */
    startDecorator?: React.ReactNode

    /**
     * Element placed after the children.
     */
    endDecorator?: React.ReactNode

    /**
     * Callback fired when the delete icon is clicked.
     * If set, the delete icon will be shown.
     */
    onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void

    /**
     * If `true`, the chip will be clickable.
     */
    onClick?: (event: React.MouseEvent) => void

    /**
     * The component used for the root node.
     */
    component?: React.ElementType

    /**
     * The system prop for custom styles.
     */
    sx?: SxProps
}

/**
 * Chip component for badges, tags, and status indicators.
 * 
 * @example Basic badge
 * ```tsx
 * <Chip variant="soft" color="primary">
 *   New
 * </Chip>
 * ```
 * 
 * @example Status indicator
 * ```tsx
 * <Chip variant="solid" color="success">
 *   Active
 * </Chip>
 * ```
 * 
 * @example With delete
 * ```tsx
 * <Chip 
 *   variant="outlined"
 *   onDelete={() => console.log('Delete clicked')}
 * >
 *   Removable
 * </Chip>
 * ```
 * 
 * @example With icon
 * ```tsx
 * <Chip 
 *   variant="soft"
 *   startDecorator={<CheckIcon />}
 *   color="success"
 * >
 *   Verified
 * </Chip>
 * ```
 * 
 * @example Clickable
 * ```tsx
 * <Chip 
 *   variant="outlined"
 *   onClick={() => console.log('Clicked')}
 *   component="button"
 * >
 *   Click me
 * </Chip>
 * ```
 */
const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
    ({ variant = 'soft', size = 'md', color = 'primary', sx, ...props }, ref) => {
        return (
            <JoyChip
                ref={ref}
                variant={variant}
                size={size}
                color={color}
                sx={sx}
                {...props}
            />
        )
    }
)

Chip.displayName = 'Chip'

/**
 * Badge is an alias for Chip to maintain compatibility with Shadcn naming. Who cares? about the name. shadcn-ui is going to be replaced anyway.
 */
const Badge = Chip

export { Chip, Badge }
