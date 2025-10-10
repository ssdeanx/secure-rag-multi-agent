'use client'

import * as React from 'react'
import {
    ButtonGroup as JoyButtonGroup,
    ToggleButtonGroup as JoyToggleButtonGroup,
} from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface ButtonGroupProps {
    children: React.ReactNode
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    orientation?: 'horizontal' | 'vertical'
    spacing?: string | number
    buttonFlex?: string | number
    sx?: SxProps
    className?: string
}

export interface ToggleButtonGroupProps {
    children: React.ReactNode
    // Accept `null` because MUI ToggleButtonGroup onChange/value can be null when cleared
    value?: string | string[] | null
    onChange?: (
        event: React.MouseEvent<HTMLElement>,
        value: string | string[] | null
    ) => void
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    orientation?: 'horizontal' | 'vertical'
    spacing?: string | number
    buttonFlex?: string | number
    sx?: SxProps
    className?: string
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
    (
        {
            children,
            variant = 'outlined',
            color = 'neutral',
            size = 'md',
            disabled,
            orientation = 'horizontal',
            spacing,
            buttonFlex,
            sx,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyButtonGroup
                ref={ref}
                variant={variant}
                color={color}
                size={size}
                disabled={disabled}
                orientation={orientation}
                spacing={spacing}
                buttonFlex={buttonFlex}
                sx={sx}
                className={className}
                {...props}
            >
                {children}
            </JoyButtonGroup>
        )
    }
)
ButtonGroup.displayName = 'ButtonGroup'

export const ToggleButtonGroup = React.forwardRef<
    HTMLDivElement,
    ToggleButtonGroupProps
>(
    (
        {
            children,
            value,
            onChange,
            variant = 'outlined',
            color = 'neutral',
            size = 'md',
            disabled,
            orientation = 'horizontal',
            spacing,
            buttonFlex,
            sx,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyToggleButtonGroup
                ref={ref}
                value={value}
                onChange={onChange}
                variant={variant}
                color={color}
                size={size}
                disabled={disabled}
                orientation={orientation}
                spacing={spacing}
                buttonFlex={buttonFlex}
                sx={sx}
                className={className}
                {...props}
            >
                {children}
            </JoyToggleButtonGroup>
        )
    }
)
ToggleButtonGroup.displayName = 'ToggleButtonGroup'
