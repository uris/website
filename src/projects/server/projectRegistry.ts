import 'server-only';
import slice from '@/content/projects/slice.json';
import urisDesign from '@/content/projects/uris-design.json';
import type { ProjectDocument, ProjectSlug } from '@/projects/server/types';

export const projectRegistry: Record<ProjectSlug, ProjectDocument> = {
	slice: slice as ProjectDocument,
	'uris-design': urisDesign as ProjectDocument,
};

export const projectSlugs = Object.keys(projectRegistry) as ProjectSlug[];
