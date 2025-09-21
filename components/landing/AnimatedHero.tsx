"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DeanMachinesLogo } from '../DeanMachinesLogo';
import { Button } from '@/components/ui/button';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine } from "@tsparticles/engine";
import { loadLinksPreset } from "@tsparticles/preset-links";

interface AnimatedHeroProps {
  mode?: string;
}

export function AnimatedHero({ mode = 'general' }: AnimatedHeroProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
        await loadLinksPreset(engine);
    }).then(() => {
        setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const subtitle = mode === 'enterprise' ? 'Enterprise-Grade AI Innovation' : 'Advanced AI Solutions for Enterprise Innovation. Empower your business with cutting-edge machine learning and intelligent automation.';

  const options = useMemo(
    () => ({
      preset: "links",
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "oklch(var(--foreground))",
        },
        links: {
          color: "oklch(var(--foreground))",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  return (
    <motion.section
      className="min-h-screen relative flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
      }}
    >
      {init && <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options as any} className="absolute inset-0 z-0" />}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <DeanMachinesLogo className="h-16 w-16 mx-auto mb-6" />
        </motion.div>
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-center"
          layoutId="hero-title"
        >
          Deanmachines
        </motion.h1>
        <motion.p
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed !text-center"
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