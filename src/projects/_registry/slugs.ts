import type { ComponentType } from 'react';

// all project slugs
export const projectSlugs = [
	'uris-design',
	'slice',
	'gp-gia',
	'rc-video',
	'rc-phone',
	'hiring',
	'godaddy-websites',
	'gp-eor',
	'people',
	'paypal-beacon',
	'design-approach',
	'godaddy-app',
	'design-framer',
	'unreal-multiplayer',
	'console-pacman',
] as const;
export type ProjectSlug = (typeof projectSlugs)[number];

// type for project details module
export type ProjectDetailsModule = { default: ComponentType };

// utility to check if string is a valid project slug
export function isProjectSlug(slug: string): slug is ProjectSlug {
	return projectSlugs.includes(slug as ProjectSlug);
}

// utility to get all project slugs
export function getProjectSlugs(): ProjectSlug[] {
	return [...projectSlugs];
}
