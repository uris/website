import 'server-only';
import { projectRegistry, projectSlugs } from '@/projects/server/projectRegistry';
import type { ProjectDocument, ProjectSlug } from '@/projects/server/types';

export function getProjectSlugs(): ProjectSlug[] {
	return projectSlugs;
}

export function getProjectDocument(slug: string): ProjectDocument | null {
	if (!(slug in projectRegistry)) return null;
	return projectRegistry[slug as ProjectSlug];
}

export function getAllProjectDocuments(): ProjectDocument[] {
	return projectSlugs.map((slug) => projectRegistry[slug]);
}
