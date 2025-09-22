import React from 'react';
import { Inter } from 'next/font/google';

import './global.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { Toaster } from '../components/ui/toaster';
import { TopNavigation } from '../components/TopNavigation';

import type { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Deanmachines - AI Solutions',
  description: 'Advanced AI solutions and machine learning tools',
  applicationName: 'Deanmachines',
  authors: [{ name: 'ssdeanx', url: 'https://github.com/ssdeanx/governed-rag-ai' }],
  keywords: [
    'AI',
    'Machine Learning',
    'AI Solutions',
    'Next.js',
    'TypeScript',
    'Mastra',
    'Enterprise AI',
    'AI Tools'
  ],
  generator: 'Next.js',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopNavigation />  {/* Direct child: no extra wrapper */}
          <main className="flex-1 w-full">  {/* Full-width main below nav */}
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
