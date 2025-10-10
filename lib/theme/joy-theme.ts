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
 * - Leverage Joy UI's advanced theming capabilities
 */

import { extendTheme } from '@mui/joy/styles'

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
            // Improve elevation tuning per Joy docs
            shadowChannel: '21 21 21',
            shadowRing: '0 0 0 1px rgba(0 0 0 / 0.08)',
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
            shadowChannel: '0 0 0',
            shadowRing: '0 0 0 1px rgba(255 255 255 / 0.10)',
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

    // Enhanced component defaults with Joy UI best practices
    spacing: 4,

    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },

    // Advanced component theming with Joy UI patterns
    components: {
        JoyButton: {
            defaultProps: {
                size: 'md',
            },
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    fontWeight: 600,
                    borderRadius: theme.vars.radius.lg,
                    minWidth: 44,
                    minHeight: 40,
                    // Enhanced motion with Joy patterns
                    transition: 'all 160ms cubic-bezier(0.4, 0, 0.2, 1)',
                    // Focus visible with theme tokens
                    '&:focus-visible': {
                        outline: 'none',
                        boxShadow: `0 0 0 4px ${theme.vars.palette.focusVisible}`,
                    },
                    // Size-specific adjustments
                    ...(ownerState.size === 'sm' && {
                        minHeight: 36,
                        fontSize: theme.vars.fontSize.sm,
                    }),
                    ...(ownerState.size === 'lg' && {
                        minHeight: 48,
                        fontSize: theme.vars.fontSize.lg,
                    }),
                    // Loading state enhancements
                    ...(ownerState.loading && {
                        pointerEvents: 'none',
                    }),
                }),
            },
        },

        JoyInput: {
            defaultProps: {
                size: 'md',
            },
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    minHeight: 40,
                    borderRadius: theme.vars.radius.md,
                    // Enhanced focus states
                    '&:focus-within': {
                        boxShadow: `0 0 0 4px ${theme.vars.palette.focusVisible}`,
                    },
                    // Size variants
                    ...(ownerState.size === 'sm' && {
                        minHeight: 36,
                        fontSize: theme.vars.fontSize.sm,
                    }),
                    ...(ownerState.size === 'lg' && {
                        minHeight: 48,
                        fontSize: theme.vars.fontSize.lg,
                    }),
                }),
                input: ({ theme }) => ({
                    // Better input styling
                    '&::placeholder': {
                        color: theme.vars.palette.text.tertiary,
                        opacity: 0.7,
                    },
                }),
            },
        },

        JoyCard: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.vars.radius.xl,
                    transition: 'transform 200ms ease, box-shadow 200ms ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.vars.shadow.lg,
                    },
                    // Dark mode specific styling
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundColor: theme.vars.palette.background.surface,
                        borderColor: theme.vars.palette.divider,
                    },
                }),
            },
        },

        JoyDrawer: {
            defaultProps: {
                size: 'md',
            },
            styleOverrides: {
                root: ({ theme }) => ({
                    // Enhanced mobile drawer
                    boxShadow: theme.vars.shadow.xl,
                    borderRadius: theme.vars.radius.lg,
                }),
                content: ({ theme }) => ({
                    padding: theme.spacing(3),
                    // Better content spacing
                    '& > * + *': {
                        marginTop: theme.spacing(2),
                    },
                }),
            },
        },

        // Enhanced navigation components
        JoyListItemButton: {
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    borderRadius: theme.vars.radius.md,
                    minHeight: 44,
                    transition: 'all 160ms ease',
                    '&:hover': {
                        backgroundColor: theme.vars.palette.primary.softBg,
                    },
                    '&.Mui-selected': {
                        backgroundColor: theme.vars.palette.primary.softBg,
                        color: theme.vars.palette.primary.plainColor,
                        fontWeight: 600,
                    },
                    '&:focus-visible': {
                        outline: 'none',
                        boxShadow: `0 0 0 4px ${theme.vars.palette.focusVisible}`,
                    },
                }),
            },
        },

        // Typography enhancements
        JoyTypography: {
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    // Better line heights for readability
                    ...(ownerState.level === 'body-sm' && {
                        lineHeight: 1.5,
                    }),
                    ...(ownerState.level === 'body-md' && {
                        lineHeight: 1.6,
                    }),
                    ...(ownerState.level === 'h1' && {
                        lineHeight: 1.2,
                        fontWeight: 700,
                    }),
                    ...(ownerState.level === 'h2' && {
                        lineHeight: 1.3,
                        fontWeight: 600,
                    }),
                }),
            },
        },

        // Enhanced chip styling
        JoyChip: {
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    borderRadius: theme.vars.radius.sm,
                    fontWeight: 500,
                    // Size variants
                    ...(ownerState.size === 'sm' && {
                        fontSize: theme.vars.fontSize.xs,
                        minHeight: 24,
                    }),
                    ...(ownerState.size === 'md' && {
                        fontSize: theme.vars.fontSize.sm,
                        minHeight: 32,
                    }),
                }),
            },
        },
    },
})

export default joyTheme
