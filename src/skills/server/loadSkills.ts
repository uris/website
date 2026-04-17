import 'server-only';
import { skillsRegistry, skillsSlugs } from '@/src/skills/server/skillsRegistry';
import type { SkillsDocumentData, SkillsSlug } from '@/src/skills/server/types';

export function getSkillsSlugs(): SkillsSlug[] {
	return skillsSlugs;
}

export function getSkillsDocument(slug: string): SkillsDocumentData | null {
	if (!(slug in skillsRegistry)) return null;
	return skillsRegistry[slug as SkillsSlug];
}

export function getAllSkillsDocuments(): SkillsDocumentData[] {
	return skillsSlugs.map((slug) => skillsRegistry[slug]);
}
