"use client";
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ValueItem {
  title: string;
  description: string;
}

const values: ValueItem[] = [
  { title: 'Security First', description: 'Zero-trust assumptions and continuous verification across every layer.' },
  { title: 'Transparency', description: 'Clear audit trails, reproducible workflows, and explainable access decisions.' },
  { title: 'Velocity', description: 'Tooling that accelerates safe experimentation without governance trade-offs.' },
  { title: 'Resilience', description: 'Systems designed for graceful failure, observability, and recovery.' },
];

export function ValuesGrid() {
  const reduce = useReducedMotion();
  const prefReduce = reduce === true;
  return (
    <section aria-labelledby="values-heading" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10 text-center space-y-3">
          <h2 id="values-heading" className="text-3xl font-bold tracking-tight">Our Core Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Principles that guide every design decision—from API surface to user onboarding.
          </p>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Company values">
          {values.map((val, i) => (
            <li key={val.title} className="list-none">
              <motion.div
                {...(prefReduce ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: i * 0.1 } })}
                viewport={{ once: true }}
              >
                <Card className="h-full hover-lift hover-glow transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{val.title}</CardTitle>
                    <CardDescription>{val.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
