'use client'

import * as React from 'react'
import { Switch as JoySwitch } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface SwitchProps {
    checked?: boolean
    defaultChecked?: boolean
    disabled?: boolean
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    size?: 'sm' | 'md' | 'lg'
    startDecorator?: React.ReactNode
    endDecorator?: React.ReactNode
    sx?: SxProps
    className?: string
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    (
        {
            checked,
            defaultChecked,
            disabled,
            onChange,
            color = 'primary',
            variant = 'solid',
            size = 'md',
            startDecorator,
            endDecorator,
            sx,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoySwitch
                ref={ref}
                checked={checked}
                defaultChecked={defaultChecked}
                disabled={disabled}
                onChange={onChange}
                color={color}
                variant={variant}
                size={size}
                startDecorator={startDecorator}
                endDecorator={endDecorator}
                sx={sx}
                className={className}
                {...props}
            />
        )
    }
)
Switch.displayName = 'Switch'

export const Toggle = Switch
