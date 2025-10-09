'use client'

import * as React from 'react'
import { Typography as JoyTypography } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface TypographyProps {
    children: React.ReactNode
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
    component?: React.ElementType
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    noWrap?: boolean
    gutterBottom?: boolean
    sx?: SxProps
    className?: string
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    (
        {
            children,
            level = 'body-md',
            component,
            color,
            variant,
            noWrap,
            gutterBottom,
            sx,
            className,
            ...props
        },
        ref
    ) => {
        const typographyProps: any = {
            ref,
            level,
            color,
            variant,
            noWrap,
            gutterBottom,
            sx,
            className,
            ...props,
        }

        if (component) {
            typographyProps.component = component
        }

        return <JoyTypography {...typographyProps}>{children}</JoyTypography>
    }
)
Typography.displayName = 'Typography'

// Convenience exports for common typography patterns
export const H1 = React.forwardRef<
    HTMLHeadingElement,
    Omit<TypographyProps, 'level'>
>((props, ref) => <Typography ref={ref} level="h1" component="h1" {...props} />)
H1.displayName = 'H1'

export const H2 = React.forwardRef<
    HTMLHeadingElement,
    Omit<TypographyProps, 'level'>
>((props, ref) => <Typography ref={ref} level="h2" component="h2" {...props} />)
H2.displayName = 'H2'

export const H3 = React.forwardRef<
    HTMLHeadingElement,
    Omit<TypographyProps, 'level'>
>((props, ref) => <Typography ref={ref} level="h3" component="h3" {...props} />)
H3.displayName = 'H3'

export const H4 = React.forwardRef<
    HTMLHeadingElement,
    Omit<TypographyProps, 'level'>
>((props, ref) => <Typography ref={ref} level="h4" component="h4" {...props} />)
H4.displayName = 'H4'

export const P = React.forwardRef<
    HTMLParagraphElement,
    Omit<TypographyProps, 'level'>
>((props, ref) => (
    <Typography ref={ref} level="body-md" component="p" {...props} />
))
P.displayName = 'P'

export const Lead = React.forwardRef<
    HTMLParagraphElement,
    Omit<TypographyProps, 'level'>
>((props, ref) => (
    <Typography ref={ref} level="body-lg" component="p" {...props} />
))
Lead.displayName = 'Lead'

export const Small = React.forwardRef<
    HTMLElement,
    Omit<TypographyProps, 'level'>
>((props, ref) => (
    <Typography ref={ref} level="body-sm" component="small" {...props} />
))
Small.displayName = 'Small'

export const Muted = React.forwardRef<
    HTMLParagraphElement,
    Omit<TypographyProps, 'level'>
>((props, ref) => (
    <Typography
        ref={ref}
        level="body-sm"
        color="neutral"
        component="p"
        sx={{ opacity: 0.7 }}
        {...props}
    />
))
Muted.displayName = 'Muted'
