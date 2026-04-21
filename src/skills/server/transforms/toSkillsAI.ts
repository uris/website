import 'server-only';
import type { SkillsAIData, SkillsDocumentData, SkillsSectionSummary } from '@/src/skills/server/types';

export function toSkillsAIData(document: SkillsDocumentData): SkillsAIData {
	return {
		slug: document.slug,
		title: document.title,
		summary: document.ai?.summary ?? '',
		highlights: document.ai?.highlights ?? [],
		keywords: document.ai?.keywords ?? [],
		suggestedQuestions: document.ai?.suggestedQuestions ?? [],
		sections: document.columns.flatMap((column) =>
			column.sections.map((section) => summarizeSection(column.title, section)),
		),
	};
}

function summarizeSection(
	columnTitle: string,
	section: SkillsDocumentData['columns'][number]['sections'][number],
): SkillsSectionSummary {
	return {
		title: `${columnTitle} / ${section.title}`,
		type: section.type,
		description: section.description,
		items:
			section.type === 'chips'
				? section.items
				: section.items.map((item) => `${item.name}: ${item.level} (${item.value}%)`),
	};
}
