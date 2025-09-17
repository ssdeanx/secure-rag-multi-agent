'use client';

import { SignJWT } from 'jose';
import { Shield, Key, Lock } from 'lucide-react';
import { useState, useCallback, Dispatch, SetStateAction } from 'react';

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
      const secret: Uint8Array = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || 'dev-secret');
      
      const jwt = await new SignJWT({
        sub: `demo-user-${role.id}@example.com`,
        roles: ["employee", ...role.roles], // Add base employee role for all users
        tenant: 'acme',
        stepUp: role.stepUp || false,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret);

      onAuth(jwt, role.name);
    } catch (error) {
      // Just handle the error silently - no need to log in UI component
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="glass-effect rounded-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Select Demo Role</h2>
        <p className="text-gray-400">
          Choose a role to see how access control works in the Governed RAG system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role)}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              selectedRole?.id === role.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{role.icon}</span>
              {role.stepUp && (
                <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  Step-Up Auth
                </span>
              )}
            </div>
            
            <h3 className="font-semibold text-lg mb-1">{role.name}</h3>
            <p className="text-sm text-gray-400 mb-3">{role.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {role.roles.map((r) => (
                <span
                  key={r}
                  className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300"
                >
                  {r}
                </span>
              ))}
            </div>

            <div className="mt-3">
              <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full border
                ${role.classification === 'confidential' ? 'security-badge-confidential' :
                  role.classification === 'internal' ? 'security-badge-internal' :
                  'security-badge-public'}`}>
                <Lock className="h-3 w-3 mr-1" />
                Max: {role.classification}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedRole && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => generateJWT(selectedRole)}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold
                     hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50
                     disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Key className="h-5 w-5" />
                <span>Authenticate as {selectedRole.name}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}