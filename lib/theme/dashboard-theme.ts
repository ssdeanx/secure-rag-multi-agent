import { extendTheme } from '@mui/joy/styles'

/**
 * Dashboard Theme Extension
 *
 * Extends the base Joy UI theme with customizations specific to the
 * administrative dashboard. This theme is completely independent from
 * the Cedar-OS Tailwind system.
 *
 * Key customizations:
 * - Enhanced color palette for data visualization
 * - Consistent spacing and typography scale
 * - Optimized component variants for forms and tables
 * - Professional dark mode implementation
 */
export const dashboardTheme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                // Keep default Joy UI palettes but add subtle customizations
                primary: {
                    // Professional blue palette for primary actions
                    50: '#EDF5FD',
                    100: '#E3EFFB',
                    200: '#C7DFF7',
                    300: '#97C3F0',
                    400: '#4393E4',
                    500: '#0B6BCB', // Main primary color
                    600: '#185EA5',
                    700: '#12467B',
                    800: '#0A2744',
                    900: '#051423',
                },
                neutral: {
                    // Refined neutral palette for better contrast
                    50: '#FBFCFE',
                    100: '#F0F4F8',
                    200: '#DDE7EE',
                    300: '#CDD7E1',
                    400: '#9FA6AD',
                    500: '#636B74',
                    600: '#555E68',
                    700: '#32383E',
                    800: '#171A1C',
                    900: '#0B0D0E',
                },
                success: {
                    // Green palette for positive indicators
                    500: '#1F7A1F',
                },
                warning: {
                    // Amber palette for warnings
                    500: '#9A5B13',
                },
                danger: {
                    // Red palette for errors/destructive actions
                    500: '#C41C1C',
                },
            },
        },
        dark: {
            palette: {
                // Enhanced dark mode with improved contrast
                background: {
                    body: '#0B0D0E',
                    surface: '#171A1C',
                    level1: '#1F2225',
                    level2: '#2D3135',
                    level3: '#3A3E43',
                },
                primary: {
                    // Slightly brighter primary in dark mode
                    500: '#4393E4',
                },
            },
        },
    },
    fontFamily: {
        // Use system font stack for optimal performance
        display:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    typography: {
        // Refined typography scale for admin interfaces
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        'title-lg': {
            fontSize: '1.125rem',
            fontWeight: 600,
        },
        'title-md': {
            fontSize: '1rem',
            fontWeight: 600,
        },
        'title-sm': {
            fontSize: '0.875rem',
            fontWeight: 600,
        },
        'body-lg': {
            fontSize: '1.125rem',
            lineHeight: 1.6,
        },
        'body-md': {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        'body-sm': {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        'body-xs': {
            fontSize: '0.75rem',
            lineHeight: 1.5,
        },
    },
    components: {
        // Component-specific customizations
        JoyButton: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    // Ensure consistent button sizing
                    ...(ownerState.size === 'sm' && {
                        minHeight: '32px',
                        fontSize: theme.vars.fontSize.sm,
                    }),
                    ...(ownerState.size === 'md' && {
                        minHeight: '40px',
                        fontSize: theme.vars.fontSize.md,
                    }),
                    ...(ownerState.size === 'lg' && {
                        minHeight: '48px',
                        fontSize: theme.vars.fontSize.lg,
                    }),
                }),
            },
        },
        JoyCard: {
            styleOverrides: {
                root: {
                    // Subtle shadow for depth
                    boxShadow:
                        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    transition: 'box-shadow 0.2s ease',
                    '&:hover': {
                        boxShadow:
                            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    },
                },
            },
        },
        JoyInput: {
            styleOverrides: {
                root: {
                    // Consistent input sizing
                    minHeight: '40px',
                },
            },
        },
        JoyTable: {
            styleOverrides: {
                root: {
                    // Improved table styling
                    '--Table-headerUnderlineThickness': '1px',
                    '--TableCell-paddingY': '12px',
                    '--TableCell-paddingX': '16px',
                },
            },
        },
    },
    spacing: (factor: number) => `${0.25 * factor}rem`, // 4px base unit
})

/**
 * Type-safe theme for TypeScript usage
 */
export type DashboardTheme = typeof dashboardTheme
