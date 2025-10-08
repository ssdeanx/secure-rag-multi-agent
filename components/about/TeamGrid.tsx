'use client'
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/shadnui/avatar'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/shadnui/card'

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
        <section aria-labelledby="team-heading" className="py-20 bg-muted/30">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-10 space-y-3">
                    <h2
                        id="team-heading"
                        className="text-3xl font-bold tracking-tight"
                    >
                        Team
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        A focused group of engineers and researchers building
                        the future of governed AI.
                    </p>
                </div>
                <ul
                    className="grid gap-8 sm:grid-cols-2 md:grid-cols-4"
                    aria-label="Team members"
                >
                    {team.map((member, i) => (
                        <li key={member.name} className="list-none">
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
                                <Card className="h-full text-center transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:-translate-y-1">
                                    <CardHeader className="items-center">
                                        <Avatar className="mb-3 h-20 w-20 border-2 border-primary/20">
                                            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                                                {member.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <CardTitle className="text-lg leading-tight">
                                            {member.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {member.role}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
