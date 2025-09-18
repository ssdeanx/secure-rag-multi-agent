'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Monitor className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out rotate-0 scale-100 hover:scale-110 hover:rotate-12" />;
      case 'light':
        return <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out rotate-0 scale-100 hover:scale-110 hover:rotate-180" />;
      case 'system':
        return <Monitor className="h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out rotate-0 scale-100 hover:scale-110" />;
      case undefined:
        return <Monitor className="h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out rotate-0 scale-100 hover:scale-110" />;
      default:
        return <Monitor className="h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out rotate-0 scale-100 hover:scale-110" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-300"
          aria-label="Toggle theme"
        >
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={4}>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
          <span>System</span>
          {theme === 'system' && <span className="ml-auto text-xs opacity-60">•</span>}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4 transition-transform duration-200 hover:rotate-180" />
          <span>Light</span>
          {theme === 'light' && <span className="ml-auto text-xs opacity-60">•</span>}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4 transition-transform duration-200 hover:rotate-12" />
          <span>Dark</span>
          {theme === 'dark' && <span className="ml-auto text-xs opacity-60">•</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}