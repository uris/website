import 'server-only';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isProjectSlug, projectSlugs } from '@/projects/_registry/slugs';
import type { ProjectDocument, ProjectSlug } from '@/projects/_types/types';

const projectCache = new Map<ProjectSlug, ProjectDocument>();

export function getProjectSlugs(): ProjectSlug[] {
	return [...projectSlugs];
}

export function getProjectDocument(slug: string): ProjectDocument | null {
	if (!isProjectSlug(slug)) return null;
	const cached = projectCache.get(slug);
	if (cached) return cached;

	const filePath = join(process.cwd(), 'src', 'projects', slug, 'project.json');
	const project = JSON.parse(readFileSync(filePath, 'utf-8')) as ProjectDocument;
	projectCache.set(slug, project);
	return project;
}

export function getAllProjectDocuments(): ProjectDocument[] {
	return projectSlugs
		.map((slug) => getProjectDocument(slug))
		.filter((project): project is ProjectDocument => project !== null);
}
