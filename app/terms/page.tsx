import React from 'react'
import type { Metadata } from 'next'
import styles from './page.module.css'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Alert,
    AlertDescription,
    Chip,
} from '@/components/ui/joy'
import {
    Gavel,
    Security,
    Warning,
    CheckCircle,
    Info,
} from '@mui/icons-material'

export default function TermsPage() {
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
                        Terms of Service
                    </Typography>
                    <Typography level="body-lg" sx={{ color: 'text.secondary', mb: 2 }}>
                        Last updated: {new Date().toLocaleDateString()}
                    </Typography>
                    <Alert variant="soft" color="warning">
                        <Gavel />
                        <AlertDescription>
                            Please read these terms carefully before using our services.
                        </AlertDescription>
                    </Alert>
                </Box>

                {/* Summary */}
                <Alert variant="soft" color="primary" sx={{ mb: 6 }}>
                    <Info />
                    <AlertDescription>
                        <Typography level="body-sm" sx={{ fontWeight: 600, mb: 1 }}>
                            Summary:
                        </Typography>
                        By using our platform, you agree to these terms, our privacy policy, and acceptable use guidelines. We provide enterprise-grade RAG services with security and compliance as top priorities.
                    </AlertDescription>
                </Alert>

                {/* Content Sections */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Acceptance of Terms */}
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <CheckCircle sx={{ fontSize: 32, color: 'success.main', mr: 2 }} />
                                <Typography level="h2" sx={{ fontWeight: 700 }}>
                                    1. Acceptance of Terms
                                </Typography>
                            </Box>
                            <Typography level="body-lg" sx={{ mb: 3 }}>
                                By accessing or using our Governed RAG System platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                            </Typography>
                            <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                                If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Service Description */}
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Info sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                                <Typography level="h2" sx={{ fontWeight: 700 }}>
                                    2. Service Description
                                </Typography>
                            </Box>
                            <Typography level="body-lg" sx={{ mb: 3 }}>
                                Our platform provides secure, enterprise-grade Retrieval-Augmented Generation (RAG) services with:
                            </Typography>
                            <ul className={styles.termsList}>
                                <li className={styles.termsListItem}>Role-based access control (RBAC) and multi-tenant architecture</li>
                                <li className={styles.termsListItem}>Document classification and security controls</li>
                                <li className={styles.termsListItem}>Vector database integration with PostgreSQL + PgVector</li>
                                <li className={styles.termsListItem}>Multi-agent orchestration capabilities</li>
                                <li className={styles.termsListItem}>Comprehensive audit logging and compliance features</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* User Responsibilities */}
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Warning sx={{ fontSize: 32, color: 'warning.main', mr: 2 }} />
                                <Typography level="h2" sx={{ fontWeight: 700 }}>
                                    3. User Responsibilities
                                </Typography>
                            </Box>
                            <Typography level="body-lg" sx={{ mb: 3 }}>
                                You agree to:
                            </Typography>
                            <ul className={styles.termsList}>
                                <li className={styles.termsListItem}>Use the platform only for lawful purposes and in accordance with applicable laws</li>
                                <li className={styles.termsListItem}>Maintain the confidentiality of your account credentials</li>
                                <li className={styles.termsListItem}>Not attempt to circumvent security measures or access controls</li>
                                <li className={styles.termsListItem}>Respect intellectual property rights and data privacy</li>
                                <li className={styles.termsListItem}>Not upload malicious content or engage in harmful activities</li>
                                <li className={styles.termsListItem}>Report security vulnerabilities through proper channels</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Data and Security */}
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Security sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                                <Typography level="h2" sx={{ fontWeight: 700 }}>
                                    4. Data and Security
                                </Typography>
                            </Box>
                            <Typography level="body-lg" sx={{ mb: 3 }}>
                                Data Protection and Security Terms:
                            </Typography>
                            <ul className={styles.termsList}>
                                <li className={styles.termsListItem}><strong>Data Ownership:</strong> You retain ownership of your uploaded content</li>
                                <li className={styles.termsListItem}><strong>Security Measures:</strong> We implement industry-standard security controls</li>
                                <li className={styles.termsListItem}><strong>Access Controls:</strong> All access is governed by role-based permissions</li>
                                <li className={styles.termsListItem}><strong>Audit Trails:</strong> All actions are logged for compliance purposes</li>
                                <li className={styles.termsListItem}><strong>Incident Response:</strong> We maintain incident response procedures</li>
                                <li className={styles.termsListItem}><strong>Compliance:</strong> We comply with relevant data protection regulations</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Intellectual Property */}
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Typography level="h2" sx={{ fontWeight: 700, mb: 3 }}>
                                5. Intellectual Property
                            </Typography>
                            <Typography level="body-lg" sx={{ mb: 3 }}>
                                Intellectual Property Rights:
                            </Typography>
                            <ul className={styles.termsList}>
                                <li className={styles.termsListItem}>Our platform, software, and services are protected by copyright and other intellectual property laws</li>
                                <li className={styles.termsListItem}>You grant us a limited license to process your content for service provision</li>
                                <li className={styles.termsListItem}>We respect and do not claim ownership of your uploaded documents</li>
                                <li className={styles.termsListItem}>Third-party content is used in accordance with applicable licenses</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Limitation of Liability */}
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Typography level="h2" sx={{ fontWeight: 700, mb: 3 }}>
                                6. Limitation of Liability
                            </Typography>
                            <Alert variant="soft" color="warning" sx={{ mb: 3 }}>
                                <AlertDescription>
                                    <strong>Important:</strong> Please read this section carefully as it limits our liability.
                                </AlertDescription>
                            </Alert>
                            <Typography level="body-lg" sx={{ mb: 3 }}>
                                To the fullest extent permitted by law:
                            </Typography>
                            <Box component="ul" sx={{ pl: 3, '& li': { mb: 1 } }}>
                                <li>Our services are provided "as is" without warranties of any kind</li>
                                <li>We are not liable for indirect, incidental, or consequential damages</li>
                                <li>Our total liability is limited to the amount paid for services</li>
                                <li>We are not responsible for third-party content or services</li>
                                <li>Users are responsible for their own data backup and security</li>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Termination */}
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Typography level="h2" sx={{ fontWeight: 700, mb: 3 }}>
                                7. Termination
                            </Typography>
                            <Typography level="body-lg" sx={{ mb: 3 }}>
                                Account Termination Rights:
                            </Typography>
                            <Box component="ul" sx={{ pl: 3, '& li': { mb: 1 } }}>
                                <li>Either party may terminate this agreement at any time</li>
                                <li>We may suspend or terminate accounts for violations of these terms</li>
                                <li>Upon termination, your access to the platform will cease immediately</li>
                                <li>We will make reasonable efforts to export your data upon request</li>
                                <li>Some provisions of these terms survive termination</li>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Changes to Terms */}
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Typography level="h2" sx={{ fontWeight: 700, mb: 3 }}>
                                8. Changes to Terms
                            </Typography>
                            <Typography level="body-lg" sx={{ mb: 3 }}>
                                We reserve the right to modify these terms at any time:
                            </Typography>
                            <Box component="ul" sx={{ pl: 3, '& li': { mb: 1 } }}>
                                <li>Changes will be posted on this page with an updated effective date</li>
                                <li>Continued use of our services constitutes acceptance of new terms</li>
                                <li>We will notify users of material changes via email or platform notices</li>
                                <li>Users may terminate their account if they disagree with changes</li>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Governing Law */}
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Typography level="h2" sx={{ fontWeight: 700, mb: 3 }}>
                                9. Governing Law
                            </Typography>
                            <Typography level="body-lg" sx={{ mb: 3 }}>
                                These terms are governed by applicable laws and regulations:
                            </Typography>
                            <Box component="ul" sx={{ pl: 3, '& li': { mb: 1 } }}>
                                <li>Disputes will be resolved through binding arbitration</li>
                                <li>Users agree to the jurisdiction of competent courts</li>
                                <li>These terms comply with data protection and privacy laws</li>
                                <li>International users acknowledge cross-border data transfers</li>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                            <Typography level="h2" sx={{ fontWeight: 700, mb: 3 }}>
                                Contact Information
                            </Typography>
                            <Typography level="body-lg" sx={{ mb: 3 }}>
                                For questions about these Terms of Service, please contact us:
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                                <Typography level="body-sm">
                                    <strong>Email:</strong> legal@deanmachines.com
                                </Typography>
                                <Typography level="body-sm">
                                    <strong>Subject:</strong> Terms of Service Inquiry
                                </Typography>
                                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                                    We respond to legal inquiries within 5 business days
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    )
}

export const metadata: Metadata = {
    title: 'Terms of Service | Governed RAG System',
    description: 'Read our terms of service for using the Governed RAG platform and services.',
}
