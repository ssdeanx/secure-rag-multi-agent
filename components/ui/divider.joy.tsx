'use client'

import * as React from 'react'
import { Divider as JoyDivider } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface DividerProps {
  children?: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  sx?: SxProps
  className?: string
  inset?: 'none' | 'context' | 'startDecorator' | 'startContent'
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ children, orientation = 'horizontal', sx, className, inset, ...props }, ref) => {
    // map custom inset options to values accepted by JoyDivider
    const joyInset = ((): 'none' | 'context' | undefined => {
      if (!inset) return undefined
      if (inset === 'startDecorator' || inset === 'startContent') return 'context'
      // only 'none' | 'context' remain valid to pass through
      return inset as 'none' | 'context'
    })()

    return (
      <JoyDivider
        ref={ref}
        orientation={orientation}
        sx={sx}
        className={className}
        inset={joyInset}
        {...props}
      >
        {children}
      </JoyDivider>
    )
  }
)
Divider.displayName = 'Divider'

export const Separator = Divider
