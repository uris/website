import 'server-only';
import type { ProjectDocument, ProjectSummary } from '@/projects/server/types';

export function toProjectSummary(project: ProjectDocument): ProjectSummary {
	return {
		slug: project.slug,
		title: project.header.title,
		summary: project.ai.summary,
		tagline: project.ai.tagline,
	};
}
