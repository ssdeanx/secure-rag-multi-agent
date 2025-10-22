'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Box, Typography, Button, Chip, Link } from '@/components/ui/joy'
import { ArrowForward, AutoAwesome } from '@mui/icons-material'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Container, ISourceOptions } from '@tsparticles/engine'

export function Hero() {
    const reduceMotion = useReducedMotion()
    const prefersReducedMotion = reduceMotion === true
    const [init, setInit] = React.useState(false)

    // store the particles container so we can clean up on unmount
    const containerRef = React.useRef<Container | null>(null)

    React.useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine)
        }).then(() => {
            setInit(true)
        })

        return () => {
            // destroy particles instance on unmount to avoid leaks
            if (containerRef.current) {
                try {
                    containerRef.current.destroy()
                } catch {
                    // swallow errors during teardown
                } finally {
                    containerRef.current = null
                }
            }
        }
    }, [])

    // particlesLoaded callback - stores Container instance
    const handleParticlesLoaded = React.useCallback(async (container?: Container) => {
        containerRef.current = container ?? null
    }, [])

    // Particles configuration
    const particlesOptions = React.useMemo(() => ({
        background: {
            color: {
                value: "transparent",
            },
        },
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800,
                },
            },
            color: {
                value: ["#3ecf8e", "#14b8a6", "#6366f1", "#8b5cf6"],
            },
            shape: {
                type: "circle",
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false,
                },
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.5,
                    sync: false,
                },
            },
            links: {
                enable: true,
                distance: 150,
                color: "#3ecf8e",
                opacity: 0.2,
                width: 1,
            },
            move: {
                enable: true,
                speed: 1,
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200,
                },
            },
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse",
                },
                onclick: {
                    enable: true,
                    mode: "push",
                },
                resize: {
                    enable: true,
                },
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4,
                },
                push: {
                    particles_nb: 4,
                },
            },
        },
        retina_detect: true,
    } as ISourceOptions), [])

    const fadeUp = (delay = 0) =>
        prefersReducedMotion
            ? {}
            : {
                  initial: { opacity: 0, y: 30 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay, duration: 0.8 },
              }

    return (
        <Box
            component="section"
            aria-labelledby="hero-heading"
            sx={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Premium layered background (less green, more depth)
                background:
                    'radial-gradient(1200px 600px at 10% -10%, rgba(62,207,142,0.18), transparent 60%), radial-gradient(1000px 500px at 90% 10%, rgba(20,184,166,0.16), transparent 60%), linear-gradient(135deg, var(--joy-palette-background-surface) 0%, var(--joy-palette-neutral-900) 100%)',
                overflow: 'hidden',
            }}
        >
            {/* TSparticles background */}
            {init && !prefersReducedMotion && (
                <>
                    <Particles
                        id="tsparticles"
                        options={particlesOptions}
                        particlesLoaded={handleParticlesLoaded}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 1,
                        }}
                    />
                    {/* Background decorative elements */}
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0.4,
                            pointerEvents: 'none',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '22%',
                                left: '20%',
                                width: 480,
                                height: 480,
                                bgcolor: 'primary.softBg',
                                borderRadius: '50%',
                                filter: 'blur(100px)',
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: '18%',
                                right: '15%',
                                width: 420,
                                height: 420,
                                bgcolor: 'success.softBg',
                                borderRadius: '50%',
                                filter: 'blur(100px)',
                            }}
                        />
                        {/* subtle grid */}
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                opacity: 0.06,
                                backgroundImage:
                                    'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                                backgroundSize: '36px 36px',
                            }}
                        />
                    </Box>
                </>
            )}

            <Box
                sx={{
                    position: 'relative',
                    zIndex: 10,
                    maxWidth: 1280,
                    mx: 'auto',
                    px: 4,
                    textAlign: 'center',
                }}
            >
                <motion.div
                    {...(prefersReducedMotion
                        ? {}
                        : {
                              initial: { opacity: 0, y: 50 },
                              animate: { opacity: 1, y: 0 },
                              transition: { duration: 0.8 },
                          })}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                            alignItems: 'center',
                        }}
                    >
                        {/* Badge */}
                        <motion.div
                            {...(prefersReducedMotion
                                ? {}
                                : {
                                      initial: { opacity: 0, scale: 0.8 },
                                      animate: { opacity: 1, scale: 1 },
                                      transition: { delay: 0.2, duration: 0.5 },
                                  })}
                        >
                            <Chip
                                startDecorator={<AutoAwesome />}
                                variant="soft"
                                color="primary"
                                size="lg"
                                sx={{
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1.5,
                                    fontSize: 'sm',
                                }}
                            >
                                Enterprise AI Orchestration Platform
                            </Chip>
                        </motion.div>

                        {/* Main heading */}
                        <motion.div {...fadeUp(0.4)}>
                            <Typography
                                level="h1"
                                sx={{
                                    fontSize: {
                                        xs: '3rem',
                                        sm: '4rem',
                                        lg: '5rem',
                                    },
                                    fontWeight: 700,
                                    lineHeight: 1.1,
                                    mb: 0,
                                }}
                            >
                                <Typography
                                    component="span"
                                    sx={{
                                        color: 'primary.500',
                                        textShadow:
                                            '0 0 30px var(--joy-palette-primary-softBg)',
                                    }}
                                >
                                    Mastra
                                </Typography>
                                <br />
                                <Typography component="span">
                                    Enterprise AI Platform
                                </Typography>
                            </Typography>
                        </motion.div>

                        {/* Subtitle */}
                        <motion.div {...fadeUp(0.6)}>
                            <Typography
                                level="h3"
                                sx={{
                                    fontSize: { xs: 'lg', sm: 'xl', lg: 'xl' },
                                    fontWeight: 400,
                                    maxWidth: 768,
                                    mx: 'auto',
                                    lineHeight: 1.6,
                                    color: 'text.secondary',
                                }}
                            >
                                Multi-agent AI orchestration with 17+
                                specialized agents, 15+ secure tools, and 11+
                                orchestrated workflows. Zero-trust security,
                                content creation, research automation, and
                                enterprise compliance built-in.
                            </Typography>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div {...fadeUp(0.8)}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 3,
                                    pt: 4,
                                }}
                            >
                                <Link href="/features">
                                    <Button
                                        size="lg"
                                        endDecorator={<ArrowForward />}
                                        sx={{
                                            px: 4,
                                            py: 2,
                                            fontSize: 'lg',
                                            fontWeight: 600,
                                            boxShadow: 'lg',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: 'xl',
                                            },
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        Explore Features
                                    </Button>
                                </Link>

                                <Link href="/docs">
                                    <Button
                                        variant="outlined"
                                        size="lg"
                                        sx={{
                                            px: 4,
                                            py: 2,
                                            fontSize: 'lg',
                                            fontWeight: 600,
                                            borderWidth: 2,
                                            '&:hover': {
                                                borderColor: 'primary.500',
                                                bgcolor: 'primary.softBg',
                                            },
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        View Documentation
                                    </Button>
                                </Link>
                            </Box>
                        </motion.div>

                        {/* Trust indicators */}
                        <motion.div
                            {...(prefersReducedMotion
                                ? {}
                                : {
                                      initial: { opacity: 0 },
                                      animate: { opacity: 1 },
                                      transition: { delay: 1.0, duration: 0.8 },
                                  })}
                        >
                            <Box
                                sx={{
                                    pt: 12,
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: 'repeat(3, 1fr)',
                                    },
                                    gap: 4,
                                    maxWidth: 640,
                                    mx: 'auto',
                                }}
                            >
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography
                                        level="h2"
                                        sx={{
                                            fontSize: '2xl',
                                            fontWeight: 700,
                                            color: 'primary.500',
                                            mb: 0.5,
                                        }}
                                    >
                                        17+
                                    </Typography>
                                    <Typography
                                        level="body-sm"
                                        sx={{ color: 'text.tertiary' }}
                                    >
                                        Specialized Agents
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography
                                        level="h2"
                                        sx={{
                                            fontSize: '2xl',
                                            fontWeight: 700,
                                            color: 'primary.500',
                                            mb: 0.5,
                                        }}
                                    >
                                        15+
                                    </Typography>
                                    <Typography
                                        level="body-sm"
                                        sx={{ color: 'text.tertiary' }}
                                    >
                                        Secure Tools
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography
                                        level="h2"
                                        sx={{
                                            fontSize: '2xl',
                                            fontWeight: 700,
                                            color: 'primary.500',
                                            mb: 0.5,
                                        }}
                                    >
                                        11+
                                    </Typography>
                                    <Typography
                                        level="body-sm"
                                        sx={{ color: 'text.tertiary' }}
                                    >
                                        Orchestrated Workflows
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    </Box>
                </motion.div>
            </Box>

            {/* Scroll indicator */}
            <motion.div
                {...(prefersReducedMotion
                    ? {}
                    : {
                          initial: { opacity: 0 },
                          animate: { opacity: 1 },
                          transition: { delay: 1.2, duration: 0.8 },
                      })}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 32,
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    <Box
                        sx={{
                            width: 24,
                            height: 40,
                            border: '2px solid',
                            borderColor: 'primary.300',
                            borderRadius: 'xl',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        {prefersReducedMotion ? (
                            <Box
                                sx={{
                                    width: 4,
                                    height: 12,
                                    bgcolor: 'primary.500',
                                    borderRadius: 'xl',
                                    mt: 1,
                                }}
                            />
                        ) : (
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <Box
                                    sx={{
                                        width: 4,
                                        height: 12,
                                        bgcolor: 'primary.500',
                                        borderRadius: 'xl',
                                        mt: 1,
                                    }}
                                />
                            </motion.div>
                        )}
                    </Box>
                </Box>
            </motion.div>
        </Box>
    )
}
