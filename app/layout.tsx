import { Inter } from 'next/font/google';

import './globals.css';

import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Governed RAG - Secure AI with Mastra',
  description: 'Enterprise-grade secure RAG with role-based access control',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
