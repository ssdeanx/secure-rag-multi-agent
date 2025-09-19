# Design Document

## Overview

This design document outlines the technical approach for creating a modern, responsive layout system for the Mastra Governed RAG application. The design leverages shadcn/ui components, enhanced Tailwind CSS styling, and modern React patterns to create a cohesive user interface with a top navigation bar, collapsible sidebar, footer, and theme switching functionality.

The implementation will use the existing shadcn/ui component library (Sidebar, Button, Sheet, etc.) and integrate seamlessly with the current Next.js 15.4+ application structure while maintaining all existing functionality.

## Architecture

### Current Application Structure
- **Framework**: Next.js 15.4+ with App Router
- **Styling**: Tailwind CSS v4 with enhanced design tokens
- **Components**: React components with TypeScript
- **UI Library**: shadcn/ui components available
- **Theme System**: CSS custom properties with light/dark mode support
- **State Management**: React hooks and local state

### Target Layout Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Top Navigation Bar                       │
│  [Logo] [Nav Items]           [Theme Toggle] [User Menu]    │
├─────────────────────────────────────────────────────────────┤
│        │                                                    │
│ Side   │                Main Content Area                   │
│ bar    │  ┌─────────────────────────────────────────────┐   │
│        │  │                                             │   │
│ [Nav]  │  │         Current Page Content                │   │
│ [Nav]  │  │      (ChatInterface, AuthPanel, etc.)       │   │
│ [Nav]  │  │                                             │   │
│        │  └─────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                         Footer                              │
│     [Copyright] [Links] [Version] [Legal]                   │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy
```
RootLayout
├── TopNavigation
│   ├── Logo/Title
│   ├── NavigationMenu (desktop)
│   ├── ThemeToggle
│   ├── UserMenu
│   └── MobileSidebarTrigger
├── SidebarProvider
│   ├── Sidebar
│   │   ├── SidebarHeader
│   │   ├── SidebarContent
│   │   │   └── SidebarMenu
│   │   │       ├── SidebarMenuItem (Chat)
│   │   │       ├── SidebarMenuItem (Auth)
│   │   │       ├── SidebarMenuItem (Indexing)
│   │   │       └── SidebarMenuItem (Settings)
│   │   └── SidebarFooter
│   └── SidebarInset
│       ├── main content area
│       └── existing page components
└── Footer
    ├── Copyright
    ├── Links
    ├── Version
    └── Legal
```

## Components and Interfaces

### 1. TopNavigation Component

#### Interface Definition
```typescript
interface TopNavigationProps {
  className?: string;
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}
```

#### Implementation Approach
```typescript
// components/layout/TopNavigation.tsx
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, Bell } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export function TopNavigation({ className }: TopNavigationProps) {
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container flex h-14 items-center">
        {/* Mobile sidebar trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            {/* Mobile navigation content */}
          </SheetContent>
        </Sheet>

        {/* Logo/Title */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Mastra Governed RAG
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/chat">Chat</Link>
          <Link href="/auth">Authentication</Link>
          <Link href="/indexing">Indexing</Link>
        </nav>

        {/* Right side items */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other items */}
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <UserMenu />
          </nav>
        </div>
      </div>
    </header>
  );
}
```

### 2. Collapsible Sidebar Component

#### Interface Definition
```typescript
interface SidebarLayoutProps {
  children: React.ReactNode;
}

interface SidebarNavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: string;
  items?: SidebarNavigationItem[];
}
```

#### Implementation Approach
```typescript
// components/layout/AppSidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { 
  MessageSquare, 
  Shield, 
  Database, 
  Settings,
  Home,
  FileText
} from "lucide-react";

const navigationItems: SidebarNavigationItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Chat Interface",
    url: "/chat",
    icon: MessageSquare,
    badge: "New",
  },
  {
    title: "Authentication",
    url: "/auth",
    icon: Shield,
  },
  {
    title: "Document Indexing",
    url: "/indexing",
    icon: Database,
  },
  {
    title: "Documentation",
    url: "/docs",
    icon: FileText,
    items: [
      {
        title: "Getting Started",
        url: "/docs/getting-started",
        icon: FileText,
      },
      {
        title: "API Reference",
        url: "/docs/api",
        icon: FileText,
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Mastra RAG
                  </span>
                  <span className="truncate text-xs">
                    Governed AI System
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                  {item.items && (
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
```

### 3. Theme Toggle Component

#### Interface Definition
```typescript
interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}
```

