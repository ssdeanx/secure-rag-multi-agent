import { Inter } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { Toaster } from '../components/ui/toaster';
import { TopNavigation } from '../components/TopNavigation';
import { Footer } from '../components/Footer';

import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Governed RAG - Secure AI with Mastra',
  description: 'Enterprise-grade secure RAG with role-based access control',
  applicationName: 'Governed RAG',
  authors: [{ name: 'ssdeanx', url: 'https://github.com/ssdeanx/governed-rag-ai' }],
  keywords: [
    'AI',
    'RAG',
    'Retrieval-Augmented Generation',
    'Next.js',
    'TypeScript',
    'Mastra',
    'Enterprise AI',
    'Secure AI',
    'Role-Based Access Control',
    'RBAC'
  ],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  generator: 'Next.js',
};

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
          <div className="site-wrapper">
            <TopNavigation />

            <main className="main-content app-container">
              {children}
            </main>

            <Footer />
          </div>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
