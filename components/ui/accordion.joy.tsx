'use client'

import * as React from 'react'
import {
    Accordion as JoyAccordion,
    AccordionDetails as JoyAccordionDetails,
    AccordionGroup as JoyAccordionGroup,
    AccordionSummary as JoyAccordionSummary,
} from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface AccordionGroupProps {
    children: React.ReactNode
    sx?: SxProps
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    size?: 'sm' | 'md' | 'lg'
    disableDivider?: boolean
    className?: string
}

export interface AccordionProps {
    children: React.ReactNode
    sx?: SxProps
    disabled?: boolean
    expanded?: boolean
    defaultExpanded?: boolean
    onChange?: (event: React.SyntheticEvent, expanded: boolean) => void
    className?: string
}

export interface AccordionSummaryProps {
    children: React.ReactNode
    sx?: SxProps
    indicator?: React.ReactNode
    className?: string
}

export interface AccordionDetailsProps {
    children: React.ReactNode
    sx?: SxProps
    className?: string
}

export const AccordionGroup = React.forwardRef<
    HTMLDivElement,
    AccordionGroupProps
>(
    (
        {
            children,
            sx,
            variant = 'outlined',
            color = 'neutral',
            size = 'md',
            disableDivider,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyAccordionGroup
                ref={ref}
                sx={sx}
                variant={variant}
                color={color}
                size={size}
                disableDivider={disableDivider}
                className={className}
                {...props}
            >
                {children}
            </JoyAccordionGroup>
        )
    }
)
AccordionGroup.displayName = 'AccordionGroup'

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
    (
        {
            children,
            sx,
            disabled,
            expanded,
            defaultExpanded,
            onChange,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyAccordion
                ref={ref}
                sx={sx}
                disabled={disabled}
                expanded={expanded}
                defaultExpanded={defaultExpanded}
                onChange={onChange}
                className={className}
                {...props}
            >
                {children}
            </JoyAccordion>
        )
    }
)
Accordion.displayName = 'Accordion'

export const AccordionSummary = React.forwardRef<
    HTMLDivElement,
    AccordionSummaryProps
>(({ children, sx, indicator, className, ...props }, ref) => {
    return (
        <JoyAccordionSummary
            ref={ref}
            sx={sx}
            indicator={indicator}
            className={className}
            {...props}
        >
            {children}
        </JoyAccordionSummary>
    )
})
AccordionSummary.displayName = 'AccordionSummary'

export const AccordionDetails = React.forwardRef<
    HTMLDivElement,
    AccordionDetailsProps
>(({ children, sx, className, ...props }, ref) => {
    return (
        <JoyAccordionDetails ref={ref} sx={sx} className={className} {...props}>
            {children}
        </JoyAccordionDetails>
    )
})
AccordionDetails.displayName = 'AccordionDetails'
