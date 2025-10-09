'use client'

import * as React from 'react'
import { Alert as JoyAlert, Typography } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface AlertProps {
    children: React.ReactNode
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    size?: 'sm' | 'md' | 'lg'
    startDecorator?: React.ReactNode
    endDecorator?: React.ReactNode
    sx?: SxProps
    className?: string
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    (
        {
            children,
            variant = 'soft',
            color = 'neutral',
            size = 'md',
            startDecorator,
            endDecorator,
            sx,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyAlert
                ref={ref}
                variant={variant}
                color={color}
                size={size}
                startDecorator={startDecorator}
                endDecorator={endDecorator}
                sx={sx}
                className={className}
                {...props}
            >
                {children}
            </JoyAlert>
        )
    }
)
Alert.displayName = 'Alert'

export const AlertTitle = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; sx?: SxProps; className?: string }
>(({ children, sx, className, ...props }, ref) => {
    return (
        <Typography
            ref={ref}
            level="title-md"
            sx={{ mb: 0.5, ...sx }}
            className={className}
            {...props}
        >
            {children}
        </Typography>
    )
})
AlertTitle.displayName = 'AlertTitle'

export const AlertDescription = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; sx?: SxProps; className?: string }
>(({ children, sx, className, ...props }, ref) => {
    return (
        <Typography
            ref={ref}
            level="body-sm"
            sx={sx}
            className={className}
            {...props}
        >
            {children}
        </Typography>
    )
})
AlertDescription.displayName = 'AlertDescription'
