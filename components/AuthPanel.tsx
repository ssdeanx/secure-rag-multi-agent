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
    } catch (error) {
      // Just handle the error silently - no need to log in UI component
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="glass-effect rounded-xl p-8 shadow-2xl shadow-black/20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Select Demo Role
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Choose a role to see how access control works in the Governed RAG system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEMO_ROLES.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => setSelectedRole(role)}
            className={`group relative p-8 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden
              hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50
              ${selectedRole?.id === role.id
                ? 'border-blue-500 bg-gradient-to-br from-blue-500/10 to-purple-500/5 shadow-lg shadow-blue-500/20'
                : 'border-gray-700/50 hover:border-gray-600 hover:bg-gradient-to-br hover:from-gray-800/30 hover:to-gray-900/20'
            }`}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                  {role.icon}
                </span>
                {role.stepUp && (
                  <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                    Step-Up Auth
                  </span>
                )}
              </div>

              <h3 className="font-bold text-xl mb-2 group-hover:text-blue-300 transition-colors duration-300">
                {role.name}
              </h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                {role.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {role.roles.map((r) => (
                  <span
                    key={r}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-700/50 text-gray-300 border border-gray-600/50
                            group-hover:bg-gray-600/50 group-hover:text-gray-200 transition-all duration-300"
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
            </div>
          </button>
        ))}
      </div>

      {selectedRole && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => generateJWT(selectedRole)}
            disabled={loading}
            className="group relative px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-lg
                     hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
                     transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     flex items-center space-x-3 overflow-hidden"
          >
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="relative z-10 flex items-center space-x-3">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Key className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Authenticate as {selectedRole.name}</span>
                </>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
