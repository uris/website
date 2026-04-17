import 'server-only';
import type { ProjectDocument, ProjectPageData } from '@/projects/server/types';

export function toProjectPageData(project: ProjectDocument): ProjectPageData {
	return {
		slug: project.slug,
		header: project.header,
		sections: project.sections,
	};
}
