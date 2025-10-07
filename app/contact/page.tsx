import { ContactForm } from '@/components/contact/ContactForm'

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background py-24">
            <div className="max-w-4xl mx-auto px-4">
                <header className="mb-12 text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Contact Us
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Have a question about governed RAG, security posture, or
                        enterprise integration? Send us a message.
                    </p>
                </header>
                <ContactForm />
            </div>
        </main>
    )
}
