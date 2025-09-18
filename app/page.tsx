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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, AlertCircle, CheckCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-background flex flex-col animated-gradient-subtle">
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
            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto fluid-container">
              <div className="w-full max-w-screen-2xl mx-auto space-y-6 sm:space-y-8 fluid-content">
              {currentView === 'indexing' && (
                <IndexingPanel jwt={jwt || 'anonymous'} />
              )}

              {currentView === 'home' && !jwt && (
                <div className="space-y-8">
                  <div className="content-center py-8 sm:py-12 lg:py-16">
                    <Lock className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4 sm:mb-6 size-fit" />
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Secure Access Required</h2>
                    <p className="text-muted-foreground max-w-2xl mb-6 sm:mb-8 text-sm sm:text-base">
                      This system demonstrates enterprise-grade security for RAG applications.
                      Select a role below to see how different users access different information.
                    </p>
                  </div>

                  <div className="flex items-center justify-center">
                    <AuthPanel onAuth={(token, role) => {
                      setJwt(token);
                      setCurrentRole(role);
                    }} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 sm:mt-12 grid-center">
                    <Card className="hover:shadow-md transition-shadow hover-lift hover-glow neon-glow-cyan">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-[var(--color-security-public)]/10 rounded-lg size-fit">
                            <Shield className="h-6 w-6 text-[var(--color-security-public)]" />
                          </div>
                          <CardTitle className="ml-3 text-lg">Public Access</CardTitle>
                          <Badge variant="secondary" className="ml-auto">Basic</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Basic information available to all authenticated users
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow hover-lift hover-glow neon-glow-green">
                       <CardContent className="p-6">
                         <div className="flex items-center mb-4">
                           <div className="p-2 bg-[var(--color-security-internal)]/10 rounded-lg size-fit">
                             <Shield className="h-6 w-6 text-[var(--color-security-internal)]" />
                           </div>
                           <CardTitle className="ml-3 text-lg">Internal Access</CardTitle>
                           <Badge variant="secondary" className="ml-auto">Department</Badge>
                         </div>
                         <p className="text-sm text-muted-foreground">
                           Department-specific information for authorized roles
                         </p>
                       </CardContent>
                     </Card>

                    <Card className="hover:shadow-md transition-shadow hover-lift hover-glow neon-glow-purple">
                       <CardContent className="p-6">
                         <div className="flex items-center mb-4">
                           <div className="p-2 bg-[var(--color-security-confidential)]/10 rounded-lg size-fit">
                             <Shield className="h-6 w-6 text-[var(--color-security-confidential)]" />
                           </div>
                           <CardTitle className="ml-3 text-lg">Confidential Access</CardTitle>
                           <Badge variant="destructive" className="ml-auto">Admin</Badge>
                         </div>
                         <p className="text-sm text-muted-foreground">
                           Sensitive data requiring admin privileges and step-up auth
                         </p>
                       </CardContent>
                     </Card>
                  </div>
                </div>
              )}

              {(currentView === 'home' || currentView === 'chat') && jwt && (
                <div className="space-y-6">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <span>
                        Logged in as <span className="font-semibold">{currentRole}</span>
                      </span>
                      <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        size="sm"
                      >
                        Sign Out
                      </Button>
                    </AlertDescription>
                  </Alert>
                  <ChatInterface jwt={jwt} role={currentRole} />
                </div>
              )}
              </div>
            </div>
          </SidebarInset>
        </div>

        <Footer />
      </div>
    </SidebarProvider>
  );
}
