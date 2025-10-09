import { Hero } from '@/components/landing/Hero.joy'
import { InteractiveFeatures } from '@/components/landing/InteractiveFeatures.joy'
import { NewsletterForm } from '@/components/landing/NewsletterForm.joy'
import { CTA } from '@/components/landing/CTA.joy'

export default function Home() {
    return (
        <div className="w-full">
            <Hero />
            <div className="max-w-7xl mx-auto w-full px-4">
                <InteractiveFeatures />
                <NewsletterForm />
                <CTA />
            </div>
        </div>
    )
}
