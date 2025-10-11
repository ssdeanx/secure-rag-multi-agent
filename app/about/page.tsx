import { AboutHero } from '@/components/about/AboutHero.joy'
import { ValuesGrid } from '@/components/about/ValuesGrid.joy'
import { TeamGrid } from '@/components/about/TeamGrid.joy'
import { Box } from '@/components/ui/joy'

export default function AboutPage() {
    return (
        <Box
            component="main"
            sx={{ minHeight: '100vh', bgcolor: 'background.surface' }}
        >
            <AboutHero />
            <ValuesGrid />
            <TeamGrid />
        </Box>
    )
}
