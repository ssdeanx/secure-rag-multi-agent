'use client';

import AuthPanel from '@/components/AuthPanel';
import ChatInterface from '@/components/ChatInterface';
import IndexingPanel from '@/components/IndexingPanel';
import SecurityIndicator from '@/components/SecurityIndicator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TopNavigation } from '@/components/TopNavigation';
import { UserMenu } from '@/components/UserMenu';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Footer } from '@/components/Footer';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [jwt, setJwt] = useState<string>('');
  const [currentRole, setCurrentRole] = useState<string>('');
  const [currentView, setCurrentView] = useState('home');

  const handleSignOut = () => {
    setJwt('');
    setCurrentRole('');
  };

  const handleNavigation = (itemId: string) => {
    setCurrentView(itemId);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <TopNavigation>
          <SidebarTrigger />
          <SecurityIndicator role={currentRole} />
          <ThemeToggle />
          <UserMenu 
            currentRole={currentRole} 
            onSignOut={handleSignOut}
          />
        </TopNavigation>

        <div className="flex flex-1 overflow-hidden">
          <AppSidebar 
            currentRole={currentRole}
            onNavigate={handleNavigation}
          />

          <SidebarInset className="flex flex-col">
            <div className="flex-1 p-6 space-y-8">
              {currentView === 'indexing' && (
                <IndexingPanel jwt={jwt || 'anonymous'} />
              )}
              
              {currentView === 'home' && !jwt ? (
                <div className="space-y-8">
                  <div className="text-center py-12">
                    <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4">Secure Access Required</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                      This system demonstrates enterprise-grade security for RAG applications.
                      Select a role below to see how different users access different information.
                    </p>
                  </div>

                  <AuthPanel onAuth={(token, role) => {
                    setJwt(token);
                    setCurrentRole(role);
                  }} />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Shield className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="ml-3 font-semibold">Public Access</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Basic information available to all authenticated users
                      </p>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                          <Shield className="h-6 w-6 text-yellow-500" />
                        </div>
                        <h3 className="ml-3 font-semibold">Internal Access</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Department-specific information for authorized roles
                      </p>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                          <Shield className="h-6 w-6 text-red-500" />
                        </div>
                        <h3 className="ml-3 font-semibold">Confidential Access</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sensitive data requiring admin privileges and step-up auth
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(currentView === 'home' || currentView === 'chat') && jwt && (
                <div className="space-y-6">
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-primary" />
                        <span className="text-sm">
                          Logged in as <span className="font-semibold">{currentRole}</span>
                        </span>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                  <ChatInterface jwt={jwt} role={currentRole} />
                </div>
              )}
            </div>
          </SidebarInset>
        </div>

        <Footer />
      </div>
    </SidebarProvider>
  );
}