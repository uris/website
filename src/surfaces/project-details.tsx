import { useProject } from '@/stores/sidebar/sidebarStore';
import { ProjectFrame } from '../components/ProjectFrame/ProjectFrame';

export function ProjectDetails() {
	const project = useProject();

	return <ProjectFrame projectSlug={project} projectName={'Project Name'} />;
}
