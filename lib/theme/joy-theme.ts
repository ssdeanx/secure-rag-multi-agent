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
    50: 'hsla(153, 60%, 95%, 1);', // Lightest tint
    100: 'hsla(153, 60%, 85%, 1);', // Very light
    200: 'hsla(153, 60%, 70%, 1);', // Light
    300: 'hsla(153, 60%, 60%, 1);', // Light-medium
    400: 'hsla(153, 60%, 50%, 1);', // Medium (close to base)
    500: 'hsla(153, 60%, 53%, 1);', // Base color hsl(153 60% 53%)
    600: 'hsla(153, 60%, 28%, 1);', // Darker
    700: 'hsla(153, 60%, 19%, 1);', // Much darker
    800: 'hsla(153, 60%, 13%, 1);', // Very dark
    900: 'hsla(153, 60%, 7%, 1);', // Darkest
}

/**
 * Neutral palette for text, borders, backgrounds
 * Based on existing foreground/background tokens
 */
const neutralPalette = {
    50: 'hsla(211, 86.7%, 99.6%, 0.927);', // --color-background light
    100: 'hsla(211, 86.7%, 99.6%, 0.797);', // Very light gray
    200: 'hsla(208, 98.7%, 96.8%, 0.615);', // --color-border light
    300: 'hsla(207, 97.3%, 94.0%, 0.469);', // Light gray
    400: 'hsla(207, 97.3%, 94.0%, 0.412);', // Medium gray
    500: 'hsla(209, 94.0%, 94.7%, 0.245);;', // --color-muted-foreground
    600: 'hsla(200, 90.3%, 93.4%, 0.109);', // Dark gray
    700: 'hsla(182, 86.7%, 91.4%, 0.057);', // Darker
    800: 'hsla(181, 98.9%, 91.8%, 0.026);', // --color-background dark
    900: 'hsla(0, 0%, 0%, 0);', // Darkest
}

/**
 * Danger/Destructive palette
 * Base: hsl(0 78% 58%)
 */
const dangerPalette = {
    50: 'hsla(352, 100%, 97.1%, 0.980);',
    100: 'hsla(358, 100%, 87.7%, 0.980);',
    200: 'hsla(358, 100%, 79.7%, 0.980);',
    300: 'hsla(358, 100%, 69.7%, 0.980);',
    400: 'hsla(358, 100%, 65.5%, 0.884);',
    500: 'hsla(358, 99.8%, 59.1%, 0.621);', // Base hsl(0 78% 58%)
    600: 'hsla(357, 100%, 59.5%, 0.442);',
    700: 'hsla(358, 99.6%, 60.3%, 0.322);',
    800: 'hsla(358, 98.8%, 61.0%, 0.184);',
    900: 'hsla(5, 98.5%, 53.8%, 0.045);',
}

/**
 * Success palette
 * Base: hsla(181, 84% 39%, 0.873);
 */
const successPalette = {
    50: 'hsla(181, 84%, 85%, 0.99);',
    100: 'hsla(181, 84%, 85%, 0.85);',
    200: 'hsla(181, 84%, 70%, 0.75);',
    300: 'hsla(181, 84%, 55%, 0.89);',
    400: 'hsla(181, 84%, 45%, 0.93);',
    500: 'hsla(181, 84%, 39%, 0.90);', // Close to base hsl(181 84% 39%)
    600: 'hsla(181, 84%, 35%, 0.7);',
    700: 'hsla(181, 84%, 30%, 0.6);',
    800: 'hsla(181, 84%, 20%, 0.5);',
    900: 'hsla(181, 84%, 10%, 0.3);',
}

/**
 * Warning palette
 * Base: hsl(42 96% 50%)
 */
const warningPalette = {
    50: 'hsla(42, 96%, 95%, 1);',
    100: 'hsla(42, 96%, 90%, 1);',
    200: 'hsla(42, 96%, 70%, 1);',
    300: 'hsla(42, 96%, 60%, 1);',
    400: 'hsla(42, 96%, 50%, 1);', // Base hsl(42 96% 50%)
    500: 'hsla(42, 96%, 40%, 1);',
    600: 'hsla(42, 80%, 30%, 1);',
    700: 'hsla(42, 70%, 20%, 1);',
    800: 'hsla(42, 60%, 15%, 1);',
    900: 'hsla(42, 50%, 10%, 1);',
}

