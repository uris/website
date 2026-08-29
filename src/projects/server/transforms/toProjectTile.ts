import 'server-only';
import type { ProjectDocument, ProjectTileData } from '@/projects/_types/types';

export function toProjectTileData(project: ProjectDocument): ProjectTileData {
	if (!project.tile) {
		throw new Error(`Project "${project.slug}" is missing tile metadata`);
	}

	return {
		slug: project.slug,
		...project.tile,
	};
}
