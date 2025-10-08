/**
 * MUI Joy UI Theme Configuration
 *
 * This theme bridges the existing Supabase-inspired design tokens
 * with Joy UI's component system. It maintains visual continuity
 * while enabling the migration from Tailwind to Joy UI.
 *
 * Design Philosophy:
 * - Preserve existing HSL color values
 * - Map semantic naming (primary, accent, etc.) to Joy palettes
 * - Support light/dark modes with existing tokens
 * - Provide global variants (solid, soft, outlined, plain)
 */

import { extendTheme } from '@mui/joy/styles'

// Convert HSL string to RGB for Joy UI's channel system
const hslToRgb = (h: number, s: number, l: number): string => {
    s /= 100
    l /= 100
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

    const r = Math.round(255 * f(0))
    const g = Math.round(255 * f(8))
    const b = Math.round(255 * f(4))

    return `${r} ${g} ${b}`
}

/**
 * Supabase Green Primary Palette
 * Base: hsl(153 60% 53%)
 */
const supabaseGreen = {
    50: '#F0FDF6', // Lightest tint
    100: '#DCFCE8', // Very light
    200: '#BBF7D5', // Light
    300: '#86EFAC', // Light-medium
    400: '#4ADE80', // Medium (close to base)
    500: '#3ECF8E', // Base color hsl(153 60% 53%)
    600: '#34B77C', // Darker
    700: '#2A9D6A', // Much darker
    800: '#1F7551', // Very dark
    900: '#14532D', // Darkest
}

/**
 * Neutral palette for text, borders, backgrounds
 * Based on existing foreground/background tokens
 */
const neutralPalette = {
    50: '#FBFCFE', // --color-background light
    100: '#F0F4F8', // Very light gray
    200: '#DDE7EE', // --color-border light
    300: '#CDD7E1', // Light gray
    400: '#9FA6AD', // Medium gray
    500: '#636B74', // --color-muted-foreground
    600: '#555E68', // Dark gray
    700: '#32383E', // Darker
    800: '#171A1C', // --color-background dark
    900: '#0B0D0E', // Darkest
}

/**
 * Danger/Destructive palette
 * Base: hsl(0 78% 58%)
 */
const dangerPalette = {
    50: '#FEF6F6',
    100: '#FCE4E4',
    200: '#F7C5C5',
    300: '#F09898',
    400: '#E47474',
    500: '#EC5A5A', // Base hsl(0 78% 58%)
    600: '#D84040',
    700: '#A51818',
    800: '#7D1212',
    900: '#430A0A',
}

/**
 * Success palette
 * Base: hsl(181 84% 39%)
 */
const successPalette = {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6', // Close to base hsl(181 84% 39%)
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
}

/**
 * Warning palette
 * Base: hsl(42 96% 50%)
 */
const warningPalette = {
    50: '#FEFAF6',
    100: '#FDF0E1',
    200: '#FCE1C2',
    300: '#F3C896',
    400: '#F59E0B', // Base hsl(42 96% 50%)
    500: '#D97706',
    600: '#B45309',
    700: '#92400E',
    800: '#78350F',
    900: '#451A03',
}

