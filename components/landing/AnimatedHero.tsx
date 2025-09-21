"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Particles } from '@tsparticles/react';
import { loadLinksPreset } from '@tsparticles/preset-links';
import { GovernedRAGLogo } from '../GovernedRAGLogo';
import { Button } from '@/components/ui/button';

interface AnimatedHeroProps {
  mode?: string;
}

export function AnimatedHero({ mode = 'general' }: AnimatedHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const particlesLoaded = async (main: any) => {
    await loadLinksPreset(main);
  };

  const particleNumber = shouldReduceMotion ? 0 : 30;

  const particlesOptions = {
    preset: 'links',
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    particles: {
      number: { value: particleNumber, density: { enable: true, value_area: 800 } },
      color: { value: '#3b82f6' },
      shape: { type: 'circle' },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      links: { enable: true, distance: 150, color: '#3b82f6', opacity: 0.4, width: 1 },
      move: { 
        enable: true, 
        speed: 2, 
        direction: 'none' as const,
        random: true 
      }
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
        onClick: { enable: true, mode: 'push' },
        resize: { enable: true },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { quantity: 4 },
      },
    },
    detectRetina: true,
    pauseOnBlur: true,
  };

  const subtitle = mode === 'enterprise' ? 'Enterprise-Grade AI Innovation' : 'Advanced AI Solutions for Enterprise Innovation. Empower your business with cutting-edge machine learning and intelligent automation.';

  return (
    <motion.section 
      className="min-h-screen relative flex flex-col items-center justify-center text-center px-4 py-20 bg-background overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
      }}
    >
      <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={particlesOptions} className="absolute inset-0 z-0" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <GovernedRAGLogo className="h-16 w-16 mx-auto mb-6 text-primary" />
        </motion.div>
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-5xl md:text-6xl font-bold text-foreground mb-6"
          layoutId="hero-title"
        >
          Deanmachines
        </motion.h1>
        <motion.p
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <Button size="lg" className="px-8" asChild>
            <a href="/demo-rag">Try Demo</a>
          </Button>
          <Button variant="outline" size="lg" className="px-8" asChild>
            <a href="/docs">Learn More</a>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
