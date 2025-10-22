import React from 'react'
import type { Metadata } from 'next'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Alert,
    AlertDescription,
    Chip,
} from '@/components/ui/joy'
import {
    Cookie,
    Settings,
    Info,
    Shield,
} from '@mui/icons-material'

const cookieCategories = [
    {
        category: 'Essential Cookies',
        description: 'Required for basic website functionality and security',
        cookies: [
            {
                name: 'auth-token',
                purpose: 'Maintains user authentication sessions',
                duration: 'Session / 30 days',
                type: 'HTTP Cookie',
            },
            {
                name: 'csrf-token',
                purpose: 'Prevents cross-site request forgery attacks',
                duration: 'Session',
                type: 'HTTP Cookie',
            },
            {
                name: 'session-id',
                purpose: 'Tracks user session for security monitoring',
                duration: '24 hours',
                type: 'HTTP Cookie',
            },
        ],
    },
    {
        category: 'Preference Cookies',
        description: 'Remember your settings and interface preferences',
        cookies: [
            {
                name: 'theme-preference',
                purpose: 'Stores light/dark theme selection',
                duration: '1 year',
                type: 'Local Storage',
            },
            {
                name: 'language',
                purpose: 'Remembers selected language',
                duration: '1 year',
                type: 'Local Storage',
            },
            {
                name: 'sidebar-collapsed',
                purpose: 'Remembers navigation sidebar state',
                duration: 'Session',
                type: 'Local Storage',
            },
        ],
    },
    {
        category: 'Analytics Cookies',
        description: 'Help us understand how you use our services',
        cookies: [
            {
                name: '_ga',
                purpose: 'Google Analytics - tracks page views and user behavior',
                duration: '2 years',
                type: 'Third-party',
            },
            {
                name: '_gid',
                purpose: 'Google Analytics - session tracking',
                duration: '24 hours',
                type: 'Third-party',
            },
            {
                name: 'usage-stats',
                purpose: 'Internal analytics for feature usage',
                duration: '1 year',
                type: 'HTTP Cookie',
            },
        ],
    },
    {
        category: 'Security Cookies',
        description: 'Enable security features and fraud prevention',
        cookies: [
            {
                name: 'security-events',
                purpose: 'Logs security events for threat detection',
                duration: '7 days',
                type: 'HTTP Cookie',
            },
            {
                name: 'rate-limit',
                purpose: 'Prevents abuse and rate limiting',
                duration: '1 hour',
                type: 'HTTP Cookie',
            },
            {
                name: 'mfa-session',
                purpose: 'Multi-factor authentication session tracking',
                duration: '15 minutes',
                type: 'HTTP Cookie',
            },
        ],
    },
]

