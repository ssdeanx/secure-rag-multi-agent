/**
 * Input Component - Joy UI Primitive
 *
 * Production-ready input field with form control integration,
 * custom focus ring, and full accessibility support.
 *
 * Features:
 * - Focus ring with 3:1 contrast ratio
 * - Form integration (FormControl, FormLabel, FormHelperText)
 * - Error state with aria-invalid
 * - Start/end decorators
 * - Auto-generated IDs for accessibility
 */

import * as React from 'react'
import JoyInput from '@mui/joy/Input'
import JoyFormControl from '@mui/joy/FormControl'
import JoyFormLabel from '@mui/joy/FormLabel'
import JoyFormHelperText from '@mui/joy/FormHelperText'
import type { SxProps } from '@mui/system'

export interface InputProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'size' | 'color'
    > {
    /**
     * The variant to use.
     * @default 'outlined'
     */
    variant?: 'solid' | 'soft' | 'outlined' | 'plain'

    /**
     * The size of the component.
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * The color of the component.
     * @default 'neutral'
     */
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'

    /**
     * If `true`, the component is disabled.
     * @default false
     */
    disabled?: boolean

    /**
     * If `true`, the input will indicate an error.
     * @default false
     */
    error?: boolean

    /**
     * If `true`, the component will take up the full width of its container.
     * @default false
     */
    fullWidth?: boolean

    /**
     * Element placed before the input.
     */
    startDecorator?: React.ReactNode

    /**
     * Element placed after the input.
     */
    endDecorator?: React.ReactNode

    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx?: SxProps
}

/**
 * Input component with custom focus ring matching Supabase green theme.
 *
 * @example
 * ```tsx
 * <Input placeholder="Enter your email" type="email" />
 * ```
 *
 * @example With decorators
 * ```tsx
 * <Input
 *   startDecorator={<SearchIcon />}
 *   placeholder="Search..."
 * />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        { variant = 'outlined', size = 'md', color = 'neutral', sx, ...props },
        ref
    ) => {
        return (
            <JoyInput
                ref={ref}
                variant={variant}
                size={size}
                color={color}
                slotProps={{
                    input: {
                        ref,
                    },
                }}
                sx={{
                    // Custom focus ring with Supabase green
                    '--Input-focusedInset': 'var(--any, )',
                    '--Input-focusedThickness': '2px',
                    '--Input-focusedHighlight':
                        'var(--joy-palette-primary-500)',
                    ...sx,
                }}
                {...props}
            />
        )
    }
)

Input.displayName = 'Input'

/**
 * FormControl component for grouping form elements.
 * Automatically handles ID generation and ARIA attributes.
 */
export interface FormControlProps {
    children: React.ReactNode
    /**
     * If `true`, the form control is disabled.
     */
    disabled?: boolean
    /**
     * If `true`, the form control will indicate an error.
     */
    error?: boolean
    /**
     * If `true`, the form control is required.
     */
    required?: boolean
    /**
     * The size of the component.
     */
    size?: 'sm' | 'md' | 'lg'
    /**
     * The color of the component.
     */
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    /**
     * The system prop for custom styles.
     */
    sx?: SxProps
}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
    (props, ref) => {
        return <JoyFormControl ref={ref} {...props} />
    }
)

FormControl.displayName = 'FormControl'

/**
 * FormLabel component for labeling form controls.
 * Automatically associates with form inputs via FormControl.
 */
export interface FormLabelProps {
    children: React.ReactNode
    /**
     * If `true`, an asterisk is displayed to indicate the field is required.
     */
    required?: boolean
    /**
     * The system prop for custom styles.
     */
    sx?: SxProps
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
    (props, ref) => {
        return <JoyFormLabel ref={ref} {...props} />
    }
)

FormLabel.displayName = 'FormLabel'

/**
 * FormHelperText component for providing additional context or error messages.
 * Automatically provides aria-describedby for accessibility.
 */
export interface FormHelperTextProps {
    children: React.ReactNode
    /**
     * The system prop for custom styles.
     */
    sx?: SxProps
}

const FormHelperText = React.forwardRef<HTMLDivElement, FormHelperTextProps>(
    (props, ref) => {
        return <JoyFormHelperText ref={ref} {...props} />
    }
)

FormHelperText.displayName = 'FormHelperText'

export { Input, FormControl, FormLabel, FormHelperText }
