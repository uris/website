export type SkillLevel = string;

export type SkillMetric = {
	name: string;
	value: number;
	level: SkillLevel;
};

export type SkillChipSection = {
	type: 'chips';
	title: string;
	description?: string;
	items: string[];
};

export type SkillSliderSection = {
	type: 'sliders';
	title: string;
	description?: string;
	items: SkillMetric[];
};

export type SkillsSection = SkillChipSection | SkillSliderSection;

export type SkillsColumn = {
	title: string;
	description?: string;
	sections: SkillsSection[];
};

export type SkillsAI = {
	summary: string;
	highlights?: string[];
	keywords?: string[];
	suggestedQuestions?: string[];
};

export type SkillsDocument = {
	slug: string;
	title: string;
	ai?: SkillsAI;
	columns: SkillsColumn[];
};
