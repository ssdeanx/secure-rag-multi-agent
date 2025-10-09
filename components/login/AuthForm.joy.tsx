'use client';

import { useState } from 'react';
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
    Divider,
} from '@/components/ui/joy';
import { Visibility, VisibilityOff, Login, PersonAdd, GitHub } from '@mui/icons-material';
import Link from 'next/link';


interface AuthFormData {
    email: string;
    password: string;
    role?: string;
}

interface AuthFormProps {
    mode: 'login' | 'signup';
    onSubmit: (data: AuthFormData) => Promise<void>;
}


const demoRoles = [
    { value: 'admin', label: 'Admin (All Access)' },
    { value: 'finance_admin', label: 'Finance Admin' },
    { value: 'finance_viewer', label: 'Finance Viewer' },
    { value: 'hr_admin', label: 'HR Admin' },
    { value: 'hr_viewer', label: 'HR Viewer' },
    { value: 'employee', label: 'Employee' },
    { value: 'public', label: 'Public' },
];

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('employee');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSubmit({
                email,
                password,
                ...(mode === 'signup' && { role }),
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGitHubLogin = async () => {
        setError('');
        setLoading(true);

        try {
            window.location.href = '/api/auth/github/login';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'GitHub login failed');
            setLoading(false);
        }
    };

    const isSignup = mode === 'signup';

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
                    <Typography level="body-md" sx={{ color: 'text.secondary' }}>
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
                            bgcolor: 'github.main',
                            '&:hover': {
                                bgcolor: 'github.dark',
                            }
                        }}
                    >
                        {loading ? 'Connecting to GitHub...' : 'Continue with GitHub'}
                    </Button>

                    <Box sx={{ position: 'relative', mb: 3 }}>
                        <Divider>
                            <Typography level="body-sm" sx={{ px: 2, bgcolor: 'background.surface' }}>
                                Alternative Sign In
                            </Typography>
                        </Divider>
                    </Box>

                    {/* Email/Password Form - Secondary, less prominent */}
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography level="body-sm" sx={{ fontWeight: 600, textAlign: 'center', mb: 1 }}>
                                Or use email and password
                            </Typography>

                            <Box>
                                <Typography level="body-sm" sx={{ mb: 0.5, fontWeight: 600 }}>
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
                                />
                            </Box>

                            <Box>
                                <Typography level="body-sm" sx={{ mb: 0.5, fontWeight: 600 }}>
                                    Password
                                </Typography>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    fullWidth
                                    size="sm"
                                    endDecorator={
                                        <Button
                                            variant="plain"
                                            color="neutral"
                                            size="sm"
                                            onClick={() => setShowPassword(!showPassword)}
                                            sx={{ minHeight: 0, px: 1 }}
                                        >
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </Button>
                                    }
                                />
                            </Box>

                            {isSignup && (
                                <Box>
                                    <Typography level="body-sm" sx={{ mb: 0.5, fontWeight: 600 }}>
                                        Role
                                    </Typography>
                                    <Select
                                        value={role}
                                        onChange={(_, newValue) => setRole(newValue as string)}
                                        size="sm"
                                    >
                                        {demoRoles.map((r) => (
                                            <Option key={r.value} value={r.value}>
                                                {r.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Box>
                            )}

                            {!isSignup && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Link href="/forgot-password">
                                        <Typography
                                            level="body-sm"
                                            sx={{
                                                color: 'primary.500',
                                                textDecoration: 'none',
                                                '&:hover': { textDecoration: 'underline' },
                                            }}
                                        >
                                            Forgot password?
                                        </Typography>
                                    </Link>
                                </Box>
                            )}

                            <Button
                                type="submit"
                                variant="outlined"
                                color="primary"
                                size="sm"
                                loading={loading}
                                startDecorator={isSignup ? <PersonAdd /> : <Login />}
                                fullWidth
                                disabled={loading}
                            >
                                {isSignup ? 'Create Account' : 'Sign In'}
                            </Button>
                        </Box>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <Link href={isSignup ? '/login' : '/signup'}>
                                <Typography
                                    level="body-sm"
                                    sx={{
                                        color: 'primary.500',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        '&:hover': { textDecoration: 'underline' },
                                    }}
                                >
                                    {isSignup ? 'Sign in' : 'Sign up'}
                                </Typography>
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
