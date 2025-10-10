/**
 * Card Component - Joy UI Primitive
 *
 * Production-ready card component with composition pattern
 * for building complex card layouts.
 *
 * Features:
 * - 4 variants: solid, soft, outlined, plain
 * - Horizontal and vertical orientation
 * - CardCover for background images/videos
 * - CardContent for main content
 * - CardActions for button groups
 * - CardOverflow for edge-to-edge content
 */
import * as React from 'react'
import JoyCard from '@mui/joy/Card'
import JoyCardContent from '@mui/joy/CardContent'
import JoyCardCover from '@mui/joy/CardCover'
import JoyCardOverflow from '@mui/joy/CardOverflow'
import JoyCardActions from '@mui/joy/CardActions'
import Typography from '@mui/joy/Typography'
import type { SxProps } from '@mui/system'

export interface CardProps {
    /**
     * The variant to use.
     * @default 'outlined'
     */
    variant?: 'solid' | 'soft' | 'outlined' | 'plain'

    /**
     * The size of the component.
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * The color of the component.
     * @default 'neutral'
     */
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'

    /**
     * The orientation of the card.
     * @default 'vertical'
     */
    orientation?: 'horizontal' | 'vertical'

    /**
     * If `true`, the card colors are inverted.
     */
    invertedColors?: boolean

    /**
     * The content of the card.
     */
    children: React.ReactNode

    /**
     * The system prop for custom styles.
     */
    sx?: SxProps

    /**
     * The component used for the root node.
     */
    component?: React.ElementType
}

/**
 * Card component for content containers.
 *
 * @example Basic card
 * ```tsx
 * <Card>
 *   <CardContent>
 *     <Typography level="h2">Card Title</Typography>
 *     <Typography>Card description text</Typography>
 *   </CardContent>
 * </Card>
 * ```
 *
 * @example Card with actions
 * ```tsx
 * <Card>
 *   <CardContent>
 *     <Typography level="h2">Title</Typography>
 *     <Typography>Description</Typography>
 *   </CardContent>
 *   <CardActions>
 *     <Button variant="solid">Action</Button>
 *     <Button variant="outlined">Cancel</Button>
 *   </CardActions>
 * </Card>
 * ```
 *
 * @example Card with cover image
 * ```tsx
 * <Card>
 *   <CardCover>
 *     <img src="/background.jpg" alt="Background" />
 *   </CardCover>
 *   <CardContent>
 *     <Typography level="h2" textColor="white">
 *       Overlaid Title
 *     </Typography>
 *   </CardContent>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
            variant = 'outlined',
            size = 'md',
            color = 'neutral',
            orientation = 'vertical',
            sx,
            ...props
        },
        ref
    ) => {
        return (
            <JoyCard
                ref={ref}
                variant={variant}
                size={size}
                color={color}
                orientation={orientation}
                sx={sx}
                {...props}
            />
        )
    }
)

Card.displayName = 'Card'

/**
 * CardContent component for the main content area of the card.
 */
export interface CardContentProps {
    children: React.ReactNode
    sx?: SxProps
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    (props, ref) => {
        return <JoyCardContent ref={ref} {...props} />
    }
)

CardContent.displayName = 'CardContent'

/**
 * CardCover component for background images, videos, or gradients.
 * Positioned behind CardContent.
 */
export interface CardCoverProps {
    children: React.ReactNode
    sx?: SxProps
}

const CardCover = React.forwardRef<HTMLDivElement, CardCoverProps>(
    (props, ref) => {
        return <JoyCardCover ref={ref} {...props} />
    }
)

CardCover.displayName = 'CardCover'

/**
 * CardOverflow component for content that extends to the card edges.
 * Removes default padding.
 */
export interface CardOverflowProps {
    children: React.ReactNode
    /**
     * The variant to use.
     */
    variant?: 'solid' | 'soft' | 'outlined' | 'plain'
    /**
     * The color of the component.
     */
    color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
    sx?: SxProps
}

const CardOverflow = React.forwardRef<HTMLDivElement, CardOverflowProps>(
    (props, ref) => {
        return <JoyCardOverflow ref={ref} {...props} />
    }
)

CardOverflow.displayName = 'CardOverflow'

/**
 * CardActions component for button groups and actions.
 */
export interface CardActionsProps {
    children: React.ReactNode
    /**
     * If `true`, buttons will take equal width.
     */
    buttonFlex?: number | string
    /**
     * The orientation of the actions.
     */
    orientation?: 'horizontal' | 'vertical'
    sx?: SxProps
}

const CardActions = React.forwardRef<HTMLDivElement, CardActionsProps>(
    ({ buttonFlex = 1, orientation = 'horizontal', ...props }, ref) => {
        return (
            <JoyCardActions
                ref={ref}
                buttonFlex={buttonFlex}
                orientation={orientation}
                {...props}
            />
        )
    }
)

CardActions.displayName = 'CardActions'

/**
 * Convenience components for backward compatibility with Shadcn naming
 */
const CardHeader = CardContent

const CardTitle: React.FC<{ children: React.ReactNode; sx?: SxProps }> = ({
    children,
    sx,
}) => {
    return (
        <Typography level="h2" sx={sx}>
            {children}
        </Typography>
    )
}

const CardDescription: React.FC<{
    children: React.ReactNode
    sx?: SxProps
}> = ({ children, sx }) => {
    return (
        <Typography level="body-sm" sx={sx}>
            {children}
        </Typography>
    )
}

const CardFooter = CardActions

export {
    Card,
    CardContent,
    CardCover,
    CardOverflow,
    CardActions,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
}
