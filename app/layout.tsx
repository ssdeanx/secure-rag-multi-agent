import { Inter } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { Toaster } from '../components/ui/toaster';

import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Governed RAG - Secure AI with Mastra',
  description: 'Enterprise-grade secure RAG with role-based access control',
  applicationName: 'Governed RAG',
  authors: [{ name: 'ssdeanx', url: 'https://github.com/ssdeanx/mastra-governed-rag' }],
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  icons: {
    icon: '/public/favicon.ico',
    shortcut: '/public/favicon-16x16.png',
    apple: '/public/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
  openGraph: {
    title: 'Governed RAG - Secure AI with Mastra',
    description: 'Enterprise-grade secure RAG with role-based access control',
    url: 'https://mastra-governed-rag.vercel.app',
    siteName: 'Governed RAG',
    images: [
      {
        url: 'https://mastra-governed-rag.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Governed RAG - Secure AI with Mastra',
      },
    ],
  },
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
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
