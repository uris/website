import 'server-only';
import type { SkillsDocumentData, SkillsPageData } from '@/src/skills/server/types';

export function toSkillsPageData(document: SkillsDocumentData): SkillsPageData {
	return {
		slug: document.slug,
		title: document.title,
		columns: document.columns,
	};
}
