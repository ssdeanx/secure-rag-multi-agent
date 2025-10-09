/**
 * Checkbox Component - Joy UI Primitive
 * 
 * Production-ready checkbox with proper label association,
 * indeterminate state, and full accessibility support.
 * 
 * Features:
 * - Proper label association via FormControl
 * - Indeterminate state (aria-checked="mixed")
 * - Custom focus ring
 * - Icon customization
 * - Disabled state support
 */
import * as React from 'react'
import JoyCheckbox from '@mui/joy/Checkbox'
import type { SxProps } from '@mui/system'

export interface CheckboxProps
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
     * @default 'primary'
     */
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'

    /**
     * If `true`, the component is disabled.
     * @default false
     */
    disabled?: boolean

    /**
     * If `true`, the component appears indeterminate.
     * This does not set the native input element to indeterminate due
     * to inconsistent behavior across browsers.
     * However, we set a data-indeterminate attribute on the input.
     * @default false
     */
    indeterminate?: boolean

    /**
     * If `true`, the component is checked.
     */
    checked?: boolean

    /**
     * The default checked state. Use when the component is not controlled.
     */
    defaultChecked?: boolean

    /**
     * Callback fired when the state is changed.
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void

    /**
     * The label content.
     */
    label?: React.ReactNode

    /**
     * If `true`, the label will appear before the checkbox.
     * @default false
     */
    labelPlacement?: 'start' | 'end'

    /**
     * The icon to display when the component is checked.
     */
    checkedIcon?: React.ReactNode

    /**
     * The icon to display when the component is unchecked.
     */
    uncheckedIcon?: React.ReactNode

    /**
     * The icon to display when the component is indeterminate.
     */
    indeterminateIcon?: React.ReactNode

    /**
     * If `true`, the checkbox will be required.
     */
    required?: boolean

    /**
     * The name attribute of the input element.
     */
    name?: string

    /**
     * The value attribute of the input element.
     */
    value?: string

    /**
     * The system prop for custom styles.
     */
    sx?: SxProps
}

/**
 * Checkbox component with proper label association and indeterminate state.
 * 
 * @example Basic usage
 * ```tsx
 * <Checkbox label="Accept terms and conditions" />
 * ```
 * 
 * @example Controlled
 * ```tsx
 * const [checked, setChecked] = React.useState(false)
 * 
 * <Checkbox 
 *   checked={checked}
 *   onChange={(e) => setChecked(e.target.checked)}
 *   label="Subscribe to newsletter"
 * />
 * ```
 * 
 * @example Indeterminate state
 * ```tsx
 * <Checkbox 
 *   indeterminate
 *   label="Select all"
 * />
 * ```
 * 
 * @example With form control
 * ```tsx
 * <FormControl>
 *   <Checkbox 
 *     required
 *     label="I agree to the terms"
 *   />
 *   <FormHelperText>Required field</FormHelperText>
 * </FormControl>
 * ```
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            variant = 'outlined',
            size = 'md',
            color = 'primary',
            labelPlacement = 'end',
            sx,
            ...props
        },
        ref
    ) => {
        return (
            <JoyCheckbox
                ref={ref}
                variant={variant}
                size={size}
                color={color}
                slotProps={{
                    input: {
                        ref,
                    },
                    action: {
                        sx: {
                            // Custom focus ring
                            '&:focus-visible': {
                                outline: '2px solid',
                                outlineColor: 'var(--joy-palette-primary-500)',
                                outlineOffset: '2px',
                            },
                        },
                    },
                }}
                sx={{
                    // Ensure minimum touch target
                    minWidth: '44px',
                    minHeight: '44px',
                    ...sx,
                }}
                {...props}
            />
        )
    }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
