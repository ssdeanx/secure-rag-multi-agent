import { Box, Typography } from '@/components/ui/joy'
import { ContactForm } from '@/components/contact/ContactForm.joy'

export default function ContactPage() {
    return (
        <Box
            component="main"
            sx={{ minHeight: '100vh', bgcolor: 'background.body', py: 8 }}
        >
            <Box sx={{ maxWidth: 880, mx: 'auto', px: 2 }}>
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography level="h1" sx={{ fontWeight: 800 }}>
                        Contact Us
                    </Typography>
                    <Typography
                        level="body-md"
                        sx={{ color: 'text.secondary', mt: 1 }}
                    >
                        Have a question about governed RAG, security posture, or
                        enterprise integration? Send us a message.
                    </Typography>
                </Box>
                <ContactForm />
            </Box>
        </Box>
    )
}
