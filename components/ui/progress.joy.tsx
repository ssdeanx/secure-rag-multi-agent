'use client'

import * as React from 'react'
import { LinearProgress as JoyLinearProgress, CircularProgress as JoyCircularProgress } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface ProgressProps {
  value?: number
  variant?: 'plain' | 'outlined' | 'soft' | 'solid'
  color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  determinate?: boolean
  sx?: SxProps
  className?: string
  thickness?: number
}

export interface LinearProgressProps extends ProgressProps {
  type?: 'linear'
}

export interface CircularProgressProps extends ProgressProps {
  type?: 'circular'
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, variant = 'soft', color = 'primary', size = 'md', determinate = true, sx, className, thickness, ...props }, ref) => {
    return (
      <JoyLinearProgress
        ref={ref}
        value={value}
        variant={variant}
        color={color}
        size={size}
        determinate={determinate}
        sx={sx}
        className={className}
        thickness={thickness}
        {...props}
      />
    )
  }
)
Progress.displayName = 'Progress'

export const LinearProgress = React.forwardRef<HTMLDivElement, LinearProgressProps>(
  ({ value, variant = 'soft', color = 'primary', size = 'md', determinate = true, sx, className, thickness, ...props }, ref) => {
    return (
      <JoyLinearProgress
        ref={ref}
        value={value}
        variant={variant}
        color={color}
        size={size}
        determinate={determinate}
        sx={sx}
        className={className}
        thickness={thickness}
        {...props}
      />
    )
  }
)
LinearProgress.displayName = 'LinearProgress'

export const CircularProgress = React.forwardRef<HTMLSpanElement, CircularProgressProps>(
  ({ value, variant = 'soft', color = 'primary', size = 'md', determinate = true, sx, className, thickness, ...props }, ref) => {
    return (
      <JoyCircularProgress
        ref={ref}
        value={value}
        variant={variant}
        color={color}
        size={size}
        determinate={determinate}
        sx={sx}
        className={className}
        thickness={thickness}
        {...props}
      />
    )
  }
)
CircularProgress.displayName = 'CircularProgress'
