'use client';

import type { ProjectPageData } from '@/projects/_types/types';
import { ProjectPageRenderer } from '@/projects/renderers/ProjectPageRenderer';
import { snippets } from './code-snippets';
import { images } from './images';
import projectJson from './project.json';

const project = projectJson as ProjectPageData;

export default function UrisDesignProjectDetails() {
	return (
		<ProjectPageRenderer
			project={project}
			resolveImage={(name) => (name ? images[name as keyof typeof images] : undefined)}
			resolveSnippet={(name) => (name ? snippets[name as keyof typeof snippets] : undefined)}
		/>
	);
}