export default function CookiesPage() {
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
                    maxWidth: '1000px',
                    mx: 'auto',
                    px: { xs: 3, sm: 4 },
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography level="h1" sx={{ mb: 2, fontWeight: 800 }}>
                        Cookie Policy
                    </Typography>
                    <Typography level="body-lg" sx={{ color: 'text.secondary', mb: 2 }}>
                        Last updated: {new Date().toLocaleDateString()}
                    </Typography>
                    <Alert variant="soft" color="primary">
                        <Cookie />
                        <AlertDescription>
                            This policy explains how we use cookies and similar technologies to enhance your experience and ensure platform security.
                        </AlertDescription>
                    </Alert>
                </Box>

                {/* What Are Cookies */}
                <Card sx={{ mb: 6 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Info sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                            <Typography level="h2" sx={{ fontWeight: 700 }}>
                                What Are Cookies?
                            </Typography>
                        </Box>
                        <Typography level="body-lg" sx={{ mb: 3 }}>
                            Cookies are small text files stored on your device that help websites remember your preferences and provide essential functionality. We use cookies to:
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, '& li': { mb: 1 } }}>
                            <li><strong>Security:</strong> Maintain secure authentication and prevent unauthorized access</li>
                            <li><strong>Functionality:</strong> Remember your settings and preferences</li>
                            <li><strong>Performance:</strong> Improve website speed and user experience</li>
                            <li><strong>Analytics:</strong> Understand how our platform is used</li>
                            <li><strong>Compliance:</strong> Meet legal and regulatory requirements</li>
                        </Box>
                    </CardContent>
                </Card>

                {/* Cookie Categories */}
                <Box sx={{ mb: 6 }}>
                    <Typography level="h2" sx={{ mb: 4, textAlign: 'center', fontWeight: 700 }}>
                        Types of Cookies We Use
                    </Typography>
                    {cookieCategories.map((category, index) => (
                        <Card key={index} sx={{ mb: 3 }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Chip
                                        variant="solid"
                                        color="primary"
                                        size="sm"
                                        sx={{ mr: 2 }}
                                    >
                                        {category.category}
                                    </Chip>
                                </Box>
                                <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 3 }}>
                                    {category.description}
                                </Typography>

                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                                                    Cookie Name
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                                                    Purpose
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                                                    Duration
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                                                    Type
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {category.cookies.map((cookie, cookieIndex) => (
                                            <TableRow key={cookieIndex}>
                                                <TableCell>
                                                    <Typography level="body-sm" sx={{ fontFamily: 'monospace' }}>
                                                        {cookie.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography level="body-sm">
                                                        {cookie.purpose}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography level="body-sm">
                                                        {cookie.duration}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        variant="outlined"
                                                        size="sm"
                                                        color={
                                                            cookie.type === 'Third-party' ? 'warning' :
                                                            cookie.type === 'Local Storage' ? 'primary' : 'neutral'
                                                        }
                                                    >
                                                        {cookie.type}
                                                    </Chip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* How to Manage Cookies */}
                <Card sx={{ mb: 6 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Settings sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                            <Typography level="h2" sx={{ fontWeight: 700 }}>
                                Managing Your Cookie Preferences
                            </Typography>
                        </Box>
                        <Typography level="body-lg" sx={{ mb: 3 }}>
                            You have several options for managing cookies:
                        </Typography>

                        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                            <Card variant="outlined" sx={{ p: 3 }}>
                                <Typography level="h4" sx={{ mb: 2, fontWeight: 600 }}>
                                    Browser Settings
                                </Typography>
                                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                                    Most browsers allow you to control cookies through their settings. You can typically:
                                </Typography>
                                <Box component="ul" sx={{ pl: 3, mt: 2, '& li': { mb: 1, fontSize: 'sm' } }}>
                                    <li>View what cookies are stored</li>
                                    <li>Delete all cookies</li>
                                    <li>Block third-party cookies</li>
                                    <li>Block cookies from specific sites</li>
                                    <li>Clear cookies when closing browser</li>
                                </Box>
                            </Card>

                            <Card variant="outlined" sx={{ p: 3 }}>
                                <Typography level="h4" sx={{ mb: 2, fontWeight: 600 }}>
                                    Platform Settings
                                </Typography>
                                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                                    Within our platform, you can control certain preferences:
                                </Typography>
                                <Box component="ul" sx={{ pl: 3, mt: 2, '& li': { mb: 1, fontSize: 'sm' } }}>
                                    <li>Theme preferences (light/dark mode)</li>
                                    <li>Language settings</li>
                                    <li>Interface customization</li>
                                    <li>Notification preferences</li>
                                </Box>
                            </Card>
                        </Box>
                    </CardContent>
                </Card>

                {/* Important Notes */}
                <Alert variant="soft" color="warning" sx={{ mb: 6 }}>
                    <Shield />
                    <AlertDescription>
                        <Typography level="body-sm" sx={{ fontWeight: 600, mb: 1 }}>
                            Important Security Note:
                        </Typography>
                        <Typography level="body-sm">
                            Disabling essential cookies may affect platform functionality, security features, and your ability to access certain areas. Authentication and security-related cookies cannot be disabled for safety reasons.
                        </Typography>
                    </AlertDescription>
                </Alert>

                {/* Contact */}
                <Card>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Typography level="h2" sx={{ fontWeight: 700, mb: 3 }}>
                            Questions About Our Cookie Policy?
                        </Typography>
                        <Typography level="body-lg" sx={{ mb: 3, color: 'text.secondary' }}>
                            If you have questions about our cookie usage or need assistance managing your preferences, please contact us.
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                            <Typography level="body-sm">
                                <strong>Email:</strong> privacy@deanmachines.com
                            </Typography>
                            <Typography level="body-sm">
                                <strong>Subject:</strong> Cookie Policy Inquiry
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
}

export const metadata: Metadata = {
    title: 'Cookie Policy | Governed RAG System',
    description: 'Learn about how we use cookies and similar technologies to enhance your experience.',
}
