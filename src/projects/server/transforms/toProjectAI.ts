import 'server-only';

import type { ProjectAIData, ProjectBlock, ProjectDocument, ProjectStatsBlock } from '@/projects/_types/types';

export function toProjectAIData(project: ProjectDocument): ProjectAIData {
	const context = project.ai.context;
	const hasContext = !!context?.length;
	const stats = hasContext
		? []
		: project.sections.flatMap((section) => section.blocks.flatMap((block) => extractStats(block)));
	const sectionSummaries = hasContext
		? [{ title: 'Current case study context', content: context }]
		: project.sections.map((section) => ({
				title: section.title,
				content: section.blocks.flatMap((block) => summarizeBlock(block)),
			}));

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
		sectionSummaries,
		stats,
	};
}

function summarizeBlock(block: ProjectBlock): string[] {
	if (block.type === 'paragraph') return [block.text];
	if (block.type === 'list') return block.items.map((item) => formatListItem(item.label, item.text));
	if (block.type === 'stats') return block.items.map((item) => `${item.label}: ${item.value}`);
	return [];
}

function extractStats(block: ProjectBlock): ProjectStatsBlock['items'] {
	return block.type === 'stats' ? block.items : [];
}

function formatListItem(label: string | undefined, text: string) {
	return label ? `${label} — ${text}` : text;
}
