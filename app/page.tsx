'use client';

import AuthPanel from '@/components/AuthPanel';
import ChatInterface from '@/components/ChatInterface';
import IndexingPanel from '@/components/IndexingPanel';
import SecurityIndicator from '@/components/SecurityIndicator';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { useState, Dispatch, SetStateAction } from 'react';

export default function Home() {
  const [jwt, setJwt] = useState<string>('');
  const [currentRole, setCurrentRole] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative z-10">
        <header className="border-b border-gray-800 glass-effect">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Shield className="h-8 w-8 text-blue-500" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    Governed RAG
                  </h1>
                  <p className="text-sm text-gray-400">Secure AI with Mastra</p>
                </div>
              </div>
              
              <SecurityIndicator role={currentRole} />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <IndexingPanel jwt={jwt || 'anonymous'} />
            
            {!jwt ? (
              <div className="space-y-8">
                <div className="text-center py-12">
                  <Lock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-4">Secure Access Required</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                    This system demonstrates enterprise-grade security for RAG applications.
                    Select a role below to see how different users access different information.
                  </p>
                </div>

                <AuthPanel onAuth={(token, role) => {
                  setJwt(token);
                  setCurrentRole(role);
                }} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="glass-effect rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Shield className="h-6 w-6 text-green-400" />
                      </div>
                      <h3 className="ml-3 font-semibold">Public Access</h3>
                    </div>
                    <p className="text-sm text-gray-400">
                      Basic information available to all authenticated users
                    </p>
                  </div>

                  <div className="glass-effect rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Shield className="h-6 w-6 text-yellow-400" />
                      </div>
                      <h3 className="ml-3 font-semibold">Internal Access</h3>
                    </div>
                    <p className="text-sm text-gray-400">
                      Department-specific information for authorized roles
                    </p>
                  </div>

                  <div className="glass-effect rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-red-500/10 rounded-lg">
                        <Shield className="h-6 w-6 text-red-400" />
                      </div>
                      <h3 className="ml-3 font-semibold">Confidential Access</h3>
                    </div>
                    <p className="text-sm text-gray-400">
                      Sensitive data requiring admin privileges and step-up auth
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-blue-400" />
                      <span className="text-sm">
                        Logged in as <span className="font-semibold">{currentRole}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setJwt('');
                        setCurrentRole('');
                      }}
                      className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
                
                <ChatInterface jwt={jwt} role={currentRole} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}