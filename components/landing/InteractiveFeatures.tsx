"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
	{
		title: 'Intelligent RAG',
		description: 'Retrieval-Augmented Generation with governance for secure, accurate AI responses.',
		badge: 'Core',
	},
	{
		title: 'Enterprise Security',
		description: 'Role-based access, data isolation, and compliance-ready architecture.',
		badge: 'Secure',
	},
	{
		title: 'Scalable AI',
		description: 'Built on Next.js and Mastra for seamless deployment and performance.',
		badge: 'Scalable',
	},
	{
		title: 'Custom Workflows',
		description: 'Integrate with your tools and customize AI behaviors for your needs.',
		badge: 'Flexible',
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6 },
	},
};

const hoverVariants = {
	hover: {
		scale: 1.05,
		y: -10,
		transition: { duration: 0.3 },
	},
};

export function InteractiveFeatures() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<section className="py-20 bg-muted/50">
			<div className="container mx-auto px-4">
				<motion.h2
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						hidden: { opacity: 0, y: 30 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
					}}
					className="text-3xl font-bold text-center text-foreground mb-12"
					transition={shouldReduceMotion ? { duration: 0 } : {}}
				>
					Why Deanmachines?
				</motion.h2>
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
				>
					{features.map((feature, index) => (
						<motion.div
							key={index}
							variants={itemVariants}
							whileHover={shouldReduceMotion ? undefined : 'hover'}
							layout
						>
							<Card className="border-0 shadow-sm h-full">
								<CardHeader>
									<Badge className="mb-2">{feature.badge}</Badge>
									<CardTitle>{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>{feature.description}</CardDescription>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
