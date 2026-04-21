import { getKnownProjectSlugs, getProjectPageData } from '@/projects/server';
import { ProjectDetails } from '@/src/landing/project-details';

// map of all params - let's next generate static pages for each
export function generateStaticParams() {
	return getKnownProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const project = getProjectPageData(slug);
	return <ProjectDetails project={project} />;
}
