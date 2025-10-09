'use client'

import * as React from 'react'
import { Skeleton as JoySkeleton } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'inline' | 'overlay'
  animation?: 'pulse' | 'wave' | false
  width?: number | string
  height?: number | string
  sx?: SxProps
  className?: string
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'title-lg' | 'title-md' | 'title-sm' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs'
  children?: React.ReactNode
}

export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(
  ({ variant = 'text', animation = 'pulse', width, height, sx, className, level, children, ...props }, ref) => {
    return (
      <JoySkeleton
        ref={ref}
        variant={variant}
        animation={animation}
        width={width}
        height={height}
        sx={sx}
        className={className}
        level={level}
        {...props}
      >
        {children}
      </JoySkeleton>
    )
  }
)
Skeleton.displayName = 'Skeleton'
