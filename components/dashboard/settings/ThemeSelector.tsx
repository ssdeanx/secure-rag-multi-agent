'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import RadioGroup from '@mui/joy/RadioGroup'
import Radio from '@mui/joy/Radio'
import Sheet from '@mui/joy/Sheet'
import { useColorScheme } from '@mui/joy/styles'
import { DarkMode, LightMode, SettingsBrightness } from '@mui/icons-material'

/**
 * Theme Selector Component
 *
 * Provides controls for selecting color scheme (light/dark/system)
 * and other theme-related preferences.
 */
export default function ThemeSelector() {
    const { mode, setMode } = useColorScheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <Typography>Loading theme settings...</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Color Scheme */}
            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>
                        Color Scheme
                    </Typography>
                    <FormControl>
                        <FormLabel>Choose your preferred color scheme</FormLabel>
                        <RadioGroup
                            value={mode}
                            onChange={(event) => {
                                const newMode = event.target.value as 'light' | 'dark' | 'system'
                                setMode(newMode)
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                <Sheet
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        borderRadius: 'sm',
                                        bgcolor: mode === 'light' ? 'primary.softBg' : 'background.surface',
                                        borderColor: mode === 'light' ? 'primary.outlinedBorder' : 'divider',
                                    }}
                                >
                                    <Radio
                                        value="light"
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LightMode />
                                                <Box>
                                                    <Typography level="title-sm">Light Mode</Typography>
                                                    <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                                                        Bright and clear interface
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </Sheet>

                                <Sheet
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        borderRadius: 'sm',
                                        bgcolor: mode === 'dark' ? 'primary.softBg' : 'background.surface',
                                        borderColor: mode === 'dark' ? 'primary.outlinedBorder' : 'divider',
                                    }}
                                >
                                    <Radio
                                        value="dark"
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <DarkMode />
                                                <Box>
                                                    <Typography level="title-sm">Dark Mode</Typography>
                                                    <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                                                        Easy on the eyes in low light
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </Sheet>

                                <Sheet
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        borderRadius: 'sm',
                                        bgcolor: mode === 'system' ? 'primary.softBg' : 'background.surface',
                                        borderColor: mode === 'system' ? 'primary.outlinedBorder' : 'divider',
                                    }}
                                >
                                    <Radio
                                        value="system"
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <SettingsBrightness />
                                                <Box>
                                                    <Typography level="title-sm">System</Typography>
                                                    <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                                                        Follow system preferences
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </Sheet>
                            </Box>
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Preview */}
            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>
                        Preview
                    </Typography>
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 'sm',
                            bgcolor: 'background.level1',
                            border: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Typography level="body-md" sx={{ mb: 2 }}>
                            This is how your dashboard will look with the selected theme.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 'sm',
                                    bgcolor: 'primary.solidBg',
                                    color: 'primary.solidColor',
                                }}
                            >
                                Primary
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 'sm',
                                    bgcolor: 'neutral.solidBg',
                                    color: 'neutral.solidColor',
                                }}
                            >
                                Neutral
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 'sm',
                                    bgcolor: 'success.solidBg',
                                    color: 'success.solidColor',
                                }}
                            >
                                Success
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Additional Preferences */}
            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>
                        Additional Preferences
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
                        More customization options coming soon...
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    )
}
