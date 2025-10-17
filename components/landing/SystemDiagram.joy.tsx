'use client'

import * as React from 'react'
import { useState, useMemo, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Box, Card, CardContent, Typography } from '@/components/ui/joy'
import { useTheme } from '@mui/joy/styles'

interface NodeDef {
    id: string
    title: string
    color: 'primary' | 'success' | 'danger' | 'info'
    bullets: string[]
    img?: string
}

interface Props {
    nodes: NodeDef[]
    centerText?: string
    breakpoint?: number
}

const connectorStrokeWidth = 2

export default function SystemDiagram({ nodes, centerText = 'Mastra orchestration', breakpoint = 900 }: Props) {
    const theme = useTheme()
    const prefersReducedMotion = useReducedMotion()
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [announceText, setAnnounceText] = useState('')

    useEffect(() => {
        if (hoveredId) {
            const n = nodes.find((x) => x.id === hoveredId)
            if (n) {setAnnounceText(`${n.title}: ${n.bullets[0] ?? ''}`)}
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
        const paletteAny = (theme.vars && (theme.vars.palette as any)) || {}
        return paletteAny[color]?.[500] ?? paletteAny.primary?.[500] ?? '#3ECF8E'
    }

    const handleKey = (e: React.KeyboardEvent, id: string) => {
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
                                        onKeyDown={(e) => handleKey(e as any, n.id)}
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
                                                        {n.bullets.map((b, i) => (
                                                            <Typography key={i} level="body-sm" sx={{ color: 'text.tertiary' }}>• {b}</Typography>
                                                        ))}
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
                <Box sx={{ position: 'relative', width: '100%', height: 520 }}>
                    <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
                        {nodes.map((n) => {
                            const p = positions[n.id]
                            if (!p) {return null}
                            const d = `M ${p.x} ${p.y} C ${p.x} ${(p.y + centerPos.y) / 2} ${centerPos.x} ${(p.y + centerPos.y) / 2} ${centerPos.x} ${centerPos.y}`
                            const isActive = hoveredId === n.id
                            return (
                                <motion.path key={n.id} d={d} fill="none" stroke={isActive ? colorToken(n.color) : 'rgba(255,255,255,0.06)'} strokeWidth={connectorStrokeWidth} strokeDasharray="6 6" animate={(prefersReducedMotion ?? false) ? {} : isActive ? { strokeDashoffset: [0, -12, 0], transition: { duration: 1.2, repeat: Infinity } } : { strokeDashoffset: 0 }} />
                            )
                        })}
                        <rect x="44" y="44" width="12" height="12" rx="1" fill="rgba(0,0,0,0)" stroke="rgba(255,255,255,0.06)" />
                    </motion.svg>

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
                            const left = `${pos.x}%`
                            const top = `${pos.y}%`
                            const isActive = hoveredId === n.id
                            return (
                                <motion.div key={n.id} onMouseEnter={() => setHoveredId(n.id)} onMouseLeave={() => setHoveredId((prev) => (prev === n.id ? null : prev))} onFocus={() => setHoveredId(n.id)} onBlur={() => setHoveredId((prev) => (prev === n.id ? null : prev))} onClick={() => setExpandedId((prev) => (prev === n.id ? null : n.id))} onKeyDown={(e) => handleKey(e as any, n.id)} style={{ position: 'absolute', left, top, transform: 'translate(-50%, -50%)', zIndex: 30 }} tabIndex={0} role="button" aria-expanded={expandedId === n.id} aria-label={`${n.title} — ${n.bullets[0] ?? ''}`} animate={isActive ? { scale: prefersReducedMotion ? 1 : 1.03 } : { scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
                                    <Box sx={{ width: { xs: '46%', md: '18%' }, minWidth: 160, maxWidth: 320, cursor: 'pointer', outline: 'none' }}>
                                        <Card variant="outlined" sx={{ borderWidth: 1, borderColor: isActive ? colorToken(n.color) : 'rgba(255,255,255,0.04)', boxShadow: isActive ? `0 8px 32px ${colorToken(n.color)}33` : 'none' }}>
                                            <CardContent>
                                                <Typography level="body-md" sx={{ fontWeight: 700, mb: 1 }}>{n.title}</Typography>
                                {n.img ? (
                                                    <img src={n.img} alt="" className="sd-node-img" />
                                                ) : (
                                                    <Box sx={{ height: 80, bgcolor: 'background.level1', borderRadius: 1 }} />
                                                )}
                                                {(isActive || expandedId === n.id) && (
                                                    <Box sx={{ mt: 2 }}>{n.bullets.map((b, i) => (<Typography key={i} level="body-sm" sx={{ color: 'text.tertiary' }}>• {b}</Typography>))}</Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </motion.div>
                            )
                        })}
                    </Box>
                </Box>
            )}

            <Box role="status" aria-live="polite" className="sd-hidden-clip">{announceText}</Box>
        </Box>
    )
}


