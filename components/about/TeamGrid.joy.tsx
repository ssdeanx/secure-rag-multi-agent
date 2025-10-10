'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Box, Typography, Card, CardContent, Avatar } from '@/components/ui/joy'

interface TeamMember {
    name: string
    role: string
    initials: string
}

const team: TeamMember[] = [
    { name: 'Sam Dean', role: 'System Architect', initials: 'SD' },
    { name: 'Jane Doe', role: 'Security Engineer', initials: 'JD' },
    { name: 'Alex Kim', role: 'ML Engineer', initials: 'AK' },
    { name: 'Ravi Patel', role: 'Platform Engineer', initials: 'RP' },
]

export function TeamGrid() {
    const reduce = useReducedMotion()
    const prefReduce = reduce === true

    return (
        <Box
            component="section"
            aria-labelledby="team-heading"
            sx={{ py: 10, bgcolor: 'background.level1' }}
        >
            <Box sx={{ maxWidth: 1152, mx: 'auto', px: 2 }}>
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Typography
                        level="h2"
                        sx={{ fontSize: '2xl', fontWeight: 700, mb: 1.5 }}
                    >
                        Team
                    </Typography>
                    <Typography
                        level="body-lg"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 640,
                            mx: 'auto',
                        }}
                    >
                        A focused group of engineers and researchers building
                        the future of governed AI.
                    </Typography>
                </Box>

                <Box
                    component="ul"
                    aria-label="Team members"
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(4, 1fr)',
                        },
                        gap: 4,
                        listStyle: 'none',
                        p: 0,
                    }}
                >
                    {team.map((member, i) => (
                        <Box component="li" key={member.name}>
                            <motion.div
                                {...(prefReduce
                                    ? {}
                                    : {
                                          initial: { opacity: 0, y: 30 },
                                          whileInView: { opacity: 1, y: 0 },
                                          transition: {
                                              duration: 0.55,
                                              delay: i * 0.12,
                                          },
                                      })}
                                viewport={{ once: true }}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        textAlign: 'center',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 'lg',
                                            borderColor: 'primary.400',
                                        },
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 2,
                                        }}
                                    >
                                        <Avatar
                                            size="lg"
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                bgcolor: 'primary.softBg',
                                                color: 'primary.500',
                                                fontSize: 'lg',
                                                fontWeight: 600,
                                                border: '2px solid',
                                                borderColor: 'primary.200',
                                            }}
                                        >
                                            {member.initials}
                                        </Avatar>
                                        <Box>
                                            <Typography
                                                level="h4"
                                                sx={{
                                                    fontSize: 'lg',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {member.name}
                                            </Typography>
                                            <Typography
                                                level="body-sm"
                                                sx={{ color: 'text.secondary' }}
                                            >
                                                {member.role}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}
