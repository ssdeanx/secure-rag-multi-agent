'use client'

import * as React from 'react'
import { Slider as JoySlider } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface SliderProps {
    value?: number | number[]
    defaultValue?: number | number[]
    onChange?: (event: Event, value: number | number[]) => void
    onChangeCommitted?: (
        event: React.SyntheticEvent | Event,
        value: number | number[]
    ) => void
    min?: number
    max?: number
    step?: number | null
    marks?: boolean | Array<{ value: number; label?: string }>
    disabled?: boolean
    orientation?: 'horizontal' | 'vertical'
    track?: 'normal' | false | 'inverted'
    valueLabelDisplay?: 'auto' | 'on' | 'off'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    size?: 'sm' | 'md' | 'lg'
    sx?: SxProps
    className?: string
}

export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
    (
        {
            value,
            defaultValue,
            onChange,
            onChangeCommitted,
            min = 0,
            max = 100,
            step = 1,
            marks,
            disabled,
            orientation = 'horizontal',
            track = 'normal',
            valueLabelDisplay = 'auto',
            color = 'primary',
            variant = 'solid',
            size = 'md',
            sx,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoySlider
                ref={ref}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                onChangeCommitted={onChangeCommitted}
                min={min}
                max={max}
                step={step}
                marks={marks}
                disabled={disabled}
                orientation={orientation}
                track={track}
                valueLabelDisplay={valueLabelDisplay}
                color={color}
                variant={variant}
                size={size}
                sx={sx}
                className={className}
                {...props}
            />
        )
    }
)
Slider.displayName = 'Slider'
