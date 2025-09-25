"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CTA() {
  const reduceMotion = useReducedMotion();
  const prefersReducedMotion = reduceMotion === true;
  return (
    <section aria-labelledby="cta-heading" className="py-20 bg-background text-foreground">
      <motion.div
        {...(prefersReducedMotion
          ? {}
          : { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 } })}
        viewport={{ once: true }}
      >
        <Card className="max-w-3xl mx-auto focus-within:ring-2 focus-within:ring-primary/60">
          <CardHeader>
            <CardTitle id="cta-heading" className="text-primary-foreground">
              Ready to Revolutionize Your Business?
            </CardTitle>
          </CardHeader>
            <CardContent>
              <p className="text-primary-foreground/80 mb-6">
                Explore the future of enterprise AI. Get started with a demo or dive into our documentation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/demo-rag">Try the Demo</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  asChild
                >
                  <a href="/docs">Read the Docs</a>
                </Button>
              </div>
            </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
