import type { ComponentType } from 'react';

// all project slugs
export const projectSlugs = ['slice', 'uris-design'] as const;
export type ProjectSlug = (typeof projectSlugs)[number];

// record of modules used for rendering project details for each project slug
export type ProjectDetailsModule = { default: ComponentType };
export const detailsLoaders: Record<ProjectSlug, () => Promise<ProjectDetailsModule>> = {
	slice: () => import('@/projects/slice/projectDetails'),
	'uris-design': () => import('@/projects/uris-design/projectDetails'),
};

// utility to check if string is a valid project slug
export function isProjectSlug(slug: string): slug is ProjectSlug {
	return projectSlugs.includes(slug as ProjectSlug);
}

// utility to get all project slugs
export function getProjectSlugs(): ProjectSlug[] {
	return [...projectSlugs];
}
