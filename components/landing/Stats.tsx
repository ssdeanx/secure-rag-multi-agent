"use client";

import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const stats = [
  { value: 99.9, label: 'Uptime', suffix: '%' },
  { value: 40, label: 'Faster Responses', suffix: '%' },
  { value: 10, label: 'Integrations', prefix: '+' },
  { value: 256, label: 'Bit Encryption', suffix: '' },
];

export function Stats() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2, ease: 'easeOut' }}
            >
              <Card className="text-center hover-lift">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-primary">
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={3}
                      separator=","
                      decimals={stat.value % 1 !== 0 ? 1 : 0}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      enableScrollSpy
                      scrollSpyDelay={300}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}