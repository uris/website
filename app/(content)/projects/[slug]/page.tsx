import { notFound } from 'next/navigation';
import { ProjectDetailsContainer } from '@/projects/renderers/ProjectDetailsContainer';
import { getKnownProjectSlugs } from '@/projects/server';
import { loadProjectComponent } from '@/projects/server/loadProjectComponent';
import { ProjectViewTracker } from '@/src/analytics/ProjectViewTracker';

// map of all params - let's next generate static pages for each
export function generateStaticParams() {
	return getKnownProjectSlugs().map((slug) => ({ slug }));
}

// resolve and return the base project details render component or null if not found
export default async function ProjectDetailsPage({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
	const { slug } = await params;
	const ProjectDetails = await loadProjectComponent(slug);

	// render not found page if there is no matching project details component
	if (!ProjectDetails) notFound();

	// render the project details component matching the requested slug
	return (
		<ProjectDetailsContainer>
			<ProjectViewTracker projectSlug={slug} presentation="standalone" />
			<ProjectDetails />
		</ProjectDetailsContainer>
	);
}
