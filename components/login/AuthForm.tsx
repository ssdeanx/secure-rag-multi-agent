'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/shadnui/button'

type AuthResponse = Record<string, unknown>

function extractToken(data: AuthResponse): string | null {
    const candidates = [
        data?.token,
        data?.accessToken,
        data?.jwt,
        (data?.data as Record<string, unknown>)?.token,
        (data?.data as Record<string, unknown>)?.accessToken,
    ]
    for (const c of candidates) {
        if (typeof c === 'string' && c.length > 0) {
            return c
        }
    }
    return null
}

interface AuthFormProps {
    defaultMode?: 'login' | 'signup'
}

export function AuthForm({ defaultMode = 'login' }: AuthFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('employee')
    const [mode, setMode] = useState<'login' | 'signup'>(defaultMode)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    async function handleAuth(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const endpoint =
                mode === 'login' ? '/api/auth/login' : '/api/auth/signup'
            const body: { email: string; password: string; role?: string } = {
                email,
                password,
            }
            if (role !== '') {
                body.role = role
            }
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(
                    data?.message ?? data?.error ?? 'Authentication failed'
                )
                setLoading(false)
                return
            }
            const token = extractToken(data)
            if (token !== null) {
                localStorage.setItem('jwt', token)
            }
            localStorage.setItem('userEmail', email)
            localStorage.setItem('userRole', role || '')
            window.dispatchEvent(
                new CustomEvent('auth:login', {
                    detail: { email, role, ...(token !== null && { token }) },
                })
            )
            setLoading(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleAuth}
            className="space-y-6 max-w-md mx-auto"
            noValidate
            aria-describedby={
                error !== null && error.length > 0 ? 'auth-error' : undefined
            }
        >
            <div className="space-y-2">
                <label
                    htmlFor="auth-email"
                    className="block text-sm font-semibold text-foreground"
                >
                    Email Address
                </label>
                <input
                    id="auth-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border-2 border-border px-4 py-3 bg-background transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    placeholder="you@company.com"
                    required
                />
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="auth-password"
                    className="block text-sm font-semibold text-foreground"
                >
                    Password
                </label>
                <div className="relative flex items-stretch">
                    {mode === 'signup' ? (
                        <input
                            id="auth-password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-border px-3 py-2 bg-background pr-12"
                            required
                            aria-describedby="password-help"
                            autoComplete="new-password"
                        />
                    ) : (
                        <input
                            id="auth-password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-border px-3 py-2 bg-background pr-12"
                            required
                            aria-describedby="password-help"
                            autoComplete="current-password"
                        />
                    )}
                    <button
                        type="button"
                        id="toggle-password-visibility"
                        name="toggle-password-visibility"
                        title="Toggle password visibility"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
                        aria-pressed={showPassword ? 'true' : 'false'}
                        aria-expanded={showPassword ? 'true' : 'false'}
                        aria-controls="auth-password"
                        aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                        }
                        aria-describedby="password-help"
                        aria-haspopup="dialog"
                        tabIndex={0}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
                <p id="password-help" className="text-xs text-muted-foreground">
                    Use at least 12 characters, mixing letters, numbers &
                    symbols.
                </p>
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="auth-role"
                    className="block text-sm font-semibold text-foreground"
                >
                    Access Role
                </label>
                <select
                    id="auth-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border-2 border-border px-4 py-3 bg-background transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
                    aria-describedby="role-help"
                >
                    <option value="employee">Employee (Baseline Access)</option>
                    <option value="engineering.admin">
                        Engineering Admin (Elevated)
                    </option>
                    <option value="finance.viewer">
                        Finance Viewer (Read-only)
                    </option>
                    <option value="hr.admin">
                        HR Admin (Sensitive HR Data)
                    </option>
                </select>
                <p id="role-help" className="text-xs text-muted-foreground">
                    Selecting an elevated role may trigger additional
                    verification.
                </p>
            </div>
            <div className="rounded-lg border-2 border-primary/20 p-4 bg-primary/5 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                    </svg>
                    Security Notice
                </p>
                <ul className="list-disc pl-4 space-y-1">
                    <li>Never share your token; it is stored locally only.</li>
                    <li>Confidential queries require proper role elevation.</li>
                    <li>We log access attempts for audit compliance.</li>
                </ul>
            </div>
            {error !== null && error.length > 0 && (
                <div
                    id="auth-error"
                    role="alert"
                    className="text-sm text-destructive"
                >
                    {error}
                </div>
            )}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                        setMode(mode === 'login' ? 'signup' : 'login')
                    }
                    className="transition-all duration-200 hover:bg-primary/5"
                >
                    {mode === 'login' ? 'Create account' : 'Back to sign in'}
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 transition-all duration-200 font-semibold"
                >
                    {loading
                        ? mode === 'login'
                            ? 'Signing in…'
                            : 'Creating…'
                        : mode === 'login'
                          ? 'Sign in'
                          : 'Sign up'}
                </Button>
            </div>
        </form>
    )
}
