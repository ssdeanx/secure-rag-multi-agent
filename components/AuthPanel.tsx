'use client';

import { SignJWT } from 'jose';
import { Key, Lock } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthPanelProps {
  onAuth: (jwt: string, role: string) => void;
}

const DEMO_ROLES = [
  {
    id: 'finance',
    name: 'Finance Viewer',
    description: 'Access to finance policies and procedures',
    roles: ['finance.viewer'],
    classification: 'internal',
    icon: '💰',
    color: 'blue'
  },
  {
    id: 'engineering',
    name: 'Engineering Admin',
    description: 'Full access to engineering documentation',
    roles: ['engineering.admin'],
    classification: 'internal',
    icon: '⚙️',
    color: 'green'
  },
  {
    id: 'hr',
    name: 'HR Admin (Step-Up)',
    description: 'Access to confidential HR information',
    roles: ['hr.admin'],
    classification: 'confidential',
    stepUp: true,
    icon: '👥',
    color: 'red'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Cross-department access',
    roles: ['finance.admin', 'engineering.viewer', 'hr.viewer'],
    classification: 'internal',
    icon: '👔',
    color: 'purple'
  }
];

export default function AuthPanel({ onAuth }: AuthPanelProps) {
  const [selectedRole, setSelectedRole] = useState<typeof DEMO_ROLES[0] | null>(null);
  const [loading, setLoading] = useState(false);

  const generateJWT = useCallback(async (role: typeof DEMO_ROLES[0]) => {
    setLoading(true);
    try {
      const secret: Uint8Array = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET ?? 'dev-secret');

      const jwt = await new SignJWT({
        sub: `demo-user-${role.id}@example.com`,
        roles: ["employee", ...role.roles], // Add base employee role for all users
        tenant: 'acme',
        stepUp: role.stepUp ?? false,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret);

      onAuth(jwt, role.name);
    } catch {
      // Just handle the error silently - no need to log in UI component
    } finally {
      setLoading(false);
    }
  }, [onAuth]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Select Demo Role
        </CardTitle>
        <CardDescription className="text-lg">
          Choose a role to see how access control works in the Governed RAG system
        </CardDescription>
      </CardHeader>
      <CardContent>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEMO_ROLES.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                selectedRole?.id === role.id
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'hover:border-border/80 hover:bg-accent/50'
              }`}
              onClick={() => setSelectedRole(role)}
            >
              <CardContent>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                    {role.icon}
                  </span>
                  {role.stepUp === true && (
                    <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-destructive/20 text-destructive border border-destructive/30 animate-pulse">
                      Step-Up Auth
                    </span>
                  )}
                </div>

                <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors duration-300">
                  {role.name}
                </CardTitle>
                <CardDescription className="mb-4">
                  {role.description}
                </CardDescription>

                <div className="flex flex-wrap gap-2 mb-4">
                  {role.roles.map((r) => (
                    <span
                      key={r}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border
                              group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300"
                    >
                      {r}
                    </span>
                  ))}
                </div>

                <div className="flex items-center">
                  <span className={`inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-300
                    ${role.classification === 'confidential' ? 'security-badge-confidential' :
                      role.classification === 'internal' ? 'security-badge-internal' :
                      'security-badge-public'}`}>
                    <Lock className="h-3 w-3 mr-1.5" />
                    Max: {role.classification}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedRole && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => generateJWT(selectedRole)}
              disabled={loading}
              size="lg"
              className="px-10 py-4 font-bold text-lg hover:scale-105 transition-all duration-300"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Key className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Authenticate as {selectedRole.name}</span>
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
