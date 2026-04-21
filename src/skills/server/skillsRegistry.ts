import 'server-only';
import skills from '@/src/content/skills/skills.json';
import type { SkillsDocumentData, SkillsSlug } from '@/src/skills/server/types';

export const skillsRegistry: Record<SkillsSlug, SkillsDocumentData> = {
	skills: skills as SkillsDocumentData,
};

export const skillsSlugs = Object.keys(skillsRegistry) as SkillsSlug[];
