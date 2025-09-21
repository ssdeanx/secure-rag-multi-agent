import React from 'react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your AI?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">Join Deanmachines and unlock the future of enterprise AI today.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" size="lg" className="px-8" asChild>
            <a href="/login">Get Started</a>
          </Button>
          <Button variant="outline" size="lg" className="px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
            <a href="/docs">View Documentation</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
