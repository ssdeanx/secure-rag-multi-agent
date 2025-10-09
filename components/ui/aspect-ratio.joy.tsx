'use client'

import * as React from 'react'
import { AspectRatio as JoyAspectRatio } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface AspectRatioProps {
  children: React.ReactNode
  ratio?: string | number
  minHeight?: number | string
  maxHeight?: number | string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  variant?: 'plain' | 'outlined' | 'soft' | 'solid'
  color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
  sx?: SxProps
  className?: string
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ children, ratio = '16/9', minHeight, maxHeight, objectFit = 'cover', variant, color, sx, className, ...props }, ref) => {
    return (
      <JoyAspectRatio
        ref={ref}
        ratio={ratio}
        minHeight={minHeight}
        maxHeight={maxHeight}
        objectFit={objectFit}
        variant={variant}
        color={color}
        sx={sx}
        className={className}
        {...props}
      >
        {children}
      </JoyAspectRatio>
    )
  }
)
AspectRatio.displayName = 'AspectRatio'