export const joyTheme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                // Primary = Supabase Green
                primary: {
                    ...supabaseGreen,
                    solidBg: 'var(--joy-palette-primary-500)',
                    solidHoverBg: 'var(--joy-palette-primary-600)',
                    solidActiveBg: 'var(--joy-palette-primary-700)',
                    solidColor: '#FFFFFF',
                    solidDisabledBg: 'var(--joy-palette-neutral-100)',
                    solidDisabledColor: 'var(--joy-palette-neutral-400)',

                    outlinedColor: 'var(--joy-palette-primary-600)',
                    outlinedBorder: 'var(--joy-palette-primary-300)',
                    outlinedHoverBg: 'var(--joy-palette-primary-50)',
                    outlinedActiveBg: 'var(--joy-palette-primary-100)',
                    outlinedDisabledColor: 'var(--joy-palette-neutral-400)',
                    outlinedDisabledBorder: 'var(--joy-palette-neutral-200)',

                    softColor: 'var(--joy-palette-primary-700)',
                    softBg: 'var(--joy-palette-primary-100)',
                    softHoverBg: 'var(--joy-palette-primary-200)',
                    softActiveBg: 'var(--joy-palette-primary-300)',
                    softDisabledColor: 'var(--joy-palette-neutral-400)',
                    softDisabledBg: 'var(--joy-palette-neutral-50)',

                    plainColor: 'var(--joy-palette-primary-600)',
                    plainHoverBg: 'var(--joy-palette-primary-50)',
                    plainActiveBg: 'var(--joy-palette-primary-100)',
                    plainDisabledColor: 'var(--joy-palette-neutral-400)',
                },

                // Neutral for text, backgrounds, borders
                neutral: {
                    ...neutralPalette,
                    solidBg: 'var(--joy-palette-neutral-700)',
                    solidColor: '#FFFFFF',
                    outlinedColor: 'var(--joy-palette-neutral-700)',
                    outlinedBorder: 'var(--joy-palette-neutral-300)',
                    softColor: 'var(--joy-palette-neutral-700)',
                    softBg: 'var(--joy-palette-neutral-100)',
                    plainColor: 'var(--joy-palette-neutral-700)',
                },

                // Danger = Destructive
                danger: {
                    ...dangerPalette,
                    solidBg: 'var(--joy-palette-danger-500)',
                    solidColor: '#FFFFFF',
                    outlinedColor: 'var(--joy-palette-danger-500)',
                    softColor: 'var(--joy-palette-danger-700)',
                    softBg: 'var(--joy-palette-danger-100)',
                },

                // Success
                success: {
                    ...successPalette,
                    solidBg: 'var(--joy-palette-success-500)',
                    solidColor: '#FFFFFF',
                    outlinedColor: 'var(--joy-palette-success-600)',
                    softColor: 'var(--joy-palette-success-700)',
                    softBg: 'var(--joy-palette-success-100)',
                },

                // Warning
                warning: {
                    ...warningPalette,
                    solidBg: 'var(--joy-palette-warning-400)',
                    solidColor: '#FFFFFF',
                    outlinedColor: 'var(--joy-palette-warning-600)',
                    softColor: 'var(--joy-palette-warning-700)',
                    softBg: 'var(--joy-palette-warning-100)',
                },

                // Background tokens
                background: {
                    body: 'var(--joy-palette-neutral-50)',
                    surface: '#FFFFFF',
                    popup: '#FFFFFF',
                    level1: 'var(--joy-palette-neutral-100)',
                    level2: 'var(--joy-palette-neutral-200)',
                    level3: 'var(--joy-palette-neutral-300)',
                },

                // Text tokens
                text: {
                    primary: 'var(--joy-palette-neutral-900)',
                    secondary: 'var(--joy-palette-neutral-700)',
                    tertiary: 'var(--joy-palette-neutral-500)',
                    icon: 'var(--joy-palette-neutral-500)',
                },

                // Common
                common: {
                    white: '#FFFFFF',
                    black: '#000000',
                },

                divider: 'var(--joy-palette-neutral-200)',
                focusVisible: 'var(--joy-palette-primary-500)',
            },
        },

        dark: {
            palette: {
                // Primary = Supabase Green (adjusted for dark mode)
                primary: {
                    ...supabaseGreen,
                    solidBg: 'var(--joy-palette-primary-500)',
                    solidHoverBg: 'var(--joy-palette-primary-600)',
                    solidActiveBg: 'var(--joy-palette-primary-700)',
                    solidColor: '#FFFFFF',

                    outlinedColor: 'var(--joy-palette-primary-400)',
                    outlinedBorder: 'var(--joy-palette-primary-700)',
                    outlinedHoverBg: 'var(--joy-palette-primary-900)',
                    outlinedActiveBg: 'var(--joy-palette-primary-800)',

                    softColor: 'var(--joy-palette-primary-300)',
                    softBg: 'var(--joy-palette-primary-900)',
                    softHoverBg: 'var(--joy-palette-primary-800)',
                    softActiveBg: 'var(--joy-palette-primary-700)',

                    plainColor: 'var(--joy-palette-primary-400)',
                    plainHoverBg: 'var(--joy-palette-primary-900)',
                    plainActiveBg: 'var(--joy-palette-primary-800)',
                },

                // Neutral
                neutral: {
                    ...neutralPalette,
                    solidBg: 'var(--joy-palette-neutral-600)',
                    solidColor: '#FFFFFF',
                    outlinedColor: 'var(--joy-palette-neutral-200)',
                    outlinedBorder: 'var(--joy-palette-neutral-700)',
                    softColor: 'var(--joy-palette-neutral-200)',
                    softBg: 'var(--joy-palette-neutral-800)',
                    plainColor: 'var(--joy-palette-neutral-300)',
                },

                // Danger
                danger: {
                    ...dangerPalette,
                    solidBg: 'var(--joy-palette-danger-500)',
                    solidColor: '#FFFFFF',
                    outlinedColor: 'var(--joy-palette-danger-400)',
                    softColor: 'var(--joy-palette-danger-300)',
                    softBg: 'var(--joy-palette-danger-900)',
                },

                // Success
                success: {
                    ...successPalette,
                    solidBg: 'var(--joy-palette-success-500)',
                    solidColor: '#FFFFFF',
                    outlinedColor: 'var(--joy-palette-success-400)',
                    softColor: 'var(--joy-palette-success-300)',
                    softBg: 'var(--joy-palette-success-900)',
                },

                // Warning
                warning: {
                    ...warningPalette,
                    solidBg: 'var(--joy-palette-warning-400)',
                    solidColor: '#000000',
                    outlinedColor: 'var(--joy-palette-warning-400)',
                    softColor: 'var(--joy-palette-warning-300)',
                    softBg: 'var(--joy-palette-warning-900)',
                },

                // Background tokens (dark mode)
                background: {
                    body: 'var(--joy-palette-neutral-900)',
                    surface: 'var(--joy-palette-neutral-800)',
                    popup: 'var(--joy-palette-neutral-800)',
                    level1: 'var(--joy-palette-neutral-800)',
                    level2: 'var(--joy-palette-neutral-700)',
                    level3: 'var(--joy-palette-neutral-600)',
                },

                // Text tokens (dark mode)
                text: {
                    primary: 'var(--joy-palette-neutral-100)',
                    secondary: 'var(--joy-palette-neutral-300)',
                    tertiary: 'var(--joy-palette-neutral-400)',
                    icon: 'var(--joy-palette-neutral-400)',
                },

                common: {
                    white: '#FFFFFF',
                    black: '#000000',
                },

                divider: 'rgba(255, 255, 255, 0.16)',
                focusVisible: 'var(--joy-palette-primary-500)',
            },
        },
    },

    fontFamily: {
        body: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display:
            'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        code: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },

    fontSize: {
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        md: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        xl2: '1.5rem', // 24px
        xl3: '1.875rem', // 30px
        xl4: '2.25rem', // 36px
    },

    radius: {
        xs: '0.125rem', // 2px
        sm: '0.25rem', // 4px
        md: '0.375rem', // 6px
        lg: '0.5rem', // 8px
        xl: '0.75rem', // 12px
    },

    shadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    },
})

export default joyTheme
