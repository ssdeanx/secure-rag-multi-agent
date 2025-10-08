'use client'

import * as React from 'react'
import { Tooltip as JoyTooltip } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface TooltipProps {
  children: React.ReactElement
  title: React.ReactNode
  arrow?: boolean
  open?: boolean
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end'
  variant?: 'plain' | 'outlined' | 'soft' | 'solid'
  color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  sx?: SxProps
  className?: string
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, title, arrow = true, open, placement = 'top', variant = 'solid', color = 'neutral', size = 'sm', sx, className, ...props }, ref) => {
    return (
      <JoyTooltip
        title={title}
        arrow={arrow}
        open={open}
        placement={placement}
        variant={variant}
        color={color}
        size={size}
        sx={sx}
        className={className}
        {...props}
      >
        {children}
      </JoyTooltip>
    )
  }
)
Tooltip.displayName = 'Tooltip'

// Shadcn compatibility exports
export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

export const TooltipTrigger: React.FC<{ children: React.ReactElement; asChild?: boolean }> = ({ children, asChild }) => {
  return children
}

export const TooltipContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}
