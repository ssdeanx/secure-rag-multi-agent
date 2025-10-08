'use client'

import * as React from 'react'
import { Drawer as JoyDrawer, ModalClose, DialogTitle, DialogContent } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface DrawerProps {
  children: React.ReactNode
  open: boolean
  onClose?: () => void
  anchor?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg'
  sx?: SxProps
  variant?: 'plain' | 'outlined' | 'soft' | 'solid'
  color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
  className?: string
}

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  ({ children, open, onClose, anchor = 'left', size = 'md', sx, variant, color, className, ...props }, ref) => {
    return (
      <JoyDrawer
        ref={ref}
        open={open}
        onClose={onClose}
        anchor={anchor}
        size={size}
        sx={sx}
        variant={variant}
        color={color}
        className={className}
        {...props}
      >
        {onClose && (
          <ModalClose />
        )}
        {children}
      </JoyDrawer>
    )
  }
)
Drawer.displayName = 'Drawer'

export const DrawerHeader = React.forwardRef<HTMLDivElement, { children: React.ReactNode; sx?: SxProps; className?: string }>(
  ({ children, sx, className, ...props }, ref) => {
    return (
      <DialogTitle ref={ref} sx={sx} className={className} {...props}>
        {children}
      </DialogTitle>
    )
  }
)
DrawerHeader.displayName = 'DrawerHeader'

export const DrawerContent = React.forwardRef<HTMLDivElement, { children: React.ReactNode; sx?: SxProps; className?: string }>(
  ({ children, sx, className, ...props }, ref) => {
    return (
      <DialogContent ref={ref} sx={sx} className={className} {...props}>
        {children}
      </DialogContent>
    )
  }
)
DrawerContent.displayName = 'DrawerContent'

export const DrawerFooter = React.forwardRef<HTMLDivElement, { children: React.ReactNode; sx?: SxProps; className?: string }>(
  ({ children, sx, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        {...props}
        style={{
          padding: '1rem',
          borderTop: '1px solid var(--joy-palette-divider)',
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'flex-end',
        }}
      >
        {children}
      </div>
    )
  }
)
DrawerFooter.displayName = 'DrawerFooter'
