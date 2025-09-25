"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, ShieldCheck, Zap } from 'lucide-react';

const features = [
	{
		icon: <ShieldCheck className="h-8 w-8 text-primary" />,
		title: 'Governed Access',
		description: 'Ensure compliance with role-based access control on all AI interactions.',
	},
	{
		icon: <Zap className="h-8 w-8 text-primary" />,
		title: 'Real-time Insights',
		description: 'Get instant, data-driven answers from your private knowledge base.',
	},
	{
		icon: <BarChart className="h-8 w-8 text-primary" />,
		title: 'Analytics & Audits',
		description: 'Monitor usage and maintain a complete audit trail of all AI conversations.',
	},
];

export function InteractiveFeatures() {
	const reduceMotion = useReducedMotion();
	const prefersReducedMotion = reduceMotion === true;
	return (
		<section aria-labelledby="features-heading" className="py-20 bg-background text-foreground">
			<motion.div
				{...(prefersReducedMotion
					? {}
					: { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 } })}
				viewport={{ once: true }}
			>
				<h2 id="features-heading" className="text-3xl font-bold text-center mb-4">
					Powerful Features, Simply Delivered
				</h2>
				<p className="text-lg text-muted-foreground text-center mb-12">
					Explore the core capabilities that make Deanmachines the leader in governed AI.
				</p>
			</motion.div>
			<ul className="grid md:grid-cols-3 gap-8" aria-label="Key product features">
				{features.map((feature, i) => (
					<li key={feature.title} className="h-full list-none">
						<motion.div
							{...(prefersReducedMotion
								? {}
								: {
										initial: { opacity: 0, y: 50 },
										whileInView: { opacity: 1, y: 0 },
										transition: { duration: 0.5, delay: i * 0.15 },
									})}
							viewport={{ once: true }}
							aria-label={`${feature.title} feature`}
						>
							<Card className="text-center h-full hover-lift hover-glow transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/60">
								<CardHeader>
									<div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4" aria-hidden="true">
										{feature.icon}
									</div>
									<CardTitle>{feature.title}</CardTitle>
								</CardHeader>
								<CardDescription className="px-6 pb-6 text-center">
									{feature.description}
								</CardDescription>
							</Card>
						</motion.div>
					</li>
				))}
			</ul>
		</section>
	);
}
