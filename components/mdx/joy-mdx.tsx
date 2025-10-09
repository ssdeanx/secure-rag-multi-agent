import * as React from 'react'
import { Typography, Link as JoyLink, Box } from '@/components/ui/joy'

// MDX → Joy UI component mapping (no Next.js Link, no legacyBehavior)
// Render children explicitly to satisfy Typography typings.

type WithChildren<T> = Omit<T, 'color'> & { children?: React.ReactNode }

export const joyMdxComponents = {
    h1: ({
        children,
        ...rest
    }: WithChildren<React.HTMLAttributes<HTMLHeadingElement>>) => (
        <Typography level="h1" sx={{ mt: 4, mb: 2, fontWeight: 800 }} {...rest}>
            {children}
        </Typography>
    ),
    h2: ({
        children,
        ...rest
    }: WithChildren<React.HTMLAttributes<HTMLHeadingElement>>) => (
        <Typography level="h2" sx={{ mt: 4, mb: 2, fontWeight: 700 }} {...rest}>
            {children}
        </Typography>
    ),
    h3: ({
        children,
        ...rest
    }: WithChildren<React.HTMLAttributes<HTMLHeadingElement>>) => (
        <Typography
            level="h3"
            sx={{ mt: 3, mb: 1.5, fontWeight: 700 }}
            {...rest}
        >
            {children}
        </Typography>
    ),
    h4: ({
        children,
        ...rest
    }: WithChildren<React.HTMLAttributes<HTMLHeadingElement>>) => (
        <Typography level="h4" sx={{ mt: 3, mb: 1, fontWeight: 600 }} {...rest}>
            {children}
        </Typography>
    ),
    p: ({
        children,
        ...rest
    }: WithChildren<React.HTMLAttributes<HTMLParagraphElement>>) => (
        <Typography
            level="body-md"
            sx={{ my: 1.5, lineHeight: 1.75 }}
            {...rest}
        >
            {children}
        </Typography>
    ),
    a: ({
        href = '#',
        children,
        ...rest
    }: WithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
        <JoyLink href={href} {...rest}>
            {children}
        </JoyLink>
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
        <Box
            component="ul"
            sx={{ pl: 3, my: 1.5, listStyle: 'disc' }}
            {...props}
        />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
        <Box
            component="ol"
            sx={{ pl: 3, my: 1.5, listStyle: 'decimal' }}
            {...props}
        />
    ),
    li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
        <Box component="li" sx={{ my: 0.5 }} {...props} />
    ),
    blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
        <Box
            component="blockquote"
            sx={{
                borderLeft: '4px solid',
                borderColor: 'primary.300',
                pl: 2,
                my: 2,
                color: 'text.secondary',
            }}
            {...props}
        />
    ),
    code: ({
        children,
        ...rest
    }: WithChildren<React.HTMLAttributes<HTMLElement>>) => (
        <Box
            component="code"
            sx={{
                fontFamily: 'var(--joy-fontFamily-code)',
                fontSize: 'sm',
                bgcolor: 'neutral.100',
                px: 0.75,
                py: 0.25,
                borderRadius: 'sm',
            }}
            {...rest}
        >
            {children}
        </Box>
    ),
    pre: ({
        children,
        ...rest
    }: WithChildren<React.HTMLAttributes<HTMLPreElement>>) => (
        <Box
            component="pre"
            sx={{
                fontFamily: 'var(--joy-fontFamily-code)',
                fontSize: 'sm',
                bgcolor: 'neutral.100',
                p: 2,
                borderRadius: 'sm',
                overflowX: 'auto',
                my: 2,
            }}
            {...rest}
        >
            {children}
        </Box>
    ),
}

export type JoyMdxComponents = typeof joyMdxComponents
