import 'server-only';
import type { ProjectDocument, ProjectSummary } from '@/projects/_types/types';

export function toProjectSummary(project: ProjectDocument): ProjectSummary {
	return {
		slug: project.slug,
		title: project.header.title,
		summary: project.ai.summary,
		tagline: project.ai.tagline,
		techStack: project.header.techStack,
	};
}
