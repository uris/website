import 'server-only';

import type { ComponentType } from 'react';
import { detailsLoaders, isProjectSlug } from '@/projects/_registry/slugs';

// load project details based on slug passed as parameter
export async function loadProjectComponent(slug: string): Promise<ComponentType | null> {
	// protect for valid slug
	if (!isProjectSlug(slug)) return null;

	// protect for loader matching the project slug
	const loader = detailsLoaders[slug];
	if (!loader) return null;

	// dynamically load the project details module, returning the default export
	const module = await loader();
	return module.default;
}
