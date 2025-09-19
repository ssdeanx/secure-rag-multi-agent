'use client';

import React from 'react';
import { Shield, ExternalLink, Github, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Documentation',
      links: [
        { label: 'Getting Started', href: '#docs/getting-started' },
        { label: 'API Reference', href: '#docs/api' },
        { label: 'Examples', href: '#docs/examples' },
        { label: 'Security Guide', href: '#docs/security' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Mastra Framework', href: 'https://mastra.ai', external: true },
        { label: 'GitHub Repository', href: 'https://github.com/mastra-ai', external: true },
        { label: 'Community', href: 'https://discord.gg/mastra', external: true },
        { label: 'Support', href: '#support' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
        { label: 'Security Policy', href: '#security-policy' },
        { label: 'Compliance', href: '#compliance' },
      ]
    }
  ];

  return (
    <footer className="w-full border-t border-border bg-background rounded-t-xl">
      <div className="app-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 group">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary">
                Governed RAG
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Enterprise-grade secure RAG with role-based access control, powered by Mastra multi-agent framework.
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Built with Mastra</span>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={cn(
                        "text-sm text-muted-foreground hover:text-foreground transition-all duration-300",
                        "flex items-center space-x-1 hover:underline",
                        "rounded-md px-2 py-1 hover:bg-accent/50"
                      )}
                      target={link.external === true ? '_blank' : undefined}
                      rel={link.external === true ? 'noopener noreferrer' : undefined}
                    >
                      <span>{link.label}</span>
                      {link.external === true && (
                        <ExternalLink className="h-4 w-4 hover:neon-glow-cyan transition-all duration-300" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Governed RAG. Built with{' '}
            <a
              href="https://mastra.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline hover:text-primary/80"
            >
              Mastra
            </a>
            .
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/mastra-ai"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center rounded-xl text-sm font-medium",
                "focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "hover:bg-accent hover:text-accent-foreground",
                "h-10 w-10 bg-background border border-border",
                "hover:border-primary/50"
              )}
              aria-label="GitHub"
            >
              <Github className="h-4 w-4 transition-all duration-300 hover:scale-110" />
            </a>

            <a
              href="#docs"
              className={cn(
                "inline-flex items-center justify-center rounded-xl text-sm font-medium",
                "focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "hover:bg-accent hover:text-accent-foreground",
                "h-10 w-10 bg-background border border-border",
                "hover:border-primary/50"
              )}
              aria-label="Documentation"
            >
              <BookOpen className="h-4 w-4 transition-all duration-300 hover:scale-110" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