export const joyTheme = extendTheme({
colorSchemes: {
        light: {
            // Modern Joy UI shadow system with shadowRing and shadowChannel
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

                    // Channel tokens for translucent colors (Joy UI feature)
                    lightChannel: 'var(--joy-palette-primary-200)',
                    mainChannel: 'var(--joy-palette-primary-500)',
                    darkChannel: 'var(--joy-palette-primary-800)',
                },

                // Neutral
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

                // Additional custom colors (accessible via theme.vars.palette.secondary, etc.)
                // Note: Joy UI only supports primary, neutral, danger, success, warning as main palettes
                // These additional colors can be used in component styles via theme.vars

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

                    // Channel tokens for translucent colors (Joy UI feature)
                    lightChannel: 'var(--joy-palette-primary-200)',
                    mainChannel: 'var(--joy-palette-primary-500)',
                    darkChannel: 'var(--joy-palette-primary-800)',
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
        xs: '0.75rem', // 12px - body-xs
        sm: '0.875rem', // 14px - body-sm, title-sm
        md: '1rem', // 16px - body-md, title-md
        lg: '1.125rem', // 18px - body-lg, title-lg
        xl: '1.25rem', // 20px - h4
        xl2: '1.5rem', // 24px - h3
        xl3: '1.875rem', // 30px - h2
        xl4: '2.25rem', // 36px - h1
    },

    radius: {
        xs: '0.125rem', // 2px
        sm: '0.25rem', // 4px
        md: '0.375rem', // 6px
        lg: '0.5rem', // 8px
        xl: '0.75rem', // 12px
    },

    // Modern Joy UI shadow system
    shadow: {
        xs: 'var(--joy-shadowRing), 0 1px 2px 0 rgba(var(--joy-shadowChannel) / 0.05)',
        sm: 'var(--joy-shadowRing), 0 1px 3px 0 rgba(var(--joy-shadowChannel) / 0.1), 0 1px 2px -1px rgba(var(--joy-shadowChannel) / 0.1)',
        md: 'var(--joy-shadowRing), 0 4px 6px -1px rgba(var(--joy-shadowChannel) / 0.1), 0 2px 4px -2px rgba(var(--joy-shadowChannel) / 0.1)',
        lg: 'var(--joy-shadowRing), 0 10px 15px -3px rgba(var(--joy-shadowChannel) / 0.1), 0 4px 6px -4px rgba(var(--joy-shadowChannel) / 0.1)',
        xl: 'var(--joy-shadowRing), 0 20px 25px -5px rgba(var(--joy-shadowChannel) / 0.1), 0 8px 10px -6px rgba(var(--joy-shadowChannel) / 0.1)',
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
                    padding: '0.75rem 1rem',
                    backgroundColor: theme.vars.palette.neutral.solidBg,
                    color: theme.vars.palette.neutral.solidColor,
                    // Enhanced accessibility with ARIA attributes
                    boxDecorationBreak: 'clone',
                    boxShadow: theme.vars.shadow.sm,
                    minWidth: 44,
                    minHeight: 40,
                    // Enhanced motion with Joy patterns
                    transition: 'all 160ms cubic-bezier(0.4, 0, 0.2, 1)',
                    // Focus visible with modern Joy UI shadow ring approach
                    '&:focus-visible': {
                        outline: 'none',
                        boxShadow: `var(--joy-shadowRing), 0 0 0 4px ${theme.vars.palette.focusVisible}`,
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
                    ...((ownerState.loading ?? false) && {
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
                    border: `1px solid ${theme.vars.palette.divider}`,

                    // Smooth focus transitions
                    transition:
                        'box-shadow 160ms ease, border-color 160ms ease',
                    // Dark mode specific styling
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundColor: theme.vars.palette.background.level1,
                        borderColor: theme.vars.palette.divider,
                        color: theme.vars.palette.text.primary,
                    },
                    // Enhanced focus states with modern Joy UI shadow ring
                    '&:focus-within': {
                        boxShadow: `var(--joy-shadowRing), 0 0 0 4px ${theme.vars.palette.focusVisible}`,
                        borderColor: theme.vars.palette.primary[500],
                    },
                    // Placeholder styling
                    '& .MuiInput-input::placeholder': {
                        color: theme.vars.palette.text.tertiary,
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
                    // Default text color for light mode
                    color: theme.vars.palette.text.primary,
                    // Dark mode placeholder styling
                    [theme.getColorSchemeSelector('dark')]: {
                        color: theme.vars.palette.text.tertiary,
                    },
                }),
            },
        },

        JoyCard: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    // Apply a default shadow for cards
                    borderRadius: theme.vars.radius.xl,
                    backgroundColor: theme.vars.palette.background.surface,
                    border: `1px solid ${theme.vars.palette.divider}`,
                    // Enhanced focus states with modern Joy UI shadow ring
                    '&:focus-within': {
                        boxShadow: `var(--joy-shadowRing), 0 0 0 4px ${theme.vars.palette.focusVisible}`,
                    },
                    boxShadow: theme.vars.shadow.sm,
                    // Enhanced hover effect with Joy patterns
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
                    // Color inversion support for solid and soft variants
                    ...((ownerState.variant === 'solid' || ownerState.variant === 'soft') &&
                        Boolean(ownerState.invertedColors) && {
                        // Apply color inversion styles
                        '& [data-skip-inverted-colors]': {
                            // Skip inversion for explicitly marked children
                            '--joy-palette-text-primary': theme.vars.palette.text.primary,
                            '--joy-palette-text-secondary': theme.vars.palette.text.secondary,
                            '--joy-palette-text-tertiary': theme.vars.palette.text.tertiary,
                        },
                    }),
                }),
            },
        },

        JoyDrawer: {
            defaultProps: {
                size: 'md',
            },
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    // Enhanced mobile drawer
                    boxShadow: theme.vars.shadow.xl,
                    borderRadius: theme.vars.radius.lg,
                    // Size variants
                    ...(ownerState.size === 'sm' && {
                        width: '240px',
                    }),
                    ...(ownerState.size === 'md' && {
                        width: '320px',
                    }),
                    ...(ownerState.size === 'lg' && {
                        width: '400px',
                    }),
                    // Dark mode specific styling
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundColor: theme.vars.palette.background.surface,
                        borderColor: theme.vars.palette.divider,
                    },
                }),
                content: ({ theme }) => ({
                    backgroundColor: theme.vars.palette.background.surface,
                    color: theme.vars.palette.text.primary,
                    padding: theme.spacing(3),
                    // Better content spacing
                    '& > * + *': {
                        marginTop: theme.spacing(2),
                        marginBottom: theme.spacing(2),
                    },
                    // Dark mode specific styling
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundColor: theme.vars.palette.background.surface,
                        color: theme.vars.palette.text.primary,
                    },
                    // Apply padding to the content itself, not just between elements
                    '& > *:first-of-type': {
                        paddingTop: theme.spacing(3),
                    },
                    '& > *:last-of-type': {
                        paddingBottom: theme.spacing(3),
                    },
                    // If there's only one child, apply both top and bottom padding
                    '& > *:only-child': {
                        paddingTop: theme.spacing(3),
                        paddingBottom: theme.spacing(3),
                    },
                }),
            },
        },

        // Enhanced navigation components
        JoyListItemButton: {
            styleOverrides: {
                root: ({ theme, ownerState }) => {
                    const isSelected = Boolean(ownerState?.selected)
                    return {
                        borderRadius: theme.vars.radius.md,
                        minHeight: isSelected ? 48 : 44,
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
                            boxShadow: `var(--joy-shadowRing), 0 0 0 4px ${theme.vars.palette.focusVisible}`,
                        },
                        // Respect size variants if provided via ownerState
                        ...(ownerState?.size === 'sm' && {
                            minHeight: 40,
                        }),
                        ...(ownerState?.size === 'lg' && {
                            minHeight: 52,
                        }),
                        // Disabled state handling via ownerState to avoid unused var lint
                        ...(ownerState?.disabled === true && {
                            opacity: 0.6,
                            pointerEvents: 'none',
                        }),
                    }
                },
            },
        },

        // Typography enhancements
        JoyTypography: {
            styleOverrides: {
                root: ({ ownerState }) => ({
                    // Enhanced line heights for better readability (Joy UI standards)
                    ...(ownerState.level === 'h1' && {
                        lineHeight: 1.33334,
                        fontWeight: 700,
                    }),
                    ...(ownerState.level === 'h2' && {
                        lineHeight: 1.33334,
                        fontWeight: 700,
                    }),
                    ...(ownerState.level === 'h3' && {
                        lineHeight: 1.33334,
                        fontWeight: 600,
                    }),
                    ...(ownerState.level === 'h4' && {
                        lineHeight: 1.5,
                        fontWeight: 600,
                    }),
                    ...(ownerState.level === 'title-lg' && {
                        lineHeight: 1.33334,
                        fontWeight: 600,
                    }),
                    ...(ownerState.level === 'title-md' && {
                        lineHeight: 1.5,
                        fontWeight: 500,
                    }),
                    ...(ownerState.level === 'title-sm' && {
                        lineHeight: 1.42858,
                        fontWeight: 500,
                    }),
                    ...(ownerState.level === 'body-lg' && {
                        lineHeight: 1.5,
                        fontWeight: 400,
                    }),
                    ...(ownerState.level === 'body-md' && {
                        lineHeight: 1.5,
                        fontWeight: 400,
                    }),
                    ...(ownerState.level === 'body-sm' && {
                        lineHeight: 1.5,
                        fontWeight: 400,
                    }),
                    ...(ownerState.level === 'body-xs' && {
                        lineHeight: 1.5,
                        fontWeight: 500,
                    }),
                }),
            },
        },
        // App bar + icon button enhancements
        JoySheet: {
            defaultProps: {
                variant: 'solid',
            },
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    // Use theme tokens for consistent elevation and borders (app-bar replacement)
                    backgroundColor: theme.vars.palette.background.surface,
                    borderBottom: `1px solid ${theme.vars.palette.divider}`,
                    boxShadow: theme.vars.shadow.sm,
                    // Ensure readable text on app bars
                    color: theme.vars.palette.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    // Color inversion support for solid and soft variants
                    ...((ownerState.variant === 'solid' || ownerState.variant === 'soft') &&
                        Boolean(ownerState.invertedColors) && {
                        // Apply color inversion styles
                        '& [data-skip-inverted-colors]': {
                            // Skip inversion for explicitly marked children
                            '--joy-palette-text-primary': theme.vars.palette.text.primary,
                            '--joy-palette-text-secondary': theme.vars.palette.text.secondary,
                            '--joy-palette-text-tertiary': theme.vars.palette.text.tertiary,
                        },
                    }),
                }),
            },
        },

        JoyIconButton: {
            defaultProps: {
                size: 'md',
            },
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    color: theme.vars.palette.text.icon,
                    transition:
                        'background-color 140ms ease, transform 140ms ease',
                    borderRadius: theme.vars.radius.sm,
                    // Hover / active states using palette tokens
                    '&:hover': {
                        backgroundColor: theme.vars.palette.primary.softBg,
                        transform: 'translateY(-1px)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                    // Respect tonal variants when provided via ownerState.color
                    ...(ownerState?.color === 'primary' && {
                        color:
                            theme.vars.palette.primary.solidColor ??
                            theme.vars.palette.common.white,
                    }),
                    ...(ownerState?.disabled === true && {
                        opacity: 0.5,
                        pointerEvents: 'none',
                    }),
                }),
            },
        },
        JoyAccordion: {
            styleOverrides: {
                root: ({ theme }) => ({
                    // Enhanced border and shadows
                    boxShadow: theme.vars.shadow.lg,
                    border: `1px solid ${theme.vars.palette.divider}`,
                    borderRadius: theme.vars.radius.lg,
                    // Smooth expand/collapse transitions
                    transition: 'box-shadow 200ms ease',
                    '&:hover': {
                        boxShadow: theme.vars.shadow.xl,
                    },
                    // Dark mode specific styling
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundColor: theme.vars.palette.background.surface,
                        borderColor: theme.vars.palette.divider,
                    },
                }),
            },
        },
        JoyAccordionSummary: {
            styleOverrides: {
                root: ({ theme }) => ({
                    padding: theme.spacing(2),
                    '&:hover': {
                        backgroundColor: theme.vars.palette.primary.softBg,
                    },
                    '&.Mui-expanded': {
                        backgroundColor: theme.vars.palette.primary.softBg,
                    },
                    // Dark mode specific styling
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundColor: theme.vars.palette.background.surface,
                        borderColor: theme.vars.palette.divider,
                    },
                }),
            },
        },

        // Comprehensive Component Theming for ALL Joy UI Components

        // Alert - Enhanced with better colors and spacing
        JoyAlert: {
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    borderRadius: theme.vars.radius.lg,
                    padding: '16px 24px', // Using direct values since theme.vars.spacing doesn't exist
                    fontWeight: 500,
                    // Color variants
                    ...(ownerState.color === 'primary' && {
                        backgroundColor: theme.vars.palette.primary[50],
                        color: theme.vars.palette.primary[700],
                        borderColor: theme.vars.palette.primary[200],
                    }),
                    ...(ownerState.color === 'success' && {
                        backgroundColor: theme.vars.palette.success[50],
                        color: theme.vars.palette.success[700],
                        borderColor: theme.vars.palette.success[200],
                    }),
                    ...(ownerState.color === 'warning' && {
                        backgroundColor: theme.vars.palette.warning[50],
                        color: theme.vars.palette.warning[700],
                        borderColor: theme.vars.palette.warning[200],
                    }),
                    ...(ownerState.color === 'danger' && {
                        backgroundColor: theme.vars.palette.danger[50],
                        color: theme.vars.palette.danger[700],
                        borderColor: theme.vars.palette.danger[200],
                    }),
                    // Color inversion support for solid and soft variants
                    ...((ownerState.variant === 'solid' || ownerState.variant === 'soft') &&
                        Boolean(ownerState.invertedColors) && {
                        // Apply color inversion styles
                        '& [data-skip-inverted-colors]': {
                            // Skip inversion for explicitly marked children
                            '--joy-palette-text-primary': theme.vars.palette.text.primary,
                            '--joy-palette-text-secondary': theme.vars.palette.text.secondary,
                            '--joy-palette-text-tertiary': theme.vars.palette.text.tertiary,
                        },
                    }),
                }),
            },
        },

        // Avatar - Enhanced with better sizing and borders
        JoyAvatar: {
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    border: `2px solid ${theme.vars.palette.background.surface}`,
                    boxShadow: theme.vars.shadow.sm,
                    // Size variants
                    ...(ownerState.size === 'sm' && {
                        width: 32,
                        height: 32,
                        fontSize: theme.vars.fontSize.sm,
                    }),
                    ...(ownerState.size === 'md' && {
                        width: 40,
                        height: 40,
                        fontSize: theme.vars.fontSize.md,
                    }),
                    ...(ownerState.size === 'lg' && {
                        width: 56,
                        height: 56,
                        fontSize: theme.vars.fontSize.lg,
                    }),
                }),
            },
        },

        // Badge - Enhanced positioning and colors
        JoyBadge: {
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    fontWeight: 600,
                    fontSize: theme.vars.fontSize.xs,
                    // Color variants
                    ...(ownerState.color === 'primary' && {
                        backgroundColor: theme.vars.palette.primary[500],
                        color: 'white',
                    }),
                    ...(ownerState.color === 'success' && {
                        backgroundColor: theme.vars.palette.success[500],
                        color: 'white',
                    }),
                    ...(ownerState.color === 'warning' && {
                        backgroundColor: theme.vars.palette.warning[500],
                        color: 'black',
                    }),
                    ...(ownerState.color === 'danger' && {
                        backgroundColor: theme.vars.palette.danger[500],
                        color: 'white',
                    }),
                }),
            },
        },

        // Breadcrumbs - Enhanced navigation styling
        JoyBreadcrumbs: {
            styleOverrides: {
                root: ({ theme }) => ({
                    fontSize: theme.vars.fontSize.sm,
                    color: theme.vars.palette.text.secondary,
                    '& .MuiBreadcrumbs-separator': {
                        color: theme.vars.palette.text.tertiary,
                    },
                }),
                li: ({ theme }) => ({
                    '& a': {
                        color: theme.vars.palette.text.secondary,
                        textDecoration: 'none',
                        transition: 'color 200ms ease',
                        '&:hover': {
                            color: theme.vars.palette.primary[600],
                            textDecoration: 'underline',
                        },
                    },
                }),
            },
        },

        // Checkbox - Enhanced with better focus states
        JoyCheckbox: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.vars.radius.sm,
                    '&:focus-visible': {
                        outline: 'none',
                        boxShadow: `var(--joy-shadowRing), 0 0 0 2px ${theme.vars.palette.focusVisible}`,
                    },
                }),
            },
        },

        // Circular Progress - Enhanced colors
        JoyCircularProgress: {
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    // Color variants
                    ...(ownerState.color === 'primary' && {
                        color: theme.vars.palette.primary[500],
                    }),
                    ...(ownerState.color === 'success' && {
                        color: theme.vars.palette.success[500],
                    }),
                    ...(ownerState.color === 'warning' && {
                        color: theme.vars.palette.warning[500],
                    }),
                    ...(ownerState.color === 'danger' && {
                        color: theme.vars.palette.danger[500],
                    }),
                }),
            },
        },

        // Form Control - Enhanced layout and spacing
        JoyFormControl: {
            styleOverrides: {
                root: () => ({
                    marginBottom: '12px', // Direct value since theme.vars.spacing doesn't exist
                }),
            },
        },

        // Form Label - Enhanced typography
        JoyFormLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    fontWeight: 600,
                    color: theme.vars.palette.text.primary,
                    marginBottom: '4px',
                }),
            },
        },

        // Linear Progress - Enhanced colors and styling
        JoyLinearProgress: {
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    height: 8,
                    borderRadius: 9999, // Full radius
                    backgroundColor: theme.vars.palette.background.level2,
                    // Color variants
                    ...(ownerState.color === 'primary' && {
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: theme.vars.palette.primary[500],
                        },
                    }),
                    ...(ownerState.color === 'success' && {
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: theme.vars.palette.success[500],
                        },
                    }),
                }),
            },
        },

        // Link - Enhanced with better hover states
        JoyLink: {
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                    '&:hover': {
                        color: theme.vars.palette.primary[600],
                        textDecoration: 'underline',
                    },
                    // Color variants
                    ...(ownerState.color === 'primary' && {
                        color: theme.vars.palette.primary[600],
                    }),
                    ...(ownerState.color === 'neutral' && {
                        color: theme.vars.palette.text.primary,
                    }),
                }),
            },
        },

        // List - Enhanced spacing and typography
        JoyList: {
            styleOverrides: {
                root: () => ({
                    padding: 0,
                }),
            },
        },

        // List Item - Enhanced with better spacing
        JoyListItem: {
            styleOverrides: {
                root: () => ({
                    padding: '4px 0',
                }),
            },
        },

        // Menu - Enhanced dropdown styling
        JoyMenu: {
            styleOverrides: {
                root: ({ theme }) => ({
                    boxShadow: theme.vars.shadow.lg,
                    borderRadius: theme.vars.radius.lg,
                    border: `1px solid ${theme.vars.palette.divider}`,
                }),
            },
        },

        // Menu Item - Enhanced hover states
        JoyMenuItem: {
            styleOverrides: {
                root: ({ theme }) => ({
                    padding: '8px 12px',
                    borderRadius: theme.vars.radius.md,
                    margin: '2px 4px',
                    transition: 'background-color 150ms ease',
                    '&:hover': {
                        backgroundColor: theme.vars.palette.primary.softBg,
                    },
                }),
            },
        },

        // Modal - Enhanced backdrop and positioning
        JoyModal: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '& .MuiModal-backdrop': {
                        backgroundColor: theme.vars.palette.background.backdrop,
                    },
                }),
            },
        },

        // Modal Dialog - Enhanced content styling
        JoyModalDialog: {
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    borderRadius: theme.vars.radius.xl,
                    boxShadow: theme.vars.shadow.xl,
                    border: `1px solid ${theme.vars.palette.divider}`,
                    // Color inversion support for solid and soft variants
                    ...((ownerState.variant === 'solid' || ownerState.variant === 'soft') &&
                        Boolean(ownerState.invertedColors) && {
                        // Apply color inversion styles
                        '& [data-skip-inverted-colors]': {
                            // Skip inversion for explicitly marked children
                            '--joy-palette-text-primary': theme.vars.palette.text.primary,
                            '--joy-palette-text-secondary': theme.vars.palette.text.secondary,
                            '--joy-palette-text-tertiary': theme.vars.palette.text.tertiary,
                        },
                    }),
                }),
            },
        },

        // Option - Enhanced select option styling
        JoyOption: {
            styleOverrides: {
                root: ({ theme }) => ({
                    padding: '8px 12px',
                    borderRadius: theme.vars.radius.md,
                    margin: '1px 2px',
                    transition: 'background-color 150ms ease',
                    '&:hover': {
                        backgroundColor: theme.vars.palette.primary.softBg,
                    },
                }),
            },
        },

        // Radio - Enhanced focus states
        JoyRadio: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '&:focus-visible': {
                        outline: 'none',
                        boxShadow: `var(--joy-shadowRing), 0 0 0 2px ${theme.vars.palette.focusVisible}`,
                    },
                }),
            },
        },

        // Select - Enhanced dropdown styling
        JoySelect: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.vars.radius.lg,
                    transition: 'border-color 200ms ease',
                    '&:hover': {
                        borderColor: theme.vars.palette.primary[400],
                    },
                    '&:focus-within': {
                        borderColor: theme.vars.palette.primary[500],
                        boxShadow: `var(--joy-shadowRing), 0 0 0 3px ${theme.vars.palette.primary[100]}`,
                    },
                }),
            },
        },

        // Skeleton - Enhanced loading states
        JoySkeleton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.vars.palette.background.level2,
                    borderRadius: theme.vars.radius.md,
                }),
            },
        },

        // Slider - Enhanced track and thumb styling
        JoySlider: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '& .MuiSlider-track': {
                        backgroundColor: theme.vars.palette.primary[500],
                    },
                    '& .MuiSlider-thumb': {
                        backgroundColor: theme.vars.palette.primary[500],
                        border: `2px solid ${theme.vars.palette.background.surface}`,
                        boxShadow: theme.vars.shadow.sm,
                        '&:hover': {
                            boxShadow: theme.vars.shadow.md,
                        },
                        '&:focus-visible': {
                            outline: 'none',
                            boxShadow: `var(--joy-shadowRing), 0 0 0 2px ${theme.vars.palette.focusVisible}`,
                        },
                    },
                }),
            },
        },

        // Switch - Enhanced toggle styling
        JoySwitch: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '& .MuiSwitch-track': {
                        backgroundColor: theme.vars.palette.neutral[300],
                    },
                    '& .MuiSwitch-thumb': {
                        backgroundColor: 'white',
                        boxShadow: theme.vars.shadow.sm,
                    },
                    '&.Mui-checked .MuiSwitch-track': {
                        backgroundColor: theme.vars.palette.primary[500],
                    },
                }),
            },
        },

        // Table - Enhanced data display
        JoyTable: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.vars.radius.lg,
                    overflow: 'hidden',
                    border: `1px solid ${theme.vars.palette.divider}`,
                }),
            },
        },

        // Tab - Enhanced navigation styling
        JoyTab: {
            styleOverrides: {
                root: ({ theme }) => ({
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: theme.vars.radius.lg,
                    padding: '6px 12px',
                    transition: 'all 200ms ease',
                    '&:hover': {
                        backgroundColor: theme.vars.palette.primary.softBg,
                    },
                }),
            },
        },

        // Tab List - Enhanced container styling
        JoyTabList: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.vars.palette.background.level1,
                    borderRadius: theme.vars.radius.xl,
                    padding: '2px',
                }),
            },
        },

        // Tab Panel - Enhanced content area
        JoyTabPanel: {
            styleOverrides: {
                root: () => ({
                    padding: '12px',
                }),
            },
        },

        // Textarea - Enhanced form input
        JoyTextarea: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.vars.radius.lg,
                    transition: 'border-color 200ms ease',
                    '&:focus-within': {
                        borderColor: theme.vars.palette.primary[500],
                        boxShadow: `var(--joy-shadowRing), 0 0 0 3px ${theme.vars.palette.primary[100]}`,
                    },
                }),
            },
        },

        // Toggle Button Group - Enhanced selection controls
        JoyToggleButtonGroup: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.vars.radius.xl,
                    overflow: 'hidden',
                    border: `1px solid ${theme.vars.palette.divider}`,
                }),
            },
        },

        // Tooltip - Enhanced information display
        JoyTooltip: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.vars.palette.neutral[800],
                    color: theme.vars.palette.common.white,
                    borderRadius: theme.vars.radius.lg,
                    boxShadow: theme.vars.shadow.lg,
                    fontSize: theme.vars.fontSize.sm,
                    padding: '4px 8px',
                }),
                arrow: ({ theme }) => ({
                    color: theme.vars.palette.neutral[800],
                }),
            },
        },

    },
})

export default joyTheme
