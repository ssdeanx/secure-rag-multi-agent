'use client';

import { Shield, Lock } from 'lucide-react';
import { useCallback } from 'react';

interface SecurityIndicatorProps {
  role?: string;
}

export default function SecurityIndicator({ role }: SecurityIndicatorProps) {
  if (!role) {
    return (
      <div className="group flex items-center space-x-3 px-5 py-3 rounded-xl bg-gradient-to-r from-gray-800/60 to-gray-900/40
                    border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-black/10">
        <div className="relative">
          <Lock className="h-5 w-5 text-gray-500 group-hover:text-gray-400 transition-colors duration-300" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
        <span className="text-sm font-medium text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
          Not Authenticated
        </span>
      </div>
    );
  }

  const getSecurityLevel = useCallback((): "internal" | "confidential" | "internal-plus" => {
    if (role.includes('HR Admin')) {return 'confidential';}
    if (role.includes('Admin') || role.includes('Executive')) {return 'internal-plus';}
    return 'internal';
  }, [role]);

  const level = getSecurityLevel();

  const getLevelConfig = useCallback(() => {
    switch (level) {
      case 'confidential':
        return {
          label: 'Confidential Access',
          description: 'Full system access with step-up authentication',
          bgClass: 'from-red-500/15 to-red-600/10',
          borderClass: 'border-red-500/40 hover:border-red-400/60',
          textClass: 'text-red-400',
          iconClass: 'text-red-400',
          shadowClass: 'hover:shadow-red-500/20',
          pulseClass: 'bg-red-500'
        };
      case 'internal-plus':
        return {
          label: 'Enhanced Access',
          description: 'Cross-department administrative privileges',
          bgClass: 'from-purple-500/15 to-purple-600/10',
          borderClass: 'border-purple-500/40 hover:border-purple-400/60',
          textClass: 'text-purple-400',
          iconClass: 'text-purple-400',
          shadowClass: 'hover:shadow-purple-500/20',
          pulseClass: 'bg-purple-500'
        };
      case "internal": { throw new Error('Not implemented yet: "internal" case') }
      default:
        return {
          label: 'Internal Access',
          description: 'Department-level document access',
          bgClass: 'from-yellow-500/15 to-yellow-600/10',
          borderClass: 'border-yellow-500/40 hover:border-yellow-400/60',
          textClass: 'text-yellow-400',
          iconClass: 'text-yellow-400',
          shadowClass: 'hover:shadow-yellow-500/20',
          pulseClass: 'bg-yellow-500'
        };
    }
  }, [level]);

  const config = getLevelConfig();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
      {/* Enhanced Access Level Indicator */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-400">Access Level:</span>
        <div className="flex space-x-2">
          {/* Public Level */}
          <div className="relative group/level">
            <div className={`h-3 w-10 rounded-full transition-all duration-500 ${
              level === 'confidential' || level === 'internal-plus' || level === 'internal'
                ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-gray-700'
            }`} />
            {(level === 'confidential' || level === 'internal-plus' || level === 'internal') && (
              <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-30" />
            )}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/level:opacity-100
                          transition-opacity duration-300 text-xs text-gray-400 whitespace-nowrap">
              Public
            </div>
          </div>

          {/* Internal Level */}
          <div className="relative group/level">
            <div className={`h-3 w-10 rounded-full transition-all duration-500 ${
              level === 'confidential' || level === 'internal-plus'
                ? 'bg-yellow-500 shadow-lg shadow-yellow-500/30' : 'bg-gray-700'
            }`} />
            {(level === 'confidential' || level === 'internal-plus') && (
              <div className="absolute inset-0 bg-yellow-400 rounded-full animate-pulse opacity-30" />
            )}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/level:opacity-100
                          transition-opacity duration-300 text-xs text-gray-400 whitespace-nowrap">
              Internal
            </div>
          </div>

          {/* Confidential Level */}
          <div className="relative group/level">
            <div className={`h-3 w-10 rounded-full transition-all duration-500 ${
              level === 'confidential'
                ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-gray-700'
            }`} />
            {level === 'confidential' && (
              <div className="absolute inset-0 bg-red-400 rounded-full animate-pulse opacity-30" />
            )}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/level:opacity-100
                          transition-opacity duration-300 text-xs text-gray-400 whitespace-nowrap">
              Confidential
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Security Badge */}
      <div className={`group relative flex items-center space-x-3 px-5 py-3 rounded-xl border transition-all duration-300
                     bg-gradient-to-r ${config.bgClass} ${config.borderClass} ${config.shadowClass}
                     hover:scale-105 hover:shadow-xl overflow-hidden`}>

        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full
                      group-hover:translate-x-full transition-transform duration-1000" />

        <div className="relative z-10 flex items-center space-x-3">
          <div className="relative">
            <Shield className={`h-5 w-5 ${config.iconClass} group-hover:rotate-12 transition-transform duration-300`} />
            <div className={`absolute -top-1 -right-1 w-2 h-2 ${config.pulseClass} rounded-full animate-pulse`} />
          </div>

          <div className="flex flex-col">
            <span className={`text-sm font-bold ${config.textClass} group-hover:text-white transition-colors duration-300`}>
              {config.label}
            </span>
            <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
              {config.description}
            </span>
          </div>
        </div>

        {/* Role indicator */}
        <div className="ml-auto">
          <span className="text-xs font-mono text-gray-500 bg-gray-800/50 px-2 py-1 rounded-md">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}
