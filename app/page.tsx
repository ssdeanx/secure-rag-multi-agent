import { InteractiveFeatures } from '@/components/landing/InteractiveFeatures';
import { NewsletterForm } from '@/components/landing/NewsletterForm';
import { CTA } from '@/components/landing/CTA';

export default function Home() {
  return (
    <div className="w-full px-4 py-8 flex flex-col items-center justify-center"> {/* Added flex items-center justify-center for global centering of all components */}
      <div className="max-w-7xl mx-auto w-full">
        <InteractiveFeatures />
        <NewsletterForm />
        <CTA />
      </div>
    </div>
  );
}
