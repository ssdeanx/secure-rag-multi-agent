'use client';

import { User, LogOut, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  currentRole?: string;
  onSignOut?: () => void;
}

export function UserMenu({ currentRole, onSignOut }: UserMenuProps) {
  if (!currentRole) {
    return null;
  }

  const getRoleIcon = (role: string) => {
    if (role.includes('admin')) {
      return <Shield className="h-4 w-4 text-red-500" />;
    }
    if (role.includes('viewer')) {
      return <Shield className="h-4 w-4 text-yellow-500" />;
    }
    return <User className="h-4 w-4 text-green-500" />;
  };

  const getRoleLabel = (role: string) => {
    return role.split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-300 h-10 px-3 gap-2"
          aria-label="User menu"
        >
          {getRoleIcon(currentRole)}
          <span className="hidden sm:inline-block text-xs font-medium">
            {getRoleLabel(currentRole)}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={4} align="end" className="min-w-[12rem]">
        <div className="px-2 py-1.5 text-sm font-semibold">
          <div className="flex items-center space-x-2">
            {getRoleIcon(currentRole)}
            <span>{getRoleLabel(currentRole)}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Authenticated User
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4 transition-transform duration-200 hover:rotate-90" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={onSignOut}
          className="text-destructive focus:text-destructive-foreground focus:bg-destructive"
        >
          <LogOut className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}