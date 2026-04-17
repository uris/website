import 'server-only';
import type { SkillsDocumentData, SkillsSummary } from '@/src/skills/server/types';

export function toSkillsSummary(document: SkillsDocumentData): SkillsSummary {
	return {
		slug: document.slug,
		title: document.title,
		summary: document.ai?.summary ?? '',
		highlights: document.ai?.highlights,
	};
}
