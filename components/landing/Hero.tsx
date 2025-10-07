"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  const reduceMotion = useReducedMotion();
  const prefersReducedMotion = reduceMotion === true;

  const fadeUp = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.8 },
        };

  return (
    <section aria-labelledby="hero-heading" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 overflow-hidden">
      {/* Background decorative elements with depth */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl hero-bg-blur" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl hero-bg-blur" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 50 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8 },
              })}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { delay: 0.2, duration: 0.5 },
                })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-semibold shadow-lg shadow-primary/10"
          >
            <Sparkles className="h-4 w-4" />
            Enterprise-Grade AI Solutions
          </motion.div>

          {/* Main heading */}
          <motion.h1
            id="hero-heading"
            {...fadeUp(0.4)}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight hero-heading-shadow"
          >
            <span className="text-primary hero-text-glow">
              Governed AI
            </span>
            <br />
            <span className="text-foreground">for the Enterprise</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.6)}
            className="text-lg sm:text-xl lg:text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed"
          >
            Secure, compliant AI solutions with role-based access control.
            Transform your enterprise knowledge into actionable insights while maintaining
            complete governance and audit trails.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            {...fadeUp(0.8)}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Button size="lg" className="group text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 transition-all duration-200 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105" asChild>
              <a href="/demo-rag" className="flex items-center gap-2">
                Try the Demo
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-foreground/30 hover:border-primary hover:bg-primary/10 text-lg px-8 py-6 h-auto transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
              asChild
            >
              <a href="/docs" className="flex items-center gap-2">
                View Documentation
              </a>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            {...(prefersReducedMotion
              ? {}
              : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 1.0, duration: 0.8 } })}
            className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">SOC 2</div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        {...(prefersReducedMotion
          ? {}
          : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 1.2, duration: 0.8 } })}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          {prefersReducedMotion ? <span className="w-1 h-3 bg-primary rounded-full mt-2" /> : (
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-primary rounded-full mt-2"
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}
