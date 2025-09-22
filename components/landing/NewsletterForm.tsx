"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({} as { error?: string }));
        throw new Error(data?.error ?? 'Subscription failed');
      }

      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message ?? 'An unexpected error occurred');
    }
  };

  return (
    <section className="py-20 bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2 className="text-3xl font-bold mb-4">Stay Ahead of the Curve</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Subscribe to our newsletter for the latest on AI, security, and enterprise tech.
          </p>

          {submitted ? (
            <div className="rounded-md border bg-accent/5 p-4 text-center">
              <p className="font-medium">Thanks! You're subscribed.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-grow"
                aria-label="Email for newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" size="lg">
                Subscribe
              </Button>
            </form>
          )}

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </motion.div>
      </div>
    </section>
  );
}
