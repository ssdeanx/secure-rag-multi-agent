'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, Settings, Shield, Crown, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  currentRole?: string;
  onSignOut?: () => void;
}

export function UserMenu({ currentRole, onSignOut }: UserMenuProps) {
  // Explicitly handle null/undefined/empty string so conditional narrowing is clear to TS/linter
  if (typeof currentRole !== 'string' || currentRole.trim() === '') {
    return null;
  }

  const getRoleIcon = (role: string) => {
    if (role.includes('admin')) {
      return <Crown className={cn("h-5 w-5 text-accent animate-pulse")} />;
    }
    if (role.includes('viewer')) {
      return <Eye className={cn("h-5 w-5 text-primary")} />;
    }
    return <Shield className={cn("h-5 w-5 text-accent")} />;
  };

  const getRoleLabel = (role: string) => {
    return role.split('.').map(part =>
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  };

  const getRoleColor = (role: string) => {
    if (role.includes('admin')) {
      return 'text-accent';
    }
    if (role.includes('viewer')) {
      return 'text-primary';
    }
    return 'text-accent';
  };

  const getRoleProgress = (role: string) => {
    if (role.includes('admin')) {
      return 100;
    }
    if (role.includes('viewer')) {
      return 25;
    }
    return 75; // standard user
  };

  const getRoleStatus = (role: string) => {
    if (role.includes('admin')) { return 'Full Access'; }
    if (role.includes('viewer')) { return 'Read Only'; }
    return 'Standard Access';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "group relative h-12 px-4 gap-3",
            "border-2 border-primary/30 hover:border-accent/50",
            "bg-gradient-mocha backdrop-blur-sm",
            "hover-lift hover-glow hover-scale",
            "transition-all duration-300 ease-spring",
            "btn-brutalist shadow-lg",
            "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          )}
          aria-label="User menu"
        >
          <div className={cn("flex items-center space-x-2")}>
            <Avatar className={cn("h-8 w-8")}>
              <AvatarFallback className={cn(getRoleColor(currentRole), 'text-xs')}>{currentRole.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col leading-tight")}>
              <span className={cn(
                "hidden sm:inline-block text-sm font-bold uppercase tracking-wider",
                getRoleColor(currentRole),
                "text-shadow-sm"
              )}>
                {getRoleLabel(currentRole)}
              </span>
              <span className={cn("text-xs text-muted-foreground")}>{getRoleStatus(currentRole)}</span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={8}
        align="end"
        className={cn(
          "min-w-[16rem] p-0",
          "border-4 border-primary/20",
          "bg-gradient-mocha backdrop-blur-xl",
          "shadow-2xl"
        )}
      >
        {/* Header Section */}
        <div className={cn("px-6 py-4 border-b-2 border-primary/20 bg-accent/5")}>
          <div className={cn("flex items-center space-x-3")}>
            <div className={cn("p-2 rounded-lg bg-accent/10 border border-accent/20")}>
              {getRoleIcon(currentRole)}
            </div>
            <div className={cn("flex flex-col flex-1")}>
              <div className={cn("flex items-center gap-2")}>
                <span className={cn(
                  "text-sm font-black brutalist-text",
                  getRoleColor(currentRole),
                  "text-shadow-lg"
                )}>
                  {getRoleLabel(currentRole)}
                </span>
                <Badge variant="secondary" className={cn("text-xs")}>{getRoleStatus(currentRole)}</Badge>
              </div>
              <span className={cn("text-xs text-muted-foreground font-medium")}>
                Authenticated User
              </span>
              <div className={cn("mt-2 space-y-1")}>
                <div className={cn("flex justify-between text-xs")}>
                  <span>Access Level</span>
                  <span>{getRoleProgress(currentRole)}%</span>
                </div>
                <Progress value={getRoleProgress(currentRole)} className={cn("h-2")} />
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className={cn("bg-primary/20")} />

        {/* Menu Items */}
        <div className={cn("p-2")}>
          <DropdownMenuItem asChild>
            <Link href="/settings" className={cn(
              "group/item flex items-center px-4 py-3 rounded-lg",
              "hover-lift hover-glow hover-scale",
              "transition-all duration-300 ease-spring",
              "hover:bg-accent/20 border border-transparent hover:border-accent/30",
              "focus:bg-accent/20 focus:border-accent/30"
            )}>
              <div className={cn("flex items-center w-full")}>
                <Settings className={cn("mr-3 h-5 w-5 transition-all duration-300 group-hover/item:rotate-90 group-hover/item:scale-110 text-foreground")} />
                <span className={cn("font-bold text-foreground group-hover/item:text-accent transition-colors duration-300")}>Settings</span>
                <Badge variant="outline" className={cn("ml-auto text-xs")}>
                  <Shield className={cn("h-3 w-3 mr-1")} />
                  Config
                </Badge>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className={cn("bg-primary/20 my-2")} />

          <DropdownMenuItem
            onClick={onSignOut}
            className={cn(
              "group/item cursor-pointer px-4 py-3 rounded-lg",
              "text-destructive hover:text-destructive-foreground",
              "hover-lift hover-glow hover-scale",
              "transition-all duration-300 ease-spring",
              "hover:bg-destructive/20 border border-transparent hover:border-destructive/30",
              "focus:bg-destructive/20 focus:border-destructive/30"
            )}
          >
            <div className={cn("flex items-center w-full")}>
              <LogOut className={cn("mr-3 h-5 w-5 transition-all duration-300 group-hover/item:scale-110 group-hover/item:-rotate-12 text-destructive")} />
              <span className={cn("font-bold")}>Sign Out</span>
              <Badge variant="destructive" className={cn("ml-auto text-xs")}>Exit</Badge>
            </div>
          </DropdownMenuItem>

          <p className={cn("text-xs text-muted-foreground mt-2")}>Sign out of your account securely</p>
        </div>

        {/* Decorative bottom element */}
        <div className={cn("absolute bottom-2 right-2 w-4 h-4 bg-accent/20 rounded-full blur-sm animate-pulse")} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
