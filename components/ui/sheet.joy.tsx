'use client'

import * as React from 'react'
import { Sheet as JoySheet, ModalClose, Box } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface SheetProps {
    children: React.ReactNode
    open?: boolean
    onClose?: () => void
    sx?: SxProps
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
    (
        {
            children,
            open,
            onClose,
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
            <JoySheet
                ref={ref}
                sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: size === 'sm' ? 300 : size === 'lg' ? 500 : 400,
                    zIndex: 1300,
                    boxShadow: 'lg',
                    transform: open ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease-in-out',
                    overflowY: 'auto',
                    ...sx,
                }}
                variant={variant}
                color={color}
                className={className}
                {...props}
            >
                {onClose && (
                    <ModalClose
                        variant="plain"
                        sx={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                        }}
                        onClick={onClose}
                    />
                )}
                {children}
            </JoySheet>
        )
    }
)
Sheet.displayName = 'Sheet'

export const SheetContent = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; sx?: SxProps; className?: string }
>(({ children, sx, className, ...props }, ref) => {
    return (
        <Box
            ref={ref}
            component="div"
            className={className}
            {...props}
            sx={{ padding: '1.5rem', ...(sx as any) }}
        >
            {children}
        </Box>
    )
})
SheetContent.displayName = 'SheetContent'

export const SheetHeader = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; sx?: SxProps; className?: string }
>(({ children, sx, className, ...props }, ref) => {
    return (
        <Box
            ref={ref}
            component="div"
            className={className}
            {...props}
            sx={{ marginBottom: '1rem', ...(sx as any) }}
        >
            {children}
        </Box>
    )
})
SheetHeader.displayName = 'SheetHeader'

export const SheetTitle = React.forwardRef<
    HTMLHeadingElement,
    { children: React.ReactNode; sx?: SxProps; className?: string }
>(({ children, className, ...props }, ref) => {
    return (
        <Box
            ref={ref}
            component="h2"
            className={className}
            {...props}
            sx={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}
        >
            {children}
        </Box>
    )
})
SheetTitle.displayName = 'SheetTitle'

export const SheetDescription = React.forwardRef<
    HTMLParagraphElement,
    { children: React.ReactNode; sx?: SxProps; className?: string }
>(({ children, className, ...props }, ref) => {
    return (
        <Box
            ref={ref}
            component="p"
            className={className}
            {...props}
            sx={{
                fontSize: '0.875rem',
                color: 'var(--joy-palette-text-secondary)',
                margin: '0.5rem 0 0 0',
            }}
        >
            {children}
        </Box>
    )
})
SheetDescription.displayName = 'SheetDescription'
