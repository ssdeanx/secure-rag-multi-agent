"use client";

import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const stats = [
	{ value: 10000, suffix: 'k+', label: 'Queries Processed' },
	{ value: 500, suffix: '+', label: 'Enterprise Clients' },
	{ value: 99.9, suffix: '%', label: 'Uptime' },
	{ value: 50, suffix: '+', label: 'AI Models' },
];

export function Stats() {
	return (
		<section className="py-16 bg-background">
			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-4 gap-8 text-center">
					{stats.map((stat, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: index * 0.2 }}
							viewport={{ once: true }}
							className="space-y-2"
						>
							<div className="text-3xl font-bold text-primary">
								<CountUp end={stat.value} duration={2} suffix={stat.suffix} />
							</div>
							<div className="text-muted-foreground">{stat.label}</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
