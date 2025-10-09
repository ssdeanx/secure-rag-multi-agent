'use client'

import * as React from 'react'
import {
    Tabs as JoyTabs,
    TabList as JoyTabList,
    Tab as JoyTab,
    TabPanel as JoyTabPanel,
} from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface TabsProps {
    children: React.ReactNode
    defaultValue?: string | number
    value?: string | number
    onChange?: (
        event: React.SyntheticEvent | null,
        value: string | number | null
    ) => void
    orientation?: 'horizontal' | 'vertical'
    sx?: SxProps
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export interface TabListProps {
    children: React.ReactNode
    sx?: SxProps
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    size?: 'sm' | 'md' | 'lg'
    sticky?: 'top' | 'bottom'
    className?: string
}

export interface TabProps {
    children: React.ReactNode
    value: string | number
    disabled?: boolean
    sx?: SxProps
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    indicatorPlacement?: 'top' | 'bottom' | 'left' | 'right'
    className?: string
}

export interface TabPanelProps {
    children: React.ReactNode
    value: string | number
    sx?: SxProps
    className?: string
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    (
        {
            children,
            defaultValue,
            value,
            onChange,
            orientation = 'horizontal',
            sx,
            variant,
            color,
            size = 'md',
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyTabs
                ref={ref}
                defaultValue={defaultValue}
                value={value}
                onChange={onChange}
                orientation={orientation}
                sx={sx}
                variant={variant}
                color={color}
                size={size}
                className={className}
                {...props}
            >
                {children}
            </JoyTabs>
        )
    }
)
Tabs.displayName = 'Tabs'

export const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
    (
        { children, sx, variant, color, size, sticky, className, ...props },
        ref
    ) => {
        return (
            <JoyTabList
                ref={ref}
                sx={sx}
                variant={variant}
                color={color}
                size={size}
                sticky={sticky}
                className={className}
                {...props}
            >
                {children}
            </JoyTabList>
        )
    }
)
TabList.displayName = 'TabList'

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
    (
        {
            children,
            value,
            disabled,
            sx,
            variant,
            color,
            indicatorPlacement,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyTab
                ref={ref}
                value={value}
                disabled={disabled}
                sx={sx}
                variant={variant}
                color={color}
                indicatorPlacement={indicatorPlacement}
                className={className}
                {...props}
            >
                {children}
            </JoyTab>
        )
    }
)
Tab.displayName = 'Tab'

export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
    ({ children, value, sx, className, ...props }, ref) => {
        return (
            <JoyTabPanel
                ref={ref}
                value={value}
                sx={sx}
                className={className}
                {...props}
            >
                {children}
            </JoyTabPanel>
        )
    }
)
TabPanel.displayName = 'TabPanel'
