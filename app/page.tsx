import { AnimatedHero } from '@/components/landing/AnimatedHero';
import { InteractiveFeatures } from '@/components/landing/InteractiveFeatures';
import { Stats } from '@/components/landing/Stats';
import { Testimonials } from '@/components/landing/Testimonials';
import { NewsletterForm } from '@/components/landing/NewsletterForm';
import { CTA } from '@/components/landing/CTA';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function FAQ() {
  const faqs = [
    { q: 'What is Deanmachines?', a: 'Advanced AI solutions for enterprise with governed RAG.' },
    { q: 'How secure is it?', a: 'Role-based access and compliance-ready architecture.' },
    { q: 'What tech stack?', a: 'Next.js 15, Mastra, Framer Motion for cutting-edge perf.' },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <AnimatedHero />
      <InteractiveFeatures />
      <Stats />
      <Testimonials />
      <NewsletterForm />
      <CTA />
      <FAQ />
    </>
  );
}