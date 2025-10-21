'use client'

import * as React from 'react'
import { useState, useMemo, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Box, Card, CardContent, Typography } from '@/components/ui/joy'
import { useTheme } from '@mui/joy/styles'

interface BulletItem {
    text: string
    children?: string[]
}

export interface NodeDef {
    id: string
    title: string
    color: 'primary' | 'success' | 'danger' | 'info'
    bullets: Array<string | BulletItem>
    img?: string
}

interface Props {
    nodes: NodeDef[]
    centerText?: string
    breakpoint?: number
}

const connectorStrokeWidth = 1

export default function SystemDiagram({ nodes, centerText = 'Mastra orchestration', breakpoint = 900 }: Props) {
    const theme = useTheme()
    const prefersReducedMotion = useReducedMotion()
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [announceText, setAnnounceText] = useState('')

    useEffect(() => {
        if (hoveredId !== null) {
            const n = nodes.find((x) => x.id === hoveredId)
            if (n) {
                const first = n.bullets[0]
                const firstText = typeof first === 'string' ? first : first?.text ?? ''
                setAnnounceText(`${n.title}: ${firstText}`)
            }
        }
    }, [hoveredId, nodes])

    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === 'undefined') {return false}
        return window.innerWidth < breakpoint
    })

    useEffect(() => {
        if (typeof window === 'undefined') {return}
        const onResize = () => setIsMobile(window.innerWidth < breakpoint)
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [breakpoint])

    // global Escape -> collapse any expanded preview for accessibility
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {setExpandedId(null)}
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    const positions = useMemo(() => {
        const map: Record<string, { x: number; y: number }> = {}
        const padding = 18
        const layout = [
            { x: padding, y: padding },
            { x: 100 - padding, y: padding },
            { x: padding, y: 100 - padding },
            { x: 100 - padding, y: 100 - padding },
        ]
        nodes.forEach((n, i) => {
            const p = layout[i % 4]
            map[n.id] = p
        })
        return map
    }, [nodes])

    const centerPos = { x: 50, y: 50 }

    function colorToken(color: NodeDef['color']) {
        const palette = (theme.vars?.palette as unknown as Record<string, Record<string, string>>) ?? {}
        return palette[color]?.['500'] ?? palette.primary?.['500'] ?? '#3ECF8E'
    }

    const handleKey = (e: React.KeyboardEvent<HTMLElement>, id: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setExpandedId((prev) => (prev === id ? null : id))
        }
        if (e.key === 'Escape') {setExpandedId(null)}
    }

    return (
        <Box sx={{ position: 'relative', width: '100%', height: { xs: 'auto', md: 520 }, py: 6 }}>
            {isMobile ? (
                <Box sx={{ maxWidth: 900, mx: 'auto', px: 2 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography level="h3" sx={{ fontWeight: 700 }}>{centerText}</Typography>
                    </Box>
                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: 2 }}>
                        {nodes.map((n) => {
                            const isActive = expandedId === n.id
                            return (
                                <Box component="li" key={n.id}>
                                    <Box
                                        component="button"
                                        onClick={() => setExpandedId((prev) => (prev === n.id ? null : n.id))}
                                        onKeyDown={(e) => handleKey(e, n.id)}
                                        aria-expanded={isActive}
                                        aria-controls={`node-panel-${n.id}`}
                                        aria-label={`${n.title} — ${n.bullets[0] ?? ''}`}
                                        sx={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', p: 0 }}
                                    >
                                        <Card variant="outlined" sx={{ borderWidth: 1 }}>
                                            <CardContent>
                                                <Typography level="body-md" sx={{ fontWeight: 700 }}>{n.title}</Typography>
                                                {(isActive) && (
                                                    <Box sx={{ mt: 2 }} id={`node-panel-${n.id}`}>
                                                        {n.bullets.map((b, i) => {
                                                            if (typeof b === 'string') {
                                                                return (
                                                                    <Typography key={i} level="body-sm" sx={{ color: 'text.tertiary' }}>• {b}</Typography>
                                                                )
                                                            }
                                                            return (
                                                                <Box key={i} sx={{ mb: 1 }}>
                                                                    <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>• {b.text}</Typography>
                                                                    {b.children && (
                                                                        <Box component="ul" sx={{ pl: 3, mt: 0.5, mb: 0 }}>
                                                                            {b.children.map((c, idx) => (
                                                                                <Box component="li" key={idx} sx={{ listStyle: 'disc' }}>
                                                                                    <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>{c}</Typography>
                                                                                </Box>
                                                                            ))}
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            )
                                                        })}
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
            ) : (
                <Box sx={{ position: 'relative', width: '100%', height: 640 }}>
                    {/* background connector SVG */}
                    <Box sx={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
                        <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                            {nodes.map((n) => {
                                const p = positions[n.id]
                                if (p === null) {
                                    return null
                                }
                                const d = `M ${p.x} ${p.y} C ${p.x} ${(p.y + centerPos.y) / 2} ${centerPos.x} ${(p.y + centerPos.y) / 2} ${centerPos.x} ${centerPos.y}`
                                const isActive = hoveredId === n.id
                                return (
                                    <motion.path
                                        key={n.id}
                                        d={d}
                                        fill="none"
                                        stroke={isActive ? colorToken(n.color) : 'rgba(255,255,255,0.06)'}
                                        strokeWidth={connectorStrokeWidth}
                                        strokeDasharray="6 6"
                                        animate={isActive && prefersReducedMotion === false ? { strokeDashoffset: [0, -12, 0], transition: { duration: 1.2, repeat: Infinity } } : { strokeDashoffset: 0 }}
                                    />
                                )
                            })}
                            <rect x="44" y="44" width="12" height="12" rx="1" fill="rgba(0,0,0,0)" stroke="rgba(255,255,255,0.06)" />
                        </motion.svg>
                    </Box>

                    <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 20, pointerEvents: 'none' }}>
                        <Card variant="outlined" sx={{ px: 3, py: 2, borderWidth: 1 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography level="body-md" sx={{ fontWeight: 700 }}>{centerText}</Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                        {nodes.map((n) => {
                            const pos = positions[n.id]
                            if (pos === null) {return null}
                            const left = `${pos.x}%`
                            const top = `${pos.y}%`
                            const isActive = hoveredId === n.id
                            const colorHex = colorToken(n.color)
                            return (
                                <Box key={n.id} sx={{ position: 'absolute', left, top, transform: 'translate(-50%, -50%)', zIndex: 30 }}>
                                    <motion.div
                                        onMouseEnter={() => setHoveredId(n.id)}
                                        onMouseLeave={() => setHoveredId((prev) => (prev === n.id ? null : prev))}
                                        onFocus={() => setHoveredId(n.id)}
                                        onBlur={() => setHoveredId((prev) => (prev === n.id ? null : prev))}
                                        onClick={() => setExpandedId((prev) => (prev === n.id ? null : n.id))}
                                        onKeyDown={(e) => handleKey(e, n.id)}
                                        tabIndex={0}
                                        role="button"
                                        aria-expanded={expandedId === n.id}
                                        aria-label={`${n.title} — ${(() => {
                                            const first = n.bullets[0]
                                            return typeof first === 'string' ? first : first?.text ?? ''
                                        })()}`}
                                        animate={isActive ? { scale: prefersReducedMotion === true ? 1 : 1.03 } : { scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                                    >
                                        <Box sx={{ width: { xs: '60%', md: '20%' }, minWidth: 180, maxWidth: 360, cursor: 'pointer', outline: 'none' }}>
                                            <Card variant="outlined" sx={{ borderWidth: 1, borderColor: isActive ? colorHex : 'rgba(255,255,255,0.04)', boxShadow: isActive ? `0 8px 32px ${colorHex}33` : 'none' }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                        {/* Render an illustrative SVG instead of image */}
                                                        <Box sx={{ width: 64, height: 64 }}>{/* icon placeholder */}
                                                            {/* simple svg */}
                                                            <svg viewBox="0 0 64 64" width="64" height="64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                                                <rect x="8" y="8" width="48" height="48" rx="8" fill={colorHex} opacity="0.12" />
                                                            </svg>
                                                        </Box>
                                                        <Typography level="body-md" sx={{ fontWeight: 700 }}>{n.title}</Typography>
                                                    </Box>
                                                    {(isActive || expandedId === n.id) && (
                                                        <Box sx={{ mt: 1 }}>
                                                            {n.bullets.map((b, i) => {
                                                                if (typeof b === 'string') {
                                                                    return (
                                                                        <Box key={i} sx={{ mb: 0.5 }}>
                                                                            <Typography level="body-sm" sx={{ color: 'text.tertiary', fontWeight: 600 }}>• {b}</Typography>
                                                                        </Box>
                                                                    )
                                                                }
                                                                return (
                                                                    <Box key={i} sx={{ mb: 1 }}>
                                                                        <Typography level="body-sm" sx={{ color: 'text.tertiary', fontWeight: 600 }}>• {b.text}</Typography>
                                                                        {b.children && (
                                                                            <Box component="ul" sx={{ pl: 3, mt: 0.5, mb: 0 }}>
                                                                                {b.children.map((c, idx) => (
                                                                                    <Box component="li" key={idx} sx={{ listStyle: 'disc' }}>
                                                                                        <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>{c}</Typography>
                                                                                    </Box>
                                                                                ))}
                                                                            </Box>
                                                                        )}
                                                                    </Box>
                                                                )
                                                            })}
                                                        </Box>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    </motion.div>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
            )}

            <Box role="status" aria-live="polite" className="sd-hidden-clip">{announceText}</Box>
        </Box>
    )
}


