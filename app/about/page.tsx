import { AboutHero } from '@/components/about/AboutHero';
import { ValuesGrid } from '@/components/about/ValuesGrid';
import { TeamGrid } from '@/components/about/TeamGrid';

export default function AboutPage() {
	return (
		<main className="min-h-screen bg-background">
			<AboutHero />
			<ValuesGrid />
			<TeamGrid />
		</main>
	);
}
