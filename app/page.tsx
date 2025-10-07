import { Hero } from '@/components/landing/Hero'
import { InteractiveFeatures } from '@/components/landing/InteractiveFeatures'
import { NewsletterForm } from '@/components/landing/NewsletterForm'
import { CTA } from '@/components/landing/CTA'

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
