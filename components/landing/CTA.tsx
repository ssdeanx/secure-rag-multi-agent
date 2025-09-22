"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog';

export function CTA() {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-20 animated-gradient bg-background text-foreground">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Card className="mx-auto max-w-3xl">
            <CardHeader>
              <CardTitle className="text-primary-foreground">Ready to Revolutionize Your Business?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-foreground/80 mb-6">Explore the future of enterprise AI. Get started with a demo or dive into our documentation.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="secondary">Try the Demo</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Request a Demo</h3>
                      <p className="text-sm text-muted-foreground">We'll contact you to set up a live demo.</p>
                      <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <a href="/docs">Read the Docs</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
