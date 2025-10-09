'use client'

import * as React from 'react'
import { Radio as JoyRadio, RadioGroup as JoyRadioGroup } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface RadioGroupProps {
    children: React.ReactNode
    value?: string
    defaultValue?: string
    name?: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    orientation?: 'horizontal' | 'vertical'
    overlay?: boolean
    disableIcon?: boolean
    size?: 'sm' | 'md' | 'lg'
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    sx?: SxProps
    className?: string
}

export interface RadioProps {
    children?: React.ReactNode
    value: string
    label?: string
    disabled?: boolean
    checked?: boolean
    size?: 'sm' | 'md' | 'lg'
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    overlay?: boolean
    disableIcon?: boolean
    sx?: SxProps
    className?: string
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    (
        {
            children,
            value,
            defaultValue,
            name,
            onChange,
            orientation = 'vertical',
            overlay,
            disableIcon,
            size = 'md',
            variant,
            color,
            sx,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyRadioGroup
                ref={ref}
                value={value}
                defaultValue={defaultValue}
                name={name}
                onChange={onChange}
                orientation={orientation}
                overlay={overlay}
                disableIcon={disableIcon}
                size={size}
                variant={variant}
                color={color}
                sx={sx}
                className={className}
                {...props}
            >
                {children}
            </JoyRadioGroup>
        )
    }
)
RadioGroup.displayName = 'RadioGroup'

export const Radio = React.forwardRef<HTMLSpanElement, RadioProps>(
    (
        {
            children,
            value,
            label,
            disabled,
            checked,
            size = 'md',
            variant,
            color,
            overlay,
            disableIcon,
            sx,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyRadio
                ref={ref}
                value={value}
                label={label || children}
                disabled={disabled}
                checked={checked}
                size={size}
                variant={variant}
                color={color}
                overlay={overlay}
                disableIcon={disableIcon}
                sx={sx}
                className={className}
                {...props}
            />
        )
    }
)
Radio.displayName = 'Radio'

export const RadioGroupItem = Radio
