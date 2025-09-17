'use client';

import { Shield, Lock } from 'lucide-react';
import { useCallback } from 'react';

interface SecurityIndicatorProps {
  role?: string;
}

export default function SecurityIndicator({ role }: SecurityIndicatorProps) {
  if (!role) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700">
        <Lock className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-500">Not Authenticated</span>
      </div>
    );
  }

  const getSecurityLevel = useCallback((): "internal" | "confidential" | "internal-plus" => {
    if (role.includes('HR Admin')) return 'confidential';
    if (role.includes('Admin') || role.includes('Executive')) return 'internal-plus';
    return 'internal';
  }, [role]);

  const level = getSecurityLevel();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400">Access Level:</span>
        <div className="flex space-x-1">
          <div className={`h-2 w-8 rounded-full ${
            level === 'confidential' || level === 'internal-plus' || level === 'internal'
              ? 'bg-green-500' : 'bg-gray-700'
          }`} />
          <div className={`h-2 w-8 rounded-full ${
            level === 'confidential' || level === 'internal-plus'
              ? 'bg-yellow-500' : 'bg-gray-700'
          }`} />
          <div className={`h-2 w-8 rounded-full ${
            level === 'confidential'
              ? 'bg-red-500' : 'bg-gray-700'
          }`} />
        </div>
      </div>

      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border
        ${level === 'confidential' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
          level === 'internal-plus' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
          'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'}`}>
        <Shield className="h-4 w-4" />
        <span className="text-xs font-medium">
          {level === 'confidential' ? 'Confidential Access' :
           level === 'internal-plus' ? 'Enhanced Access' :
           'Internal Access'}
        </span>
      </div>
    </div>
  );
}