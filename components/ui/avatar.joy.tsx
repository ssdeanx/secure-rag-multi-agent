/**
 * Avatar Component - Joy UI Primitive
 * 
 * Production-ready avatar component with image fallback,
 * group support, and full accessibility.
 * 
 * Features:
 * - Image with alt text for accessibility
 * - Fallback content (initials, icons)
 * - 3 sizes: sm, md, lg
 * - Group avatars with AvatarGroup
 * - Variant support
 */
import * as React from 'react'
import JoyAvatar from '@mui/joy/Avatar'
import JoyAvatarGroup from '@mui/joy/AvatarGroup'
import type { SxProps } from '@mui/system'

export interface AvatarProps {
    /**
     * The variant to use.
     * @default 'soft'
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
     * Used in combination with `src` or `srcSet` to
     * provide an alt attribute for the rendered `img` element.
     */
    alt?: string

    /**
     * The `src` attribute for the `img` element.
     */
    src?: string

    /**
     * The `srcSet` attribute for the `img` element.
     */
    srcSet?: string

    /**
     * The content of the component (fallback when image fails to load).
     * Typically initials or an icon.
     */
    children?: React.ReactNode

    /**
     * The system prop for custom styles.
     */
    sx?: SxProps
}

/**
 * Avatar component for user profile pictures with fallback support.
 * 
 * @example With image
 * ```tsx
 * <Avatar 
 *   src="/avatar.jpg" 
 *   alt="John Doe"
 * />
 * ```
 * 
 * @example With fallback initials
 * ```tsx
 * <Avatar>JD</Avatar>
 * ```
 * 
 * @example With icon fallback
 * ```tsx
 * <Avatar>
 *   <UserIcon />
 * </Avatar>
 * ```
 * 
 * @example Different sizes
 * ```tsx
 * <Avatar size="sm" src="/avatar.jpg" />
 * <Avatar size="md" src="/avatar.jpg" />
 * <Avatar size="lg" src="/avatar.jpg" />
 * ```
 */
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ variant = 'soft', size = 'md', color = 'neutral', sx, ...props }, ref) => {
        return (
            <JoyAvatar
                ref={ref}
                variant={variant}
                size={size}
                color={color}
                sx={sx}
                {...props}
            />
        )
    }
)

Avatar.displayName = 'Avatar'

/**
 * AvatarGroup component for displaying multiple avatars with overlap.
 */
export interface AvatarGroupProps {
    /**
     * The avatars to display.
     */
    children: React.ReactNode

    /**
     * The size of the avatars.
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * The variant of the avatars.
     * @default 'soft'
     */
    variant?: 'solid' | 'soft' | 'outlined' | 'plain'

    /**
     * Max avatars to show before +x.
     */
    max?: number

    /**
     * The spacing between avatars.
     */
    spacing?: number | string

    /**
     * The system prop for custom styles.
     */
    sx?: SxProps
}

/**
 * AvatarGroup component for displaying a collection of avatars.
 * 
 * @example Basic group
 * ```tsx
 * <AvatarGroup>
 *   <Avatar src="/user1.jpg" alt="User 1" />
 *   <Avatar src="/user2.jpg" alt="User 2" />
 *   <Avatar src="/user3.jpg" alt="User 3" />
 * </AvatarGroup>
 * ```
 * 
 * @example With max limit
 * ```tsx
 * <AvatarGroup max={3}>
 *   <Avatar src="/user1.jpg" />
 *   <Avatar src="/user2.jpg" />
 *   <Avatar src="/user3.jpg" />
 *   <Avatar src="/user4.jpg" />
 *   <Avatar src="/user5.jpg" />
 * </AvatarGroup>
 * ```
 */
const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
    ({ size = 'md', variant = 'soft', sx, ...props }, ref) => {
        return (
            <JoyAvatarGroup
                ref={ref}
                size={size}
                sx={{
                    '--AvatarGroup-gap': '-8px',
                    ...sx,
                }}
                {...props}
            />
        )
    }
)

AvatarGroup.displayName = 'AvatarGroup'

/**
 * Convenience components for Avatar composition
 */
export interface AvatarImageProps {
    src: string
    alt: string
}

const AvatarImage: React.FC<AvatarImageProps> = ({ src, alt }) => {
    return <img src={src} alt={alt} loading="lazy" />
}

AvatarImage.displayName = 'AvatarImage'

export interface AvatarFallbackProps {
    children: React.ReactNode
}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children }) => {
    return <>{children}</>
}

AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarGroup, AvatarImage, AvatarFallback }
