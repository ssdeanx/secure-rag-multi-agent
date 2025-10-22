import React from 'react'
import type { Metadata } from 'next'
import styles from './page.module.css'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Alert,
    AlertDescription,
} from '@/components/ui/joy'
import {
    Shield,
    Lock,
    Visibility,
    Storage,
    Web,
    People,
} from '@mui/icons-material'

export default function PrivacyPage() {
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
                    maxWidth: '900px',
                    mx: 'auto',
                    px: { xs: 3, sm: 4 },
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography level="h1" sx={{ mb: 2, fontWeight: 800 }}>
                        Privacy Policy
                    </Typography>
                    <Typography level="body-lg" sx={{ color: 'text.secondary', mb: 2 }}>
                        Last updated: {new Date().toLocaleDateString()}
                    </Typography>
                    <Alert variant="soft" color="primary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                        <Shield />
                        <AlertDescription>
                            Your privacy and data security are our top priorities. This policy explains how we collect, use, and protect your information.
                        </AlertDescription>
                    </Alert>
                </Box>

                {/* Table of Contents */}
                <Card sx={{ mb: 6 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography level="h3" sx={{ mb: 2 }}>
                            Table of Contents
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {[
                                'Information We Collect',
                                'How We Use Information',
                                'Data Security',
                                'Information Sharing',
                                'Your Rights',
                                'Cookies',
                                'Contact Us',
                            ].map((section) => (
                                <Chip
                                    key={section}
                                    variant="outlined"
                                    size="sm"
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        document.getElementById(section.toLowerCase().replace(/\s+/g, '-'))?.scrollIntoView({
                                            behavior: 'smooth'
                                        })
                                    }}
                                >
                                    {section}
                                </Chip>
                            ))}
                        </Box>
                    </CardContent>
                </Card>

                {/* Content Sections */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Information We Collect */}
                    <div id="information-we-collect">
                        <Card>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Storage sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                                    <Typography level="h2" sx={{ fontWeight: 700 }}>
                                        Information We Collect
                                    </Typography>
                                </Box>
                                <Typography level="body-lg" sx={{ mb: 3 }}>
                                    We collect information you provide directly to us and information about your use of our services:
                                </Typography>
                                <ul className={styles.privacyList}>
                                    <li className={styles.privacyListItem}><strong>Account Information:</strong> Name, email, organization, and role when you create an account</li>
                                    <li className={styles.privacyListItem}><strong>Usage Data:</strong> How you interact with our platform and features</li>
                                    <li className={styles.privacyListItem}><strong>Document Data:</strong> Files and content you upload for RAG processing</li>
                                    <li className={styles.privacyListItem}><strong>Security Logs:</strong> Authentication events and access patterns</li>
                                    <li className={styles.privacyListItem}><strong>Technical Data:</strong> Browser type, IP address, and device information</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* How We Use Information */}
                    <div id="how-we-use-information">
                        <Card>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Visibility sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                                    <Typography level="h2" sx={{ fontWeight: 700 }}>
                                        How We Use Information
                                    </Typography>
                                </Box>
                                <Typography level="body-lg" sx={{ mb: 3 }}>
                                    We use collected information for the following purposes:
                                </Typography>
                                <ul className={styles.privacyList}>
                                    <li className={styles.privacyListItem}><strong>Service Provision:</strong> To provide and maintain our RAG services</li>
                                    <li className={styles.privacyListItem}><strong>Security:</strong> To enforce access controls and monitor for security threats</li>
                                    <li className={styles.privacyListItem}><strong>Improvement:</strong> To analyze usage patterns and improve our platform</li>
                                    <li className={styles.privacyListItem}><strong>Compliance:</strong> To meet legal and regulatory requirements</li>
                                    <li className={styles.privacyListItem}><strong>Support:</strong> To provide technical support and respond to inquiries</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Data Security */}
                    <div id="data-security">
                        <Card>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Lock sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                                    <Typography level="h2" sx={{ fontWeight: 700 }}>
                                        Data Security
                                    </Typography>
                                </Box>
                                <Typography level="body-lg" sx={{ mb: 3 }}>
                                    We implement industry-leading security measures to protect your data:
                                </Typography>
                                <ul className={styles.privacyList}>
                                    <li className={styles.privacyListItem}><strong>Encryption:</strong> All data encrypted in transit and at rest using AES-256</li>
                                    <li className={styles.privacyListItem}><strong>Access Controls:</strong> Role-based access control (RBAC) with multi-factor authentication</li>
                                    <li className={styles.privacyListItem}><strong>Vector Security:</strong> Secure vector embeddings with access-level classification</li>
                                    <li className={styles.privacyListItem}><strong>Audit Logging:</strong> Comprehensive security event logging and monitoring</li>
                                    <li className={styles.privacyListItem}><strong>Regular Audits:</strong> Third-party security assessments and penetration testing</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Information Sharing */}
                    <div id="information-sharing">
                        <Card>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <People sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                                    <Typography level="h2" sx={{ fontWeight: 700 }}>
                                        Information Sharing
                                    </Typography>
                                </Box>
                                <Typography level="body-lg" sx={{ mb: 3 }}>
                                    We do not sell, trade, or rent your personal information to third parties:
                                </Typography>
                                <ul className={styles.privacyList}>
                                    <li className={styles.privacyListItem}><strong>Service Providers:</strong> We may share data with trusted service providers who assist in our operations</li>
                                    <li className={styles.privacyListItem}><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect rights</li>
                                    <li className={styles.privacyListItem}><strong>Business Transfers:</strong> In the event of a merger or acquisition</li>
                                    <li className={styles.privacyListItem}><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Your Rights */}
                    <div id="your-rights">
                        <Card>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Shield sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                                    <Typography level="h2" sx={{ fontWeight: 700 }}>
                                        Your Rights
                                    </Typography>
                                </Box>
                                <Typography level="body-lg" sx={{ mb: 3 }}>
                                    You have the following rights regarding your personal data:
                                </Typography>
                                <ul className={styles.privacyList}>
                                    <li className={styles.privacyListItem}><strong>Access:</strong> Request a copy of your personal data</li>
                                    <li className={styles.privacyListItem}><strong>Correction:</strong> Request correction of inaccurate information</li>
                                    <li className={styles.privacyListItem}><strong>Deletion:</strong> Request deletion of your personal data</li>
                                    <li className={styles.privacyListItem}><strong>Portability:</strong> Request transfer of your data in a portable format</li>
                                    <li className={styles.privacyListItem}><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                                    <li className={styles.privacyListItem}><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cookies */}
                    <div id="cookies">
                        <Card>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Web sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                                    <Typography level="h2" sx={{ fontWeight: 700 }}>
                                        Cookies and Tracking
                                    </Typography>
                                </Box>
                                <Typography level="body-lg" sx={{ mb: 3 }}>
                                    We use cookies and similar technologies to enhance your experience:
                                </Typography>
                                <ul className={styles.privacyList}>
                                    <li className={styles.privacyListItem}><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                                    <li className={styles.privacyListItem}><strong>Authentication Cookies:</strong> Maintain your login session securely</li>
                                    <li className={styles.privacyListItem}><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                                    <li className={styles.privacyListItem}><strong>Analytics Cookies:</strong> Help us understand how you use our services</li>
                                </ul>
                                <Alert variant="soft" color="warning" sx={{ mt: 3 }}>
                                    <AlertDescription>
                                        You can manage cookie preferences through your browser settings. Note that disabling certain cookies may affect functionality.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact */}
                    <div id="contact-us">
                        <Card>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Shield sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                                    <Typography level="h2" sx={{ fontWeight: 700 }}>
                                        Contact Us
                                    </Typography>
                                </Box>
                                <Typography level="body-lg" sx={{ mb: 3 }}>
                                    For privacy-related questions or to exercise your rights, please contact us:
                                </Typography>
                                <ul className={styles.privacyList}>
                                    <li className={styles.privacyListItem}><strong>Email:</strong> privacy@deanmachines.com</li>
                                    <li className={styles.privacyListItem}><strong>Response Time:</strong> We respond to privacy inquiries within 30 days</li>
                                    <li className={styles.privacyListItem}><strong>Data Protection Officer:</strong> Available for escalated privacy concerns</li>
                                    <li className={styles.privacyListItem}><strong>Physical Address:</strong> Available upon request for legal matters</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </Box>
            </Box>
        </Box>
    )
}

export const metadata: Metadata = {
    title: 'Privacy Policy | Governed RAG System',
    description: 'Learn how we collect, use, and protect your personal information and data security.',
}
