import { ProjectFrame } from '@/components/ProjectFrame/ProjectFrame';
import { useProject } from '@/stores/sidebar/sidebarStore';

export function ProjectDetails() {
	const project = useProject();

	return <ProjectFrame projectSlug={project} projectName={'Project Name'} />;
}
