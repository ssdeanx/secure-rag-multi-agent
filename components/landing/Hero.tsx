import React from 'react';
import { Button } from '@/components/ui/button';
import { DeanMachinesLogo } from '../DeanMachinesLogo'; // Adjust path if needed

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <DeanMachinesLogo className="h-16 w-16 mx-auto mb-6 text-primary" />
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Deanmachines
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Advanced AI Solutions for Enterprise Innovation. Empower your business with cutting-edge machine learning and intelligent automation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="px-8" asChild>
            <a href="/demo-rag">Try Demo</a>
          </Button>
          <Button variant="outline" size="lg" className="px-8" asChild>
            <a href="/docs">Learn More</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
