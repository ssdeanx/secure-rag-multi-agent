import { AnimatedHero } from '@/components/landing/AnimatedHero';
import { InteractiveFeatures } from '@/components/landing/InteractiveFeatures';
import { Stats } from '@/components/landing/Stats';
import { Testimonials } from '@/components/landing/Testimonials';
import { NewsletterForm } from '@/components/landing/NewsletterForm';
import { CTA } from '@/components/landing/CTA';


function FAQ() {
  const faqs = [
    { q: 'What is Deanmachines?', a: 'Advanced AI solutions for enterprise with governed RAG.' },
    { q: 'How secure is it?', a: 'Role-based access and compliance-ready architecture.' },
    { q: 'What tech stack?', a: 'Next.js 15, Mastra, Framer Motion for cutting-edge perf.' },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4 max-w-4xl mx-auto">
        {faqs.map((faq, i) => (
          <div key={i} className="p-4 bg-background rounded-lg border">
            <h3 className="font-semibold mb-2">{faq.q}</h3>
            <p className="text-muted-foreground">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedHero />
        <InteractiveFeatures />
        <Stats />
        <Testimonials />
        <NewsletterForm />
        <CTA />
        <FAQ />
      </div>
    </div>
  );
}
