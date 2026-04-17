import 'server-only';
import {
	getAllProjectDocuments,
	getProjectDocument,
	getProjectSlugs,
} from '@/projects/server/loadProject';
import { toProjectAIData } from '@/projects/server/transforms/toProjectAI';
import { toProjectPageData } from '@/projects/server/transforms/toProjectPage';
import { toProjectSummary } from '@/projects/server/transforms/toProjectSummary';
import { toProjectTileData } from '@/projects/server/transforms/toProjectTile';
import type {
	ProjectAIData,
	ProjectPageData,
	ProjectSlug,
	ProjectSummary,
	ProjectTileData,
	ProjectViewType,
} from '@/projects/server/types';

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
	return project ? toProjectAIData(project) : null;
}

export function getProjectSummaries(): ProjectSummary[] {
	return getAllProjectDocuments().map(toProjectSummary);
}

export function getKnownProjectSlugs(): ProjectSlug[] {
	return getProjectSlugs();
}

export function getProjectView(slug: string, view: 'page'): ProjectPageData | null;
export function getProjectView(slug: string, view: 'ai'): ProjectAIData | null;
export function getProjectView(slug: string, view: 'tile'): ProjectTileData | null;
export function getProjectView(slug: string, view: ProjectViewType) {
	if (view === 'page') return getProjectPageData(slug);
	if (view === 'ai') return getProjectAIData(slug);
	const project = getProjectDocument(slug);
	return project ? toProjectTileData(project) : null;
}
