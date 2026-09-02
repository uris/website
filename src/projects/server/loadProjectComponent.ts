import 'server-only';

import type { ComponentType } from 'react';
import { isProjectSlug, type ProjectDetailsModule } from '@/projects/_registry/slugs';

// load project details based on slug passed as parameter
export async function loadProjectComponent(slug: string): Promise<ComponentType | null> {
	// protect for valid slug
	if (!isProjectSlug(slug)) return null;

	// dynamically load the project details module for the corresponding slug, returning the default export or null if there is none
	const loadProjectModule = (): Promise<ProjectDetailsModule> => import(`@/projects/content/${slug}/projectDetails`);
	const module = await loadProjectModule();
	return module.default ? module.default : null;
}
