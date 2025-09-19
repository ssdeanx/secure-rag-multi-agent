'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoggedInAlertProps {
  currentRole: string;
  onSignOut: () => void;
}

export function LoggedInAlert({ currentRole, onSignOut }: LoggedInAlertProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <div className="text-sm">Logged in as <span className="font-semibold">{currentRole}</span></div>
      </div>
      <div>
        <Button onClick={onSignOut} className="btn btn-ghost btn-sm">
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default LoggedInAlert;