#### Implementation Approach
```typescript
// components/layout/ThemeToggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle({ 
  className, 
  variant = "ghost", 
  size = "icon" 
}: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <span className="mr-2 h-4 w-4">💻</span>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 4. Footer Component

#### Interface Definition
```typescript
interface FooterProps {
  className?: string;
}

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}
```

#### Implementation Approach
```typescript
// components/layout/Footer.tsx
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks: FooterLink[] = [
  { label: "Documentation", href: "/docs" },
  { label: "API Reference", href: "/docs/api" },
  { label: "GitHub", href: "https://github.com/mastra-ai", external: true },
  { label: "Support", href: "/support" },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn(
      "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 Mastra Governed RAG. Built with{" "}
            <Link
              href="https://mastra.ai"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Mastra
            </Link>
            .
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {footerLinks.map((link, index) => (
            <React.Fragment key={link.href}>
              <Link
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
              {index < footerLinks.length - 1 && (
                <Separator orientation="vertical" className="h-4" />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="text-sm text-muted-foreground">
          v{process.env.npm_package_version || "1.0.0"}
        </div>
      </div>
    </footer>
  );
}
```

### 5. Root Layout Integration

#### Implementation Approach
```typescript
// app/layout.tsx (enhanced)
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <TopNavigation />
            
            <div className="flex-1 flex">
              <SidebarProvider>
                <AppSidebar />
                <main className="flex-1 flex flex-col">
                  <div className="flex-1 container py-6">
                    {children}
                  </div>
                </main>
              </SidebarProvider>
            </div>
            
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Data Models

### Theme Configuration
```typescript
interface ThemeConfig {
  defaultTheme: "light" | "dark" | "system";
  enableSystem: boolean;
  storageKey: string;
  themes: string[];
}

interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  systemTheme: string | undefined;
}
```

### Navigation State
```typescript
interface NavigationState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeRoute: string;
  breadcrumbs: BreadcrumbItem[];
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}
```

### Layout Configuration
```typescript
interface LayoutConfig {
  sidebar: {
    defaultOpen: boolean;
    collapsible: "offcanvas" | "icon" | "none";
    variant: "sidebar" | "floating" | "inset";
  };
  navigation: {
    showBreadcrumbs: boolean;
    showSearch: boolean;
    showNotifications: boolean;
  };
  footer: {
    show: boolean;
    links: FooterLink[];
  };
}
```

## Error Handling

### Theme Switching Errors
```typescript
// Handle theme switching failures gracefully
const handleThemeChange = (newTheme: string) => {
  try {
    setTheme(newTheme);
    localStorage.setItem('theme-preference', newTheme);
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
    // Continue with theme change even if storage fails
    setTheme(newTheme);
  }
};
```

### Sidebar State Persistence
```typescript
// Handle sidebar state persistence
const useSidebarState = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebar-state');
      if (saved) {
        setIsOpen(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load sidebar state:', error);
    }
  }, []);
  
  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev;
      try {
        localStorage.setItem('sidebar-state', JSON.stringify(newState));
      } catch (error) {
        console.warn('Failed to save sidebar state:', error);
      }
      return newState;
    });
  }, []);
  
  return { isOpen, toggleSidebar };
};
```

### Responsive Layout Handling
```typescript
// Handle responsive breakpoint changes
const useResponsiveLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return { isMobile };
};
```

## Testing Strategy

### Component Testing
```typescript
// Example test for TopNavigation component
describe('TopNavigation', () => {
  test('renders navigation items correctly', () => {
    render(<TopNavigation />);
    
    expect(screen.getByText('Mastra Governed RAG')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });
  
  test('shows mobile menu on small screens', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    });
    
    render(<TopNavigation />);
    
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });
});
```

### Theme Testing
```typescript
describe('ThemeToggle', () => {
  test('switches theme correctly', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    
    const themeButton = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(themeButton);
    
    const darkOption = screen.getByText('Dark');
    await user.click(darkOption);
    
    expect(document.documentElement).toHaveClass('dark');
  });
});
```

### Accessibility Testing
```typescript
describe('Accessibility', () => {
  test('sidebar navigation is keyboard accessible', async () => {
    const user = userEvent.setup();
    render(<AppSidebar />);
    
    // Test keyboard navigation
    await user.tab();
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveFocus();
    
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('link', { name: /chat interface/i })).toHaveFocus();
  });
  
  test('meets WCAG color contrast requirements', async () => {
    render(<TopNavigation />);
    
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
});
```

## Performance Considerations

### Code Splitting
```typescript
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Use Suspense for loading states
<Suspense fallback={<ComponentSkeleton />}>
  <HeavyComponent />
</Suspense>
```

### CSS Optimization
```css
/* Use CSS containment for performance */
.sidebar {
  contain: layout style paint;
}

.main-content {
  contain: layout style;
}

/* Optimize animations */
.sidebar-transition {
  transform: translateX(-100%);
  transition: transform 0.2s ease-in-out;
  will-change: transform;
}

.sidebar-transition.open {
  transform: translateX(0);
}
```

### Memory Management
```typescript
// Clean up event listeners and subscriptions
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

## Security Considerations

### XSS Prevention
- All user-generated content properly escaped
- CSP headers configured for inline styles
- Theme preferences validated before storage

### Data Privacy
- Theme preferences stored locally only
- No sensitive data in localStorage
- Proper cleanup of stored preferences

## Deployment Strategy

### Build Optimization
```javascript
// next.config.js enhancements
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
```

### Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced interactions with JavaScript enabled
- Graceful degradation for older browsers

### Performance Monitoring
- Core Web Vitals tracking
- Layout shift monitoring
- Theme switching performance metrics