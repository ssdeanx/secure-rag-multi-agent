"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const testimonials = [
	{
		quote: 'Deanmachines transformed our AI workflow—secure, scalable, and innovative.',
		author: 'Jane Doe, CTO at TechCorp',
		role: 'Enterprise Client',
	},
	{
		quote: 'The RAG governance features are game-changing for compliance-heavy industries.',
		author: 'John Smith, AI Lead at FinBank',
		role: 'Financial Services',
	},
	{
		quote: 'Seamless integration with our stack; performance exceeded expectations.',
		author: 'Alex Lee, DevOps at InnovateLabs',
		role: 'Tech Startup',
	},
];

export function Testimonials() {
	return (
		<section className="py-20 bg-muted/50">
			<div className="container mx-auto px-4">
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-3xl font-bold text-center text-foreground mb-12"
				>
					What Our Clients Say
				</motion.h2>
				<Carousel className="w-full max-w-2xl mx-auto">
					<CarouselContent>
						{testimonials.map((testimonial, index) => (
							<CarouselItem key={index}>
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									whileInView={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5 }}
									viewport={{ once: true }}
								>
									<Card className="border-0 shadow-lg">
										<CardContent className="p-6">
											<CardDescription className="text-lg italic mb-4">
												"{testimonial.quote}"
											</CardDescription>
											<CardHeader className="pb-0">
												<CardTitle className="text-foreground">
													{testimonial.author}
												</CardTitle>
												<p className="text-sm text-muted-foreground">
													{testimonial.role}
												</p>
											</CardHeader>
										</CardContent>
									</Card>
								</motion.div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</section>
	);
}
