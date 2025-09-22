"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
	{
		quote: 'Deanmachines transformed our data strategy. The governed RAG is a game-changer.',
		name: 'Jane Doe',
		title: 'CTO, Innovate Inc.',
		avatar: '/avatars/01.png',
	},
	{
		quote: 'The security and audit features are top-notch. We finally have a compliant AI solution.',
		name: 'John Smith',
		title: 'Head of Security, SecureBank',
		avatar: '/avatars/02.png',
	},
	{
		quote: 'Onboarding was seamless, and the performance is incredible. Highly recommended.',
		name: 'Emily White',
		title: 'Lead Developer, TechCorp',
		avatar: '/avatars/03.png',
	},
];

export function Testimonials() {
	return (
		<section className="py-20 bg-background text-foreground">
			<motion.div
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8, ease: 'easeOut' }}
			>
				<h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
			</motion.div>
			<div className="grid md:grid-cols-3 gap-8">
				{testimonials.map((testimonial, i) => (
					<motion.div
						key={i}
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: i * 0.2, ease: 'easeOut' }}
					>
						<Card className="h-full flex flex-col justify-between hover-lift">
							<CardContent className="pt-6">
								<p className="text-lg italic text-foreground">"{testimonial.quote}"</p>
							</CardContent>
							<CardHeader className="flex-row items-center gap-4">
								<Avatar>
									<AvatarImage src={testimonial.avatar} alt={testimonial.name} />
									<AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<div>
									<CardTitle className="text-base font-bold">{testimonial.name}</CardTitle>
									<p className="text-sm text-muted-foreground">{testimonial.title}</p>
								</div>
							</CardHeader>
						</Card>
					</motion.div>
				))}
			</div>
		</section>
	);
}
