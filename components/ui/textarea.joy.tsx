/**
 * Textarea Component - Joy UI Primitive
 *
 * Production-ready textarea with auto-resize functionality,
 * custom focus ring, and full accessibility support.
 *
 * Features:
 * - Auto-resizing based on content
 * - minRows and maxRows configuration
 * - Custom focus ring matching theme
 * - Start/end decorators
 * - Form integration support
 */
// FIXM
import * as React from 'react'
import JoyTextarea from '@mui/joy/Textarea'
import type { SxProps } from '@mui/system'

export interface TextareaProps {
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
     * If `true`, the textarea will indicate an error.
     * @default false
     */
    error?: boolean

    /**
     * Minimum number of rows to display.
     * @default 3
     */
    minRows?: number

    /**
     * Maximum number of rows to display before scrolling.
     */
    maxRows?: number

    /**
     * Element placed before the textarea.
     */
    startDecorator?: React.ReactNode

    /**
     * Element placed after the textarea.
     */
    endDecorator?: React.ReactNode

    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx?: SxProps

    /**
     * The value of the textarea (for controlled components).
     */
    value?: string

    /**
     * The default value (for uncontrolled components).
     */
    defaultValue?: string

    /**
     * The placeholder text.
     */
    placeholder?: string

    /**
     * The name attribute.
     */
    name?: string

    /**
     * If `true`, the textarea is required.
     */
    required?: boolean

    /**
     * Number of columns.
     */
    cols?: number

    /**
     * Number of rows.
     */
    rows?: number

    /**
     * Callback fired when the value changes.
     */
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void

    /**
     * Callback fired when the textarea loses focus.
     */
    onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void

    /**
     * Callback fired when the textarea receives focus.
     */
    onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
}

/**
 * Textarea component with auto-resize and custom focus ring.
 * 
 * @example Basic usage
 * ```tsx
 * <Textarea 
 *   placeholder="Enter your message..." 
 *   minRows={3}
 *   maxRows={10}
 * />
 * ```
 * 
 * @example With error state
 * ```tsx
 * <FormControl error>
 *   <FormLabel>Description</FormLabel>
 *   <Textarea error />
 *   <FormHelperText>This field is required</FormHelperText>
 * </FormControl>
 * ```
 * 
 * @example With decorators
 * ```tsx
 * <Textarea
 *   endDecorator={
 *     <Box sx={{ display: 'flex', gap: 0.5 }}>
 *       <Button size="sm">Send</Button>
 *     </Box>
 *   }
 * />
 * ```
 */
const Textarea = React.forwardRef<HTMLDivElement, TextareaProps>(
    (
        {
            variant = 'outlined',
            size = 'md',
            color = 'neutral',
            minRows = 3,
            sx,
            ...props
        },
        ref
    ) => {
        return (
            <JoyTextarea
                ref={ref}
                variant={variant}
                size={size}
                color={color}
                minRows={minRows}
                sx={{
                    // Custom focus ring matching Input component
                    '--Textarea-focusedInset': 'var(--any, )',
                    '--Textarea-focusedThickness': '2px',
                    '--Textarea-focusedHighlight':
                        'var(--joy-palette-primary-500)',
                    ...sx,
                }}
                {...props}
            />
        )
    }
)

Textarea.displayName = 'Textarea'

export { Textarea }
