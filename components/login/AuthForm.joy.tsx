'use client'

import { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Input,
    Typography,
    Alert,
    Card,
    CardContent,
    Divider,
    Checkbox,
    Link,
} from '@/components/ui/joy'
import {
    Visibility,
    VisibilityOff,
    Login,
    PersonAdd,
    GitHub,
} from '@mui/icons-material'

interface AuthFormProps {
    mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    // Check for saved authentication on component mount
    useEffect(() => {
        const savedAuth = localStorage.getItem('auth_remember')
        if (savedAuth !== null && savedAuth !== '') {
            try {
                const authData = JSON.parse(savedAuth)
                if (authData.expiresAt > Date.now()) {
                    // Auto-redirect if valid saved session exists
                    window.location.href = '/protected/dash'
                }
            } catch {
                // Invalid saved data, remove it
                localStorage.removeItem('auth_remember')
            }
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const endpoint =
                mode === 'signup' ? '/api/auth/signup' : '/api/auth/login'
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error ?? 'Authentication failed')
            }

            if (mode === 'signup') {
                setError(
                    data.message ?? 'Check your email to confirm your account'
                )
            } else {
                // Save authentication data if remember me is checked
                if (rememberMe) {
                    const authData = {
                        email,
                        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
                    }
                    localStorage.setItem(
                        'auth_remember',
                        JSON.stringify(authData)
                    )
                }

                window.location.href = '/protected/dash'
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Authentication failed'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleGitHubLogin = async () => {
        setError('')
        setLoading(true)
        window.location.href = '/api/auth/github'
    }

    const isSignup = mode === 'signup'

    return (
        <Card
            variant="outlined"
            sx={{
                maxWidth: 440,
                width: '100%',
                boxShadow: 'lg',
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Typography
                        level="h2"
                        sx={{
                            fontSize: '2xl',
                            fontWeight: 700,
                            mb: 1,
                        }}
                    >
                        {isSignup ? 'Join with GitHub' : 'Welcome Back'}
                    </Typography>
                    <Typography
                        level="body-md"
                        sx={{ color: 'text.secondary' }}
                    >
                        {isSignup
                            ? 'Get started quickly with your GitHub account'
                            : 'Sign in with your GitHub account'}
                    </Typography>
                </Box>

                {error && (
                    <Alert color="danger" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box>
                    {/* Primary GitHub Login - Make this the main focus */}
                    <Button
                        variant="solid"
                        color="neutral"
                        size="lg"
                        startDecorator={<GitHub />}
                        fullWidth
                        onClick={handleGitHubLogin}
                        disabled={loading}
                        sx={{
                            mb: 2,
                            py: 2,
                            fontSize: 'lg',
                            fontWeight: 600,
                            bgcolor: 'neutral.900',
                            color: 'common.white',
                            '&:hover': {
                                bgcolor: 'neutral.800',
                            },
                            '&:focus-visible': {
                                outline: '2px solid',
                                outlineColor: 'primary.500',
                                outlineOffset: '2px',
                            },
                        }}
                    >
                        {loading
                            ? 'Connecting to GitHub...'
                            : 'Continue with GitHub'}
                    </Button>

                    <Box sx={{ position: 'relative', mb: 3 }}>
                        <Divider>
                            <Typography
                                level="body-sm"
                                sx={{
                                    px: 2,
                                    backgroundColor: 'background.surface',
                                }}
                            >
                                Alternative Sign In
                            </Typography>
                        </Divider>
                    </Box>

                    {/* Email/Password Form - Secondary, less prominent */}
                    <form onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            <Typography
                                level="body-sm"
                                sx={{
                                    fontWeight: 600,
                                    textAlign: 'center',
                                    mb: 1,
                                }}
                            >
                                Or use email and password
                            </Typography>

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
                                    size="sm"
                                    sx={{
                                        '&:focus-visible': {
                                            outline: '2px solid',
                                            outlineColor: 'primary.500',
                                            outlineOffset: '2px',
                                        },
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography
                                    level="body-sm"
                                    sx={{ mb: 0.5, fontWeight: 600 }}
                                >
                                    Password
                                </Typography>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    fullWidth
                                    size="sm"
                                    endDecorator={
                                        <Button
                                            variant="plain"
                                            color="neutral"
                                            size="sm"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            sx={{ minHeight: 0, px: 1 }}
                                            aria-label={
                                                showPassword
                                                    ? 'Hide password'
                                                    : 'Show password'
                                            }
                                        >
                                            {showPassword ? (
                                                <VisibilityOff fontSize="small" />
                                            ) : (
                                                <Visibility fontSize="small" />
                                            )}
                                        </Button>
                                    }
                                    sx={{
                                        '&:focus-visible': {
                                            outline: '2px solid',
                                            outlineColor: 'primary.500',
                                            outlineOffset: '2px',
                                        },
                                    }}
                                />
                            </Box>

                            {/* Remember Me Checkbox */}
                            {!isSignup && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(e.target.checked)
                                        }
                                        label="Remember me"
                                        size="sm"
                                    />
                                </Box>
                            )}

                            {!isSignup && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <Link
                                        href="/forgot-password"
                                        level="body-sm"
                                        color="primary"
                                    >
                                        Forgot password?
                                    </Link>
                                </Box>
                            )}

                            <Button
                                type="submit"
                                variant="outlined"
                                color="primary"
                                size="sm"
                                loading={loading}
                                startDecorator={
                                    isSignup ? <PersonAdd /> : <Login />
                                }
                                fullWidth
                                disabled={loading}
                                sx={{
                                    '&:focus-visible': {
                                        outline: '2px solid',
                                        outlineColor: 'primary.500',
                                        outlineOffset: '2px',
                                    },
                                }}
                            >
                                {isSignup ? 'Create Account' : 'Sign In'}
                            </Button>
                        </Box>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography
                            level="body-sm"
                            sx={{ color: 'text.secondary' }}
                        >
                            {isSignup
                                ? 'Already have an account?'
                                : "Don't have an account?"}{' '}
                            <Link
                                href={isSignup ? '/login' : '/signup'}
                                level="body-sm"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                            >
                                {isSignup ? 'Sign in' : 'Sign up'}
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}
