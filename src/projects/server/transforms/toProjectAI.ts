import 'server-only';

import type {
	ProjectAIData,
	ProjectBlock,
	ProjectDocument,
	ProjectStatsBlock,
} from '@/projects/server/types';

export function toProjectAIData(project: ProjectDocument): ProjectAIData {
	const stats = project.sections.flatMap((section) =>
		section.blocks.flatMap((block) => extractStats(block)),
	);

	return {
		slug: project.slug,
		title: project.header.title,
		summary: project.ai.summary,
		tagline: project.ai.tagline,
		techStack: project.header.techStack,
		links: project.header.links ?? [],
		keywords: project.ai.keywords ?? [],
		audiences: project.ai.audiences ?? [],
		emphasize: project.ai.emphasize ?? [],
		avoid: project.ai.avoid ?? [],
		capabilities: project.ai.capabilities ?? [],
		limitations: project.ai.limitations ?? [],
		highlightOrder: project.ai.highlightOrder ?? [],
		suggestedQuestions: project.ai.suggestedQuestions ?? [],
		relatedProjects: project.ai.relatedProjects ?? [],
		sectionSummaries: project.sections.map((section) => ({
			title: section.title,
			content: section.blocks.flatMap((block) => summarizeBlock(block)),
		})),
		stats,
	};
}

function summarizeBlock(block: ProjectBlock): string[] {
	if (block.type === 'paragraph') return [block.text];
	if (block.type === 'list')
		return block.items.map((item) => formatListItem(item.label, item.text));
	if (block.type === 'stats') return block.items.map((item) => `${item.label}: ${item.value}`);
	return [];
}

function extractStats(block: ProjectBlock): ProjectStatsBlock['items'] {
	return block.type === 'stats' ? block.items : [];
}

function formatListItem(label: string | undefined, text: string) {
	return label ? `${label} — ${text}` : text;
}
