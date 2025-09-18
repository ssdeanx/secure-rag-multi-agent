'use client';

import { 
  Shield, 
  MessageSquare, 
  Database, 
  FileText, 
  Settings, 
  Home,
  User
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  active?: boolean;
  badge?: string;
}

interface AppSidebarProps {
  currentRole?: string;
  onNavigate?: (itemId: string) => void;
}

export function AppSidebar({
  currentRole,
  onNavigate
}: AppSidebarProps) {
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '#home',
      active: true,
    },
    {
      id: 'chat',
      label: 'Chat Interface',
      icon: MessageSquare,
      href: '#chat',
      active: false,
    },
    {
      id: 'indexing',
      label: 'Document Indexing',
      icon: Database,
      href: '#indexing',
      active: false,
    },
    {
      id: 'docs',
      label: 'Documentation',
      icon: FileText,
      href: '#docs',
      active: false,
    },
  ];

  const handleItemClick = (item: NavigationItem) => {
    if (onNavigate) {
      onNavigate(item.id);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2">
          <Shield className="h-6 w-6 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Governed RAG
            </span>
            <span className="text-xs text-muted-foreground">
              Secure AI Platform
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleItemClick(item)}
                      isActive={item.active}
                      tooltip={item.label}
                    >
                      <Icon />
                      <span>{item.label}</span>
                      {item.badge && item.badge.length > 0 && (
                        <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {currentRole && currentRole.length > 0 && (
          <div className="mb-3 p-2 rounded-md bg-muted">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs font-medium">Current Role</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {currentRole.replace('.', ' ')}
                </span>
              </div>
            </div>
          </div>
        )}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}