import { AboutHero } from '@/components/about/AboutHero.joy'
import { ValuesGrid } from '@/components/about/ValuesGrid.joy'
import { TeamGrid } from '@/components/about/TeamGrid.joy'

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            <AboutHero />
            <ValuesGrid />
            <TeamGrid />
        </main>
    )
}
