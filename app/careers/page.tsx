import React from 'react'
import type { Metadata } from 'next'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    Avatar,
} from '@/components/ui/joy'
import {
    Work,
    LocationOn,
    AccessTime,
    Email,
    Code,
    Security,
    Cloud,
} from '@mui/icons-material'

const jobOpenings = [
    {
        title: 'Senior Full Stack Developer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        description: 'Build the next generation of secure RAG systems with modern React and Node.js technologies.',
        requirements: ['React/Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'AI/ML'],
        icon: Code,
    },
    {
        title: 'Security Engineer',
        department: 'Security',
        location: 'Remote',
        type: 'Full-time',
        description: 'Design and implement security controls for enterprise RAG systems and multi-tenant architectures.',
        requirements: ['Security Architecture', 'RBAC Systems', 'Encryption', 'Compliance', 'Risk Assessment'],
        icon: Security,
    },
    {
        title: 'DevOps Engineer',
        department: 'Infrastructure',
        location: 'Remote',
        type: 'Full-time',
        description: 'Manage cloud infrastructure and CI/CD pipelines for scalable RAG applications.',
        requirements: ['AWS/Azure', 'Kubernetes', 'Docker', 'CI/CD', 'Monitoring'],
        icon: Cloud,
    },
]

export default function CareersPage() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.surface',
                pt: 8,
                pb: 8,
            }}
        >
            <Box
                sx={{
                    maxWidth: '1200px',
                    mx: 'auto',
                    px: { xs: 3, sm: 4 },
                }}
            >
                {/* Hero Section */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography level="h1" sx={{ mb: 2, fontWeight: 800 }}>
                        Join Our Team
                    </Typography>
                    <Typography
                        level="h3"
                        sx={{
                            mb: 3,
                            color: 'text.secondary',
                            maxWidth: '600px',
                            mx: 'auto',
                        }}
                    >
                        Help us build the future of secure, enterprise-grade RAG systems
                    </Typography>
                    <Typography level="body-lg" sx={{ color: 'text.secondary' }}>
                        We're always looking for talented individuals passionate about AI, security, and scalable systems.
                    </Typography>
                </Box>

                {/* Why Work With Us */}
                <Card sx={{ mb: 8, p: 4 }}>
                    <CardContent>
                        <Typography level="h2" sx={{ mb: 4, textAlign: 'center' }}>
                            Why Work With Us?
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid xs={12} sm={6} md={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Work sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                    <Typography level="h4" sx={{ mb: 1 }}>
                                        Meaningful Work
                                    </Typography>
                                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                                        Build cutting-edge AI systems that solve real enterprise problems
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid xs={12} sm={6} md={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <LocationOn sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                    <Typography level="h4" sx={{ mb: 1 }}>
                                        Remote First
                                    </Typography>
                                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                                        Work from anywhere with flexible hours and modern tools
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid xs={12} sm={6} md={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <AccessTime sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                    <Typography level="h4" sx={{ mb: 1 }}>
                                        Growth Focused
                                    </Typography>
                                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                                        Continuous learning with conference budgets and training
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Open Positions */}
                <Box sx={{ mb: 8 }}>
                    <Typography level="h2" sx={{ mb: 4, textAlign: 'center' }}>
                        Open Positions
                    </Typography>
                    <Grid container spacing={3}>
                        {jobOpenings.map((job, index) => (
                            <Grid xs={12} md={6} lg={4} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 'xl',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: 'primary.softBg',
                                                    color: 'primary.main',
                                                    mr: 2,
                                                }}
                                            >
                                                <job.icon />
                                            </Avatar>
                                            <Box>
                                                <Typography level="h4" sx={{ fontWeight: 600 }}>
                                                    {job.title}
                                                </Typography>
                                                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                                                    {job.department}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                            <Chip variant="soft" color="neutral" size="sm">
                                                {job.location}
                                            </Chip>
                                            <Chip variant="soft" color="primary" size="sm">
                                                {job.type}
                                            </Chip>
                                        </Box>

                                        <Typography level="body-sm" sx={{ mb: 3, color: 'text.secondary' }}>
                                            {job.description}
                                        </Typography>

                                        <Typography level="body-sm" sx={{ fontWeight: 600, mb: 2 }}>
                                            Requirements:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {job.requirements.map((req, reqIndex) => (
                                                <Chip
                                                    key={reqIndex}
                                                    variant="outlined"
                                                    size="sm"
                                                    sx={{ fontSize: 'xs' }}
                                                >
                                                    {req}
                                                </Chip>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Contact Section */}
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <CardContent>
                        <Typography level="h3" sx={{ mb: 2 }}>
                            Don't see your role?
                        </Typography>
                        <Typography level="body-lg" sx={{ mb: 4, color: 'text.secondary' }}>
                            We're always looking for talented people. Send us your resume and let us know how you'd like to contribute.
                        </Typography>
                        <Button
                            startDecorator={<Email />}
                            size="lg"
                            sx={{ minHeight: 48 }}
                        >
                            Send Your Resume
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
}

export const metadata: Metadata = {
    title: 'Careers | Governed RAG System',
    description: 'Join our team building secure, enterprise-grade RAG systems. Remote positions available.',
}
