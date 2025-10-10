'use client'

import * as React from 'react'
import {
    Menu as JoyMenu,
    MenuItem as JoyMenuItem,
    MenuButton as JoyMenuButton,
    Dropdown as JoyDropdown,
    Divider,
    ListItemDecorator,
} from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface MenuProps {
    children: React.ReactNode
    sx?: SxProps
    placement?:
        | 'bottom-start'
        | 'bottom-end'
        | 'top-start'
        | 'top-end'
        | 'left-start'
        | 'left-end'
        | 'right-start'
        | 'right-end'
    size?: 'sm' | 'md' | 'lg'
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    className?: string
}

export interface MenuItemProps {
    children: React.ReactNode
    onClick?: (event: React.MouseEvent) => void
    disabled?: boolean
    selected?: boolean
    sx?: SxProps
    className?: string
}

export interface DropdownProps {
    children: React.ReactNode
    className?: string
}

export interface MenuButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    sx?: SxProps
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
    ({ children, className, ...props }, ref) => {
        return <JoyDropdown {...props}>{children}</JoyDropdown>
    }
)
Dropdown.displayName = 'Dropdown'

export const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
    (
        {
            children,
            sx,
            variant = 'outlined',
            color = 'neutral',
            size = 'md',
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyMenuButton
                ref={ref}
                sx={sx}
                variant={variant}
                color={color}
                size={size}
                className={className}
                {...props}
            >
                {children}
            </JoyMenuButton>
        )
    }
)
MenuButton.displayName = 'MenuButton'

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
    (
        {
            children,
            sx,
            placement = 'bottom-start',
            size = 'md',
            variant = 'outlined',
            color = 'neutral',
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyMenu
                ref={ref}
                sx={sx}
                placement={placement}
                size={size}
                variant={variant}
                color={color}
                className={className}
                {...props}
            >
                {children}
            </JoyMenu>
        )
    }
)
Menu.displayName = 'Menu'

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
    (
        { children, onClick, disabled, selected, sx, className, ...props },
        ref
    ) => {
        return (
            <JoyMenuItem
                ref={ref}
                onClick={onClick}
                disabled={disabled}
                selected={selected}
                sx={sx}
                className={className}
                {...props}
            >
                {children}
            </JoyMenuItem>
        )
    }
)
MenuItem.displayName = 'MenuItem'

export const MenuDivider = React.forwardRef<
    HTMLHRElement,
    { sx?: SxProps; className?: string }
>(({ sx, className, ...props }, ref) => {
    return <Divider ref={ref} sx={sx} className={className} {...props} />
})
MenuDivider.displayName = 'MenuDivider'

export { ListItemDecorator as MenuItemDecorator }
