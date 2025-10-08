'use client'

import * as React from 'react'
import { ToggleButtonGroup as JoyToggleButtonGroup } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface ToggleButtonGroupProps {
  children: React.ReactNode
  // allow null because MUI/Joy may pass null when clearing selection
  value?: string | string[] | null
  defaultValue?: string | string[] | null
  onChange?: (event: React.MouseEvent<HTMLElement>, value: string | string[] | null) => void
  variant?: 'plain' | 'outlined' | 'soft' | 'solid'
  color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  spacing?: number | string
  orientation?: 'horizontal' | 'vertical'
  sx?: SxProps
  className?: string
}

export const ToggleButtonGroup = React.forwardRef<HTMLDivElement, ToggleButtonGroupProps>(
  ({ 
    children, 
    value, 
    defaultValue,
    onChange, 
    variant = 'outlined', 
    color = 'neutral', 
    size = 'md',
    spacing,
    orientation = 'horizontal',
    sx, 
    className,
    ...props 
  }, ref) => {
    return (
      <JoyToggleButtonGroup
        ref={ref}
        value={value}
        onChange={onChange}
        variant={variant}
        color={color}
        size={size}
        spacing={spacing}
        orientation={orientation}
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
