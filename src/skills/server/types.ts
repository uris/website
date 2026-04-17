import type {
	SkillsAI,
	SkillsColumn,
	SkillsDocument,
	SkillsSection,
} from '@/src/content/skills/types';

export type SkillsSlug = 'skills';

export type SkillsPageData = {
	slug: SkillsSlug;
	title: string;
	columns: SkillsColumn[];
};

export type SkillsSectionSummary = {
	title: string;
	type: SkillsSection['type'];
	description?: string;
	items: string[];
};

export type SkillsAIData = {
	slug: SkillsSlug;
	title: string;
	summary: string;
	highlights: string[];
	keywords: string[];
	suggestedQuestions: string[];
	sections: SkillsSectionSummary[];
};

export type SkillsSummary = {
	slug: SkillsSlug;
	title: string;
	summary: string;
	highlights: SkillsAI['highlights'];
};

export type SkillsDocumentData = SkillsDocument & { slug: SkillsSlug };
