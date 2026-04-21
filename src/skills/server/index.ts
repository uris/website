import 'server-only';
import { getAllSkillsDocuments, getSkillsDocument, getSkillsSlugs } from '@/src/skills/server/loadSkills';
import { toSkillsAIData } from '@/src/skills/server/transforms/toSkillsAI';
import { toSkillsPageData } from '@/src/skills/server/transforms/toSkillsPage';
import { toSkillsSummary } from '@/src/skills/server/transforms/toSkillsSummary';
import type { SkillsAIData, SkillsPageData, SkillsSlug, SkillsSummary } from '@/src/skills/server/types';

export function getSkillsPageData(slug: string = 'skills'): SkillsPageData | null {
	const document = getSkillsDocument(slug);
	return document ? toSkillsPageData(document) : null;
}

export function getSkillsAIData(slug: string = 'skills'): SkillsAIData | null {
	const document = getSkillsDocument(slug);
	return document ? toSkillsAIData(document) : null;
}

export function getSkillsSummaries(): SkillsSummary[] {
	return getAllSkillsDocuments().map(toSkillsSummary);
}

export function getKnownSkillsSlugs(): SkillsSlug[] {
	return getSkillsSlugs();
}
