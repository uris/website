import type { ComponentType } from 'react';

// all project slugs
export const projectSlugs = ['slice', 'uris-design', 'rc-video', 'rc-phone', 'godaddy-websites', 'people'] as const;
export type ProjectSlug = (typeof projectSlugs)[number];

// record of modules used for rendering project details for each project slug
export type ProjectDetailsModule = { default: ComponentType };
export const detailsLoaders: Record<ProjectSlug, () => Promise<ProjectDetailsModule>> = {
	slice: () => import('@/projects/content/slice/projectDetails'),
	'uris-design': () => import('@/projects/content/uris-design/projectDetails'),
	'rc-video': () => import('@/projects/content/rc-video/projectDetails'),
	'rc-phone': () => import('@/projects/content/rc-phone/projectDetails'),
	'godaddy-websites': () => import('@/projects/content/godaddy-websites/projectDetails'),
	people: () => import('@/projects/content/people/projectDetails'),
};

// utility to check if string is a valid project slug
export function isProjectSlug(slug: string): slug is ProjectSlug {
	return projectSlugs.includes(slug as ProjectSlug);
}

// utility to get all project slugs
export function getProjectSlugs(): ProjectSlug[] {
	return [...projectSlugs];
}
