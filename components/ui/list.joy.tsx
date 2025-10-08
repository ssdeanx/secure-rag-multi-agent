'use client'

import * as React from 'react'
import { List as JoyList, ListItem as JoyListItem, ListItemButton as JoyListItemButton, ListItemContent, ListItemDecorator, ListDivider } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface ListProps {
  children: React.ReactNode
  variant?: 'plain' | 'outlined' | 'soft' | 'solid'
  color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  sx?: SxProps
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export interface ListItemProps {
  children: React.ReactNode
  sx?: SxProps
  className?: string
  nested?: boolean
  sticky?: boolean
}

export interface ListItemButtonProps {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent) => void
  selected?: boolean
  disabled?: boolean
  variant?: 'plain' | 'outlined' | 'soft' | 'solid'
  color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
  sx?: SxProps
  className?: string
}

export const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ children, variant, color, size = 'md', sx, className, orientation, ...props }, ref) => {
    return (
      <JoyList
        ref={ref}
        variant={variant}
        color={color}
        size={size}
        sx={sx}
        className={className}
        orientation={orientation}
        {...props}
      >
        {children}
      </JoyList>
    )
  }
)
List.displayName = 'List'

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, sx, className, nested, sticky, ...props }, ref) => {
    return (
      <JoyListItem
        ref={ref}
        sx={sx}
        className={className}
        nested={nested}
        sticky={sticky}
        {...props}
      >
        {children}
      </JoyListItem>
    )
  }
)
ListItem.displayName = 'ListItem'

export const ListItemButton = React.forwardRef<HTMLDivElement, ListItemButtonProps>(
  ({ children, onClick, selected, disabled, variant, color, sx, className, ...props }, ref) => {
    return (
      <JoyListItemButton
        ref={ref}
        onClick={onClick}
        selected={selected}
        disabled={disabled}
        variant={variant}
        color={color}
        sx={sx}
        className={className}
        {...props}
      >
        {children}
      </JoyListItemButton>
    )
  }
)
ListItemButton.displayName = 'ListItemButton'

export { ListItemContent, ListItemDecorator, ListDivider }
