"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type AuthResponse = Record<string, unknown>;

function extractToken(data: AuthResponse): string | null {
  const candidates = [
    data?.token,
    data?.accessToken,
    data?.jwt,
    (data?.data as Record<string, unknown>)?.token,
    (data?.data as Record<string, unknown>)?.accessToken,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.length > 0) {
      return c;
    }
  }
  return null;
}

interface AuthFormProps {
  defaultMode?: 'login' | 'signup';
}

export function AuthForm({ defaultMode = 'login' }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body: { email: string; password: string; role?: string } = { email, password };
      if (role !== '') {
        body.role = role;
      }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data?.message ?? data?.error) ?? 'Authentication failed');
        setLoading(false);
        return;
      }
      const token = extractToken(data);
      if (token !== null) {
        localStorage.setItem('jwt', token);
      }
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', role || '');
      window.dispatchEvent(new CustomEvent('auth:login', { detail: { email, role, ...(token !== null && { token }) } }));
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleAuth}
      className="space-y-4"
      noValidate
      aria-describedby={error !== null && error.length > 0 ? 'auth-error' : undefined}
    >
      <div className="space-y-1">
        <label htmlFor="auth-email" className="block text-sm font-medium">Email</label>
        <input
          id="auth-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-border px-3 py-2 bg-background"
          required
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="auth-password" className="block text-sm font-medium">Password</label>
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
            name='toggle-password-visibility'
            title="Toggle password visibility"
            onClick={() => setShowPassword(v => !v)}
            className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-pressed={showPassword ? 'true' : 'false'}
            aria-expanded={showPassword ? 'true' : 'false'}
            aria-controls="auth-password"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-describedby="password-help"
            aria-haspopup="dialog"
            tabIndex={0}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <p id="password-help" className="text-xs text-muted-foreground">Use at least 12 characters, mixing letters, numbers & symbols.</p>
      </div>
      <div className="space-y-1">
        <label htmlFor="auth-role" className="block text-sm font-medium">Access Role</label>
        <select
          id="auth-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-md border border-border px-3 py-2 bg-background"
          aria-describedby="role-help"
        >
          <option value="employee">Employee (Baseline Access)</option>
          <option value="engineering.admin">Engineering Admin (Elevated)</option>
          <option value="finance.viewer">Finance Viewer (Read-only)</option>
          <option value="hr.admin">HR Admin (Sensitive HR Data)</option>
        </select>
        <p id="role-help" className="text-xs text-muted-foreground">
          Selecting an elevated role may trigger additional verification.
        </p>
      </div>
      <div className="rounded-md border border-border p-3 bg-muted/30 text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Security Notice</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Never share your token; it is stored locally only.</li>
          <li>Confidential queries require proper role elevation.</li>
          <li>We log access attempts for audit compliance.</li>
        </ul>
      </div>
      {error !== null && error.length > 0 && (
        <div id="auth-error" role="alert" className="text-sm text-destructive">{error}</div>
      )}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login' ? 'Create account' : 'Back to sign in'}
        </Button>
        <Button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? (mode === 'login' ? 'Signing in…' : 'Creating…') : (mode === 'login' ? 'Sign in' : 'Sign up')}
        </Button>
      </div>
    </form>
  );
}
