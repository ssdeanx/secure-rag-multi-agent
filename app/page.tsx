import { AnimatedHero } from '@/components/landing/AnimatedHero';
import { InteractiveFeatures } from '@/components/landing/InteractiveFeatures';
import { Stats } from '@/components/landing/Stats';
import { Testimonials } from '@/components/landing/Testimonials';
import { NewsletterForm } from '@/components/landing/NewsletterForm';
import { CTA } from '@/components/landing/CTA';

// Inline FAQ component
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
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="p-4 border rounded-lg">
              <summary className="font-semibold cursor-pointer">{faq.q}</summary>
              <p className="mt-2 text-muted-foreground">{faq.a}</p>
            </details>
          ))}
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

