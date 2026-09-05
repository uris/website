import 'server-only';
import type {
	ProjectAIData,
	ProjectPageData,
	ProjectSlug,
	ProjectSummary,
	ProjectTileData,
} from '@/projects/_types/types';
import { getAllProjectDocuments, getProjectDocument, getProjectSlugs } from '@/projects/server/loadProject';
import { toProjectAIData } from '@/projects/server/transforms/toProjectAI';
import { toProjectPageData } from '@/projects/server/transforms/toProjectPage';
import { toProjectSummary } from '@/projects/server/transforms/toProjectSummary';
import { toProjectTileData } from '@/projects/server/transforms/toProjectTile';

export function getAllProjectTiles(): ProjectTileData[] {
	return getAllProjectDocuments()
		.map(toProjectTileData)
		.sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
}

export function getProjectPageData(slug: string): ProjectPageData | null {
	const project = getProjectDocument(slug);
	return project ? toProjectPageData(project) : null;
}

export function getProjectAIData(slug: string): ProjectAIData | null {
	const project = getProjectDocument(slug);
	return project?.ai.summary.trim() ? toProjectAIData(project) : null;
}

export function getProjectSummaries(): ProjectSummary[] {
	return getAllProjectDocuments()
		.filter((project) => project.ai.summary.trim())
		.map(toProjectSummary);
}

export function getKnownProjectSlugs(): ProjectSlug[] {
	return getProjectSlugs();
}
