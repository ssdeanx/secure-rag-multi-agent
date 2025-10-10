'use client'

import * as React from 'react'
import { Link as JoyLink } from '@mui/joy'
import type { SxProps } from '@mui/system'
import NextLink from 'next/link'

export interface LinkProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
    children: React.ReactNode
    href: string
    sx?: SxProps
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    level?:
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'title-lg'
        | 'title-md'
        | 'title-sm'
        | 'body-lg'
        | 'body-md'
        | 'body-sm'
        | 'body-xs'
    underline?: 'none' | 'hover' | 'always'
    disabled?: boolean
    startDecorator?: React.ReactNode
    endDecorator?: React.ReactNode
    className?: string
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
    (
        {
            children,
            href,
            sx,
            variant = 'plain',
            color = 'primary',
            level = 'body-md',
            underline = 'hover',
            disabled,
            startDecorator,
            endDecorator,
            className,
            ...props
        },
        ref
    ) => {
        const isExternal =
            href.startsWith('http') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:')

        if (isExternal) {
            return (
                <JoyLink
                    ref={ref}
                    href={href}
                    sx={sx}
                    variant={variant}
                    color={color}
                    level={level}
                    underline={underline}
                    disabled={disabled}
                    startDecorator={startDecorator}
                    endDecorator={endDecorator}
                    className={className}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                >
                    {children}
                </JoyLink>
            )
        }

        return (
            <JoyLink
                ref={ref}
                component={NextLink}
                href={href}
                sx={sx}
                variant={variant}
                color={color}
                level={level}
                underline={underline}
                disabled={disabled}
                startDecorator={startDecorator}
                endDecorator={endDecorator}
                className={className}
                {...props}
            >
                {children}
            </JoyLink>
        )
    }
)
Link.displayName = 'Link'
