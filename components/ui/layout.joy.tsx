'use client'

import * as React from 'react'
import { Box as JoyBox, Grid as JoyGrid, Stack as JoyStack } from '@mui/joy'
import type { SxProps } from '@mui/system'

// Box Component
export type BoxProps = React.ComponentPropsWithoutRef<typeof JoyBox> & {
    children?: React.ReactNode
    sx?: SxProps
    component?: React.ElementType
    className?: string
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
    ({ children, sx, component = 'div', className, ...props }, ref) => {
        return (
            <JoyBox
                ref={ref}
                sx={sx}
                component={component}
                className={className}
                {...props}
            >
                {children}
            </JoyBox>
        )
    }
)
Box.displayName = 'Box'

// Grid Component
export interface GridProps {
    children?: React.ReactNode
    container?: boolean
    item?: boolean
    xs?: number | 'auto' | true
    sm?: number | 'auto' | true
    md?: number | 'auto' | true
    lg?: number | 'auto' | true
    xl?: number | 'auto' | true
    spacing?: number | string
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    sx?: SxProps
    className?: string
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    (
        {
            children,
            container,
            item,
            xs,
            sm,
            md,
            lg,
            xl,
            spacing,
            direction,
            sx,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyGrid
                ref={ref}
                container={container}
                xs={xs}
                sm={sm}
                md={md}
                lg={lg}
                xl={xl}
                spacing={spacing}
                direction={direction}
                sx={sx}
                className={className}
                {...props}
            >
                {children}
            </JoyGrid>
        )
    }
)
Grid.displayName = 'Grid'

// Stack Component
export interface StackProps {
    children?: React.ReactNode
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    spacing?: number | string
    divider?: React.ReactNode
    useFlexGap?: boolean
    sx?: SxProps
    className?: string
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
    (
        {
            children,
            direction = 'column',
            spacing = 2,
            divider,
            useFlexGap,
            sx,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyStack
                ref={ref}
                direction={direction}
                spacing={spacing}
                divider={divider}
                useFlexGap={useFlexGap}
                sx={sx}
                className={className}
                {...props}
            >
                {children}
            </JoyStack>
        )
    }
)
Stack.displayName = 'Stack'
