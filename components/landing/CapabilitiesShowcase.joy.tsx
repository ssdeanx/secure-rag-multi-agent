'use client'

import * as React from 'react'
import { Box, Card, CardContent, Typography, Grid } from '@/components/ui/joy'
import { TrendingUp, Analytics, Search, AccountTree, NetworkPing } from '@mui/icons-material'
import { motion } from 'framer-motion'

export default function CapabilitiesShowcase() {
    const financialTools = [
        { name: 'Alpha Vantage', icon: <TrendingUp />, capabilities: ['Crypto prices', 'Stock data', 'Technical indicators'], color: 'primary' as const },
        { name: 'Finnhub', icon: <Analytics />, capabilities: ['Real-time quotes', 'Company data', 'Financials'], color: 'success' as const },
        { name: 'Polygon', icon: <TrendingUp />, capabilities: ['Aggregates', 'Snapshots', 'Fundamentals'], color: 'warning' as const },
    ]

    const researchTools = [
        { name: 'ArXiv', icon: <Search />, capabilities: ['Paper search', 'PDF parsing', 'Citation extraction'], color: 'primary' as const },
        { name: 'SerpAPI', icon: <Search />, capabilities: ['Web search', 'News', 'Trends'], color: 'info' as const },
        { name: 'Web Scraper', icon: <AccountTree />, capabilities: ['HTML extraction', 'Markdown conversion', 'Data normalization'], color: 'neutral' as const },
    ]

    const networks = [
        { name: 'Governed RAG Network',  desc: 'Identity → Policy → Retrieve → Rerank → Answer → Verify' },
        { name: 'Financial Team Network', icon: <NetworkPing />, desc: 'Market data, analysis, and education agents' },
        { name: 'Research Content Network', desc: 'Research, evaluation, learning, and editing agents' },
    ]

    return (
        <Box component="section" sx={{ py: { xs: 8, md: 12 }, mt: 6 }}>
            <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 4 } }}>
                <Typography level="h2" sx={{ fontWeight: 700, mb: 3 }}>Platform Capabilities</Typography>
                <Typography level="body-md" sx={{ color: 'text.secondary', mb: 6 }}>Financial data integrations, research tooling, and multi-agent networks designed for secure enterprise workflows.</Typography>

                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {financialTools.map((t) => (
                        <Grid item xs={12} sm={6} md={4} key={t.name}>
                            <motion.div whileHover={{ y: -6 }}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Box sx={{ bgcolor: `${t.color}.softBg`, color: `${t.color}.500`, borderRadius: '50%', p: 1.5 }}>{t.icon}</Box>
                                            <Typography level="h4" sx={{ fontWeight: 700 }}>{t.name}</Typography>
                                        </Box>

                                        <Box>
                                            {t.capabilities.map((c) => (
                                                <Typography key={c} level="body-sm" sx={{ color: 'text.tertiary' }}>• {c}</Typography>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {researchTools.map((t) => (
                        <Grid item xs={12} sm={6} md={4} key={t.name}>
                            <motion.div whileHover={{ y: -6 }}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Box sx={{ bgcolor: `${t.color}.softBg`, color: `${t.color}.500`, borderRadius: '50%', p: 1.5 }}>{t.icon}</Box>
                                            <Typography level="h4" sx={{ fontWeight: 700 }}>{t.name}</Typography>
                                        </Box>

                                        <Box>
                                            {t.capabilities.map((c) => (
                                                <Typography key={c} level="body-sm" sx={{ color: 'text.tertiary' }}>• {c}</Typography>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Typography level="h3" sx={{ fontWeight: 700, mb: 2 }}>Agent Networks</Typography>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        {networks.map((n) => (
                            <Card key={n.name} variant="outlined">
                                <CardContent>
                                    <Typography level="h4" sx={{ fontWeight: 700 }}>{n.name}</Typography>
                                    <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>{n.desc}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
