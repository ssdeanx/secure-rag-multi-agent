import React from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

import './global.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { TopNavigation } from '../components/TopNavigation';
import { Footer } from '../components/Footer';
import RouteAnnouncer from '@/components/RouteAnnouncer';

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
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" }
  ],
  colorScheme: "dark"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(`${inter.className} antialiased bg-background text-foreground`)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <TopNavigation />
            <RouteAnnouncer />
            <main id="main" className="flex-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/60" role="main">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
