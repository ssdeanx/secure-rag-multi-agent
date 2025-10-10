'use client'

import * as React from 'react'
import {
    Breadcrumbs as JoyBreadcrumbs,
    Link as JoyLink,
    Typography,
} from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface BreadcrumbsProps {
    children: React.ReactNode
    separator?: React.ReactNode
    sx?: SxProps
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export interface BreadcrumbItemProps {
    children: React.ReactNode
    href?: string
    current?: boolean
    sx?: SxProps
    className?: string
}

export const Breadcrumbs = React.forwardRef<HTMLOListElement, BreadcrumbsProps>(
    (
        { children, separator = '/', sx, size = 'md', className, ...props },
        ref
    ) => {
        return (
            <JoyBreadcrumbs
                ref={ref}
                separator={separator}
                sx={sx}
                size={size}
                className={className}
                {...props}
            >
                {children}
            </JoyBreadcrumbs>
        )
    }
)
Breadcrumbs.displayName = 'Breadcrumbs'

export const BreadcrumbItem = React.forwardRef<
    HTMLAnchorElement,
    BreadcrumbItemProps
>(({ children, href, current, sx, className, ...props }, ref) => {
    if (current || !href) {
        return (
            <Typography sx={sx} className={className} {...props}>
                {children}
            </Typography>
        )
    }

    return (
        <JoyLink
            ref={ref}
            href={href}
            sx={sx}
            className={className}
            underline="hover"
            color="neutral"
            {...props}
        >
            {children}
        </JoyLink>
    )
})
BreadcrumbItem.displayName = 'BreadcrumbItem'

export const BreadcrumbLink = BreadcrumbItem
export const BreadcrumbPage = React.forwardRef<
    HTMLSpanElement,
    { children: React.ReactNode; sx?: SxProps; className?: string }
>(({ children, sx, className, ...props }, ref) => {
    return (
        <Typography sx={sx} className={className} {...props}>
            {children}
        </Typography>
    )
})
BreadcrumbPage.displayName = 'BreadcrumbPage'

export const BreadcrumbSeparator = React.forwardRef<
    HTMLLIElement,
    { children?: React.ReactNode; sx?: SxProps; className?: string }
>(({ children, sx, className, ...props }, ref) => {
    return (
        <li
            ref={ref}
            aria-hidden="true"
            className={className}
            {...props}
            // Use inline aria/data attributes and rely on global CSS for user-select behavior
            // to satisfy the project's lint rule against inline style objects.
            data-no-select
        >
            {children || '/'}
        </li>
    )
})
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'
