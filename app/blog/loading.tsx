import React from 'react'
import { Box } from '@/components/ui/joy'

export default function BlogLoading() {
    return (
        <Box
            component="div"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                p: 4,
                minHeight: '100vh',
                bgcolor: 'background.body',
            }}
        >
            <Box
                sx={{
                    maxWidth: 600,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        height: 32,
                        width: 256,
                        bgcolor: 'background.level2',
                        borderRadius: 'sm',
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                />
                <Box
                    sx={{
                        height: 16,
                        width: 320,
                        bgcolor: 'background.level2',
                        borderRadius: 'sm',
                        animation: 'pulse 1.5s ease-in-out infinite 0.5s',
                    }}
                />
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)',
                    },
                    maxWidth: 1200,
                    mx: 'auto',
                    width: '100%',
                }}
            >
                {Array.from({ length: 6 }).map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                height: 160,
                                width: '100%',
                                bgcolor: 'background.level2',
                                borderRadius: 'md',
                                animation: 'pulse 1.5s ease-in-out infinite',
                            }}
                        />
                        <Box
                            sx={{
                                height: 20,
                                width: '75%',
                                bgcolor: 'background.level2',
                                borderRadius: 'sm',
                                animation:
                                    'pulse 1.5s ease-in-out infinite 0.5s',
                            }}
                        />
                        <Box
                            sx={{
                                height: 16,
                                width: '50%',
                                bgcolor: 'background.level2',
                                borderRadius: 'sm',
                                animation: 'pulse 1.5s ease-in-out infinite 1s',
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    )
}
