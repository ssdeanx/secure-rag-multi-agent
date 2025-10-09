import React from 'react'
import { Box } from '@/components/ui/joy'

export default function DocsLoading() {
    return (
        <Box
            component="div"
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    xl: '1fr 4fr',
                },
                gap: 4,
                p: 4,
                minHeight: '100vh',
                bgcolor: 'background.body',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box
                    sx={{
                        height: 24,
                        width: 160,
                        bgcolor: 'background.level2',
                        borderRadius: 'sm',
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                />
                {Array.from({ length: 6 }).map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            height: 16,
                            width: 128,
                            bgcolor: 'background.level2',
                            borderRadius: 'sm',
                            animation: 'pulse 1.5s ease-in-out infinite 0.5s',
                        }}
                    />
                ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                    sx={{
                        height: 32,
                        width: 288,
                        bgcolor: 'background.level2',
                        borderRadius: 'sm',
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                />
                {Array.from({ length: 10 }).map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            height: 16,
                            width: '100%',
                            bgcolor: 'background.level2',
                            borderRadius: 'sm',
                            animation: 'pulse 1.5s ease-in-out infinite 0.5s',
                        }}
                    />
                ))}
            </Box>
        </Box>
    )
}
