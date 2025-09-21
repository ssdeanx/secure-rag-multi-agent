import React from 'react';
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

export function Features() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">Why Deanmachines?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Badge className="mb-2">{feature.badge}</Badge>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
