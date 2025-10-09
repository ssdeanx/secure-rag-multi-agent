/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import {
    Box,
    Button,
    Input,
    Typography,
    Alert,
    Card,
    CardContent,
    Select,
    Option,
    Textarea,
} from '@/components/ui/joy'
import { Send, CheckCircle } from '@mui/icons-material'

interface ContactFormData {
    name: string
    email: string
    subject: string
    message: string
}

interface ContactFormProps {
    onSubmit?: (...args: [ContactFormData]) => Promise<void>
}

const subjects = [
    'General Inquiry',
    'Product Demo',
    'Technical Support',
    'Partnership',
    'Security & Compliance',
    'Other',
]

export function ContactForm({ onSubmit }: ContactFormProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState(subjects[0])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (onSubmit) {
                await onSubmit({ name, email, subject, message })
            } else {
                // Default behavior - simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1500))
            }
            setSuccess(true)
            setName('')
            setEmail('')
            setSubject(subjects[0])
            setMessage('')
            setTimeout(() => setSuccess(false), 5000)
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to send message'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card
            variant="outlined"
            sx={{
                maxWidth: 600,
                width: '100%',
                boxShadow: 'lg',
            }}
        >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Box sx={{ mb: 3 }}>
                    <Typography
                        level="h2"
                        sx={{
                            fontSize: '2xl',
                            fontWeight: 700,
                            mb: 1,
                        }}
                    >
                        Get in Touch
                    </Typography>
                    <Typography
                        level="body-md"
                        sx={{ color: 'text.secondary' }}
                    >
                        Have a question? We'd love to hear from you.
                    </Typography>
                </Box>

                {success && (
                    <Alert
                        color="success"
                        startDecorator={<CheckCircle />}
                        sx={{ mb: 3 }}
                    >
                        Message sent successfully! We'll get back to you soon.
                    </Alert>
                )}

                {error && (
                    <Alert color="danger" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}
                    >
                        <Box>
                            <Typography
                                level="body-sm"
                                sx={{ mb: 0.5, fontWeight: 600 }}
                            >
                                Name
                            </Typography>
                            <Input
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                fullWidth
                            />
                        </Box>

                        <Box>
                            <Typography
                                level="body-sm"
                                sx={{ mb: 0.5, fontWeight: 600 }}
                            >
                                Email
                            </Typography>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                            />
                        </Box>

                        <Box>
                            <Typography
                                level="body-sm"
                                sx={{ mb: 0.5, fontWeight: 600 }}
                            >
                                Subject
                            </Typography>
                            <Select
                                value={subject}
                                onChange={(_, newValue) =>
                                    setSubject(newValue as string)
                                }
                            >
                                {subjects.map((s) => (
                                    <Option key={s} value={s}>
                                        {s}
                                    </Option>
                                ))}
                            </Select>
                        </Box>

                        <Box>
                            <Typography
                                level="body-sm"
                                sx={{ mb: 0.5, fontWeight: 600 }}
                            >
                                Message
                            </Typography>
                            <Textarea
                                placeholder="Tell us more about your inquiry..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                minRows={5}
                                sx={{ width: '100%' }}
                            />
                        </Box>

                        <Button
                            type="submit"
                            variant="solid"
                            color="primary"
                            size="lg"
                            loading={loading}
                            startDecorator={<Send />}
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            Send Message
                        </Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    )
}
