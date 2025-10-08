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
} from '@/components/ui/joy';
import { Visibility, VisibilityOff, Login, PersonAdd } from '@mui/icons-material';
import Link from 'next/link';

interface AuthFormProps {
    mode: 'login' | 'signup';
    onSubmit: (data: { email: string; password: string; role?: string }) => Promise<void>;
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
                        {isSignup ? 'Create Account' : 'Welcome Back'}
                    </Typography>
                    <Typography level="body-md" sx={{ color: 'text.secondary' }}>
                        {isSignup
                            ? 'Sign up to get started with Governed RAG'
                            : 'Sign in to your account to continue'}
                    </Typography>
                </Box>

                {error && (
                    <Alert color="danger" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box>
                    <form
                        onSubmit={handleSubmit}
                        // 2.5 * 8px (MUI spacing unit) = 20px gap to match original sx gap: 2.5
                        style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                    >
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
                                <Link href="/forgot-password" passHref legacyBehavior>
                                    <Typography
                                        component="a"
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
                            variant="solid"
                            color="primary"
                            size="lg"
                            loading={loading}
                            startDecorator={isSignup ? <PersonAdd /> : <Login />}
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            {isSignup ? 'Create Account' : 'Sign In'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                                <Link href={isSignup ? '/login' : '/signup'} passHref legacyBehavior>
                                    <Typography
                                        component="a"
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
                    </form>
                </Box>
            </CardContent>
        </Card>
    );
}
