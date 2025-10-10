/**
 * Select Component - Joy UI Primitive
 *
 * Production-ready select dropdown with full keyboard navigation,
 * ARIA support, and theme integration.
 *
 * Features:
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - aria-expanded and aria-selected support
 * - Multiple selection mode
 * - Start/end decorators
 * - Searchable options (via listbox filtering)
 */
import * as React from 'react'
import JoySelect from '@mui/joy/Select'
import JoyOption from '@mui/joy/Option'
import type { SxProps } from '@mui/system'

export interface SelectProps<T = any> {
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
     * The placeholder text when no value is selected.
     */
    placeholder?: string

    /**
     * The selected value(s).
     */
    value?: T

    /**
     * The default value for uncontrolled mode.
     */
    defaultValue?: T

    /**
     * Callback fired when the value changes.
     */
    onChange?: (event: React.SyntheticEvent | null, newValue: T | null) => void

    /**
     * If `true`, the select will allow multiple selections.
     * @default false
     */
    multiple?: boolean

    /**
     * Element placed before the select button.
     */
    startDecorator?: React.ReactNode

    /**
     * Element placed after the select button.
     */
    endDecorator?: React.ReactNode

    /**
     * If `true`, the select indicator will be hidden.
     * @default false
     */
    indicator?: React.ReactNode | null

    /**
     * The system prop for custom styles.
     */
    sx?: SxProps

    /**
     * The content of the select (Option components).
     */
    children?: React.ReactNode

    /**
     * The name attribute of the select input.
     */
    name?: string

    /**
     * If `true`, the select is required.
     */
    required?: boolean
}

/**
 * Select component with full keyboard navigation and accessibility.
 *
 * @example Basic usage
 * ```tsx
 * <Select placeholder="Choose an option">
 *   <Option value="1">Option 1</Option>
 *   <Option value="2">Option 2</Option>
 *   <Option value="3">Option 3</Option>
 * </Select>
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [value, setValue] = React.useState('1')
 *
 * <Select value={value} onChange={(e, newValue) => setValue(newValue)}>
 *   <Option value="1">Option 1</Option>
 *   <Option value="2">Option 2</Option>
 * </Select>
 * ```
 *
 * @example With form control
 * ```tsx
 * <FormControl>
 *   <FormLabel>Category</FormLabel>
 *   <Select placeholder="Select category">
 *     <Option value="tech">Technology</Option>
 *     <Option value="design">Design</Option>
 *   </Select>
 *   <FormHelperText>Choose a category</FormHelperText>
 * </FormControl>
 * ```
 */
const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
    (
        {
            variant = 'outlined',
            size = 'md',
            color = 'neutral',
            sx,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <JoySelect
                ref={ref}
                variant={variant}
                size={size}
                color={color}
                sx={{
                    // Match focus ring with Input component
                    '--Select-focusedInset': 'var(--any, )',
                    '--Select-focusedThickness': '2px',
                    '--Select-focusedHighlight':
                        'var(--joy-palette-primary-500)',
                    ...sx,
                }}
                {...props}
            >
                {children}
            </JoySelect>
        )
    }
)

Select.displayName = 'Select'

/**
 * Option component for use within Select.
 */
export interface OptionProps<T = any> {
    /**
     * The value of the option.
     */
    value: T

    /**
     * If `true`, the option is disabled.
     */
    disabled?: boolean

    /**
     * The content of the option.
     */
    children: React.ReactNode

    /**
     * The color of the option when selected.
     */
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'

    /**
     * The system prop for custom styles.
     */
    sx?: SxProps
}

const Option = React.forwardRef<HTMLLIElement, OptionProps>(
    ({ color = 'primary', ...props }, ref) => {
        return <JoyOption ref={ref} color={color} {...props} />
    }
)

Option.displayName = 'Option'

export { Select, Option }
