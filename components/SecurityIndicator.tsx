'use client';

import { Shield, Lock } from 'lucide-react';
import { useCallback } from 'react';

interface SecurityIndicatorProps {
  role?: string;
}

export default function SecurityIndicator({ role }: SecurityIndicatorProps) {
  if (role === null) {
    return (
      <div className="group flex items-center space-x-3 px-5 py-3 rounded-xl bg-muted
                    border border-border hover:border-border/80 transition-all duration-300 hover:shadow-lg">
        <div className="relative">
          <Lock className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
        </div>
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          Not Authenticated
        </span>
      </div>
    );
  }

  const getSecurityLevel = useCallback((): "internal" | "confidential" | "internal-plus" => {
    if (role?.includes('HR Admin')) {
      return 'confidential';
    }
    if (role && (role.includes('Admin') || role.includes('Executive'))) {
      return 'internal-plus';
    }
    return 'internal';
  }, [role]);

  const level = getSecurityLevel();

  const getLevelConfig = useCallback(() => {
    switch (level) {
      case 'confidential':
        return {
          label: 'Confidential Access',
          description: 'Full system access with step-up authentication',
          bgClass: 'from-[var(--color-security-confidential)]/15 to-[var(--color-security-confidential)]/10',
          borderClass: 'border-[var(--color-security-confidential)]/40 hover:border-[var(--color-security-confidential)]/60',
          textClass: 'text-[var(--color-security-confidential)]',
          iconClass: 'text-[var(--color-security-confidential)]',
          shadowClass: 'hover:shadow-[var(--color-security-confidential)]/20',
          pulseClass: 'bg-[var(--color-security-confidential)]'
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
      case 'internal':
        return {
          label: 'Internal Access',
          description: 'Department-level document access',
          bgClass: 'from-[var(--color-security-internal)]/15 to-[var(--color-security-internal)]/10',
          borderClass: 'border-[var(--color-security-internal)]/40 hover:border-[var(--color-security-internal)]/60',
          textClass: 'text-[var(--color-security-internal)]',
          iconClass: 'text-[var(--color-security-internal)]',
          shadowClass: 'hover:shadow-[var(--color-security-internal)]/20',
          pulseClass: 'bg-[var(--color-security-internal)]'
        };
      default:
        return {
          label: 'Internal Access',
          description: 'Department-level document access',
          bgClass: 'from-[var(--color-security-internal)]/15 to-[var(--color-security-internal)]/10',
          borderClass: 'border-[var(--color-security-internal)]/40 hover:border-[var(--color-security-internal)]/60',
          textClass: 'text-[var(--color-security-internal)]',
          iconClass: 'text-[var(--color-security-internal)]',
          shadowClass: 'hover:shadow-[var(--color-security-internal)]/20',
          pulseClass: 'bg-[var(--color-security-internal)]'
        };
    }
  }, [level]);

  const config = getLevelConfig();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
      {/* Enhanced Access Level Indicator */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-muted-foreground">Access Level:</span>
        <div className="flex space-x-2">
          {/* Public Level */}
          <div className="relative group/level">
            <div className={`h-3 w-10 rounded-full transition-all duration-500 ${
              level === 'confidential' || level === 'internal-plus' || level === 'internal'
                ? 'bg-[var(--color-security-public)] shadow-lg shadow-[var(--color-security-public)]/30' : 'bg-muted'
            }`} />
            {(level === 'confidential' || level === 'internal-plus' || level === 'internal') && (
              <div className="absolute inset-0 bg-[var(--color-security-public)] rounded-full animate-pulse opacity-30" />
            )}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/level:opacity-100
                          transition-opacity duration-300 text-xs text-muted-foreground whitespace-nowrap">
              Public
            </div>
          </div>

          {/* Internal Level */}
          <div className="relative group/level">
            <div className={`h-3 w-10 rounded-full transition-all duration-500 ${
              level === 'confidential' || level === 'internal-plus'
                ? 'bg-[var(--color-security-internal)] shadow-lg shadow-[var(--color-security-internal)]/30' : 'bg-muted'
            }`} />
            {(level === 'confidential' || level === 'internal-plus') && (
              <div className="absolute inset-0 bg-[var(--color-security-internal)] rounded-full animate-pulse opacity-30" />
            )}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/level:opacity-100
                          transition-opacity duration-300 text-xs text-muted-foreground whitespace-nowrap">
              Internal
            </div>
          </div>

          {/* Confidential Level */}
          <div className="relative group/level">
            <div className={`h-3 w-10 rounded-full transition-all duration-500 ${
              level === 'confidential'
                ? 'bg-[var(--color-security-confidential)] shadow-lg shadow-[var(--color-security-confidential)]/30' : 'bg-muted'
            }`} />
            {level === 'confidential' && (
              <div className="absolute inset-0 bg-[var(--color-security-confidential)] rounded-full animate-pulse opacity-30" />
            )}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/level:opacity-100
                          transition-opacity duration-300 text-xs text-muted-foreground whitespace-nowrap">
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
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}
