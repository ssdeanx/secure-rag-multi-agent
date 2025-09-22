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
    (data?.data as Record<string, unknown>)?.accessToken
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.length > 0) {
      return candidate;
    }
  }
  return null;
}

interface AuthBody {
  email: string;
  password: string;
  role?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body: AuthBody = { email, password };
      if (role) { body.role = role; }

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
      if (token === null) {
        // still allow storing a role/email for flows that don't immediately return a token
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role || '');
      } else {
        localStorage.setItem('jwt', token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role || '');
      }

      // emit an auth event so other parts of the app (header etc.) can react
      const ev = new CustomEvent('auth:login', {
        detail: {
          email,
          role,
          ...(token !== null && { token })
        }
      });
      window.dispatchEvent(ev);

      setLoading(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center">
      <div className="max-w-7xl mx-auto px-4 login-container p-6">
        <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">{mode === 'login' ? 'Sign in' : 'Sign up'}</h1>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 bg-background"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 bg-background"
                placeholder="Choose a secure password"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
              <select
                id="role"
                aria-label="Select role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 bg-background"
              >
                <option value="employee">Employee (default)</option>
                <option value="engineering.admin">Engineering Admin</option>
                <option value="finance.viewer">Finance Viewer</option>
                <option value="hr.admin">HR Admin</option>
              </select>
            </div>

            {(error !== null) && <div role="alert" className="text-sm text-destructive">{error}</div>}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="btn btn-ghost btn-sm">
                  {mode === 'login' ? 'Create account' : 'Back to sign in'}
                </Button>
              </div>

              <div className="flex items-center">
                <Button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (mode === 'login' ? 'Signing in...' : 'Creating...') : (mode === 'login' ? 'Sign in' : 'Sign up')}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
