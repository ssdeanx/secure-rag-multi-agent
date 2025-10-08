/**
 * Button Component - Joy UI Primitive
 * 
 * Production-ready button with full TypeScript support, accessibility,
 * and integration with Supabase green theme.
 * 
 * Features:
 * - 4 variants: solid, soft, outlined, plain
 * - 3 sizes: sm, md, lg
 * - Loading state with aria-busy
 * - Icon decorators (start/end)
 * - Proper ref forwarding
 * - WCAG 2.1 AA compliant
 */
import * as React from 'react'
import JoyButton from '@mui/joy/Button'
import type { SxProps } from '@mui/system'

export interface ButtonProps
    extends Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        'color' | 'type'
    > {
    /**
     * The variant to use.
     * @default 'solid'
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
     * If `true`, the component is disabled.
     * @default false
     */
    disabled?: boolean

    /**
     * If `true`, the button will take up the full width of its container.
     * @default false
     */
    fullWidth?: boolean

    /**
     * If `true`, the button will show a loading indicator.
     * @default false
     */
    loading?: boolean

    /**
     * Element placed before the children.
     */
    startDecorator?: React.ReactNode

    /**
     * Element placed after the children.
     */
    endDecorator?: React.ReactNode

    /**
     * The component used for the root node (e.g., 'a' for links).
     * @default 'button'
     */
    component?: React.ElementType

    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx?: SxProps

    /**
     * The type of button.
     * @default 'button'
     */
    type?: 'button' | 'submit' | 'reset'

    /**
     * Aria label for accessibility (required for icon-only buttons).
     */
    'aria-label'?: string
}

/**
 * Button component that wraps MUI Joy Button with type-safe props.
 * 
 * @example
 * ```tsx
 * <Button variant="solid" color="primary">
 *   Click me
 * </Button>
 * ```
 * 
 * @example Icon button
 * ```tsx
 * <Button variant="outlined" aria-label="Delete">
 *   <DeleteIcon />
 * </Button>
 * ```
 * 
 * @example Loading button
 * ```tsx
 * <Button loading>
 *   Processing...
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'solid',
            size = 'md',
            color = 'primary',
            type = 'button',
            sx,
            ...props
        },
        ref
    ) => {
        return (
            <JoyButton
                ref={ref}
                variant={variant}
                size={size}
                color={color}
                type={type}
                sx={{
                    // Ensure minimum touch target for accessibility
                    minWidth: size === 'sm' ? '44px' : undefined,
                    minHeight: size === 'sm' ? '44px' : undefined,
                    ...sx,
                }}
                {...props}
            />
        )
    }
)

Button.displayName = 'Button'

export { Button }
