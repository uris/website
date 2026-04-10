import { projectMap } from '@/app/(content)/projects/[slug]/_projectsMap';
import { ProjectDetails } from './ProjectDetails';

// map of all params - let's next generate static pages for each
export function generateStaticParams() {
	return Object.keys(projectMap).map((slug) => ({ slug }));
}

export default async function ProjectDetailsPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	return <ProjectDetails slug={slug} />;
}
