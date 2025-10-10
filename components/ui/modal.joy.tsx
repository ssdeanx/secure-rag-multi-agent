'use client'

import * as React from 'react'
import {
    Modal as JoyModal,
    ModalDialog as JoyModalDialog,
    ModalClose,
    DialogTitle,
    DialogContent as JoyDialogContent,
    DialogActions,
} from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface ModalProps {
    // Joy's Modal requires a single React element (typically <ModalDialog />) as child.
    // Narrow the type so TypeScript matches @mui/joy's expected ReactElement.
    children: React.ReactElement
    open: boolean
    onClose?: () => void
    sx?: SxProps
    className?: string
}

export interface ModalDialogProps {
    children: React.ReactNode
    variant?: 'plain' | 'outlined' | 'soft' | 'solid'
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    size?: 'sm' | 'md' | 'lg'
    layout?: 'center' | 'fullscreen'
    sx?: SxProps
    className?: string
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
    ({ children, open, onClose, sx, className, ...props }, ref) => {
        return (
            <JoyModal
                ref={ref}
                open={open}
                onClose={onClose}
                sx={sx}
                className={className}
                {...props}
            >
                {children as React.ReactElement}
            </JoyModal>
        )
    }
)
Modal.displayName = 'Modal'

export const ModalDialog = React.forwardRef<HTMLDivElement, ModalDialogProps>(
    (
        {
            children,
            variant = 'outlined',
            color = 'neutral',
            size = 'md',
            layout = 'center',
            sx,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <JoyModalDialog
                ref={ref}
                variant={variant}
                color={color}
                size={size}
                layout={layout}
                sx={sx}
                className={className}
                {...props}
            >
                {children}
            </JoyModalDialog>
        )
    }
)
ModalDialog.displayName = 'ModalDialog'

export const ModalHeader = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; sx?: SxProps; className?: string }
>(({ children, sx, className, ...props }, ref) => {
    return (
        <DialogTitle ref={ref} sx={sx} className={className} {...props}>
            {children}
        </DialogTitle>
    )
})
ModalHeader.displayName = 'ModalHeader'

export const ModalContent = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; sx?: SxProps; className?: string }
>(({ children, sx, className, ...props }, ref) => {
    return (
        <JoyDialogContent ref={ref} sx={sx} className={className} {...props}>
            {children}
        </JoyDialogContent>
    )
})
ModalContent.displayName = 'ModalContent'

export const ModalFooter = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; sx?: SxProps; className?: string }
>(({ children, sx, className, ...props }, ref) => {
    return (
        <DialogActions ref={ref} sx={sx} className={className} {...props}>
            {children}
        </DialogActions>
    )
})
ModalFooter.displayName = 'ModalFooter'

export { ModalClose }

// Aliases for common use cases
export const Dialog = Modal
export const DialogHeader = ModalHeader
export const DialogFooter = ModalFooter

export const DialogContent = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; sx?: SxProps; className?: string }
>(({ children, sx, className, ...props }, ref) => {
    return (
        <JoyDialogContent ref={ref} sx={sx} className={className} {...props}>
            {children}
        </JoyDialogContent>
    )
})
DialogContent.displayName = 'DialogContent'
