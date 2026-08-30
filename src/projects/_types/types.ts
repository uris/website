import type { StaticImageData } from 'next/image';
import type { ComponentType } from 'react';
import type { ProjectSlug } from '@/projects/_registry/slugs';

export type { ProjectSlug } from '@/projects/_registry/slugs';

export type ProjectTileLogo =
	| {
			type: 'icon';
			name: string;
			strokeColor?: string;
			size?: number;
	  }
	| {
			type: 'logo';
			name: string;
			size?: number;
			color?: string;
			margin?: number | string;
	  }
	| {
			type: 'image';
			src: string;
			alt?: string;
	  };

export type ProjectLink = {
	label: string;
	href: string;
	iconLeft?: string;
	target?: string;
};

export type ProjectCarouselItem = {
	title: string;
	description: string;
	image?: string;
	imageLight?: string;
	imagePos?: 'left' | 'right';
};

export type ProjectHeader = {
	brand?: {
		type: 'logo';
		name?: string;
		color?: string;
		size?: number;
		margin?: string;
	};
	title: string;
	subtitle: string;
	techStack: string[];
	links?: ProjectLink[];
	carousel?: {
		maxImageHeight?: number;
		items: ProjectCarouselItem[];
	};
};

export type ProjectListBlock = {
	type: 'list';
	items: { label?: string; text: string }[];
};

export type ProjectParagraphBlock = {
	type: 'paragraph';
	text: string;
};

export type ProjectCodeBlock = {
	type: 'code';
	language?: string;
	title?: string;
	snippet?: string;
	code?: string;
};

export type ProjectStatsBlock = {
	type: 'stats';
	items: { value: string; label: string }[];
};

export type ProjectBlock = ProjectParagraphBlock | ProjectListBlock | ProjectCodeBlock | ProjectStatsBlock;

export type ProjectSection = {
	title: string;
	icon?: string;
	blocks: ProjectBlock[];
};

export type ProjectAI = {
	summary: string;
	tagline?: string;
	emphasize?: string[];
	avoid?: string[];
	audiences?: string[];
	suggestedQuestions?: string[];
	capabilities?: string[];
	limitations?: string[];
	highlightOrder?: string[];
	relatedProjects?: string[];
	keywords?: string[];
};

export type ProjectTileData = {
	slug: ProjectSlug;
	title: string;
	type: string;
	logo: ProjectTileLogo;
	image?: string;
	titleColor?: string;
	typeColor?: string;
	layout?: 'square' | 'wide' | 'long';
	heavy?: boolean;
	order?: number;
};

export type ProjectDocument = {
	slug: ProjectSlug;
	tile?: Omit<ProjectTileData, 'slug'>;
	ai: ProjectAI;
	header: ProjectHeader;
	sections: ProjectSection[];
};

export type ProjectSummary = {
	slug: ProjectSlug;
	title: string;
	summary: string;
	tagline?: string;
};

export type ProjectPageData = {
	slug: ProjectSlug;
	header: ProjectHeader;
	sections: ProjectSection[];
};

export type ProjectAIData = {
	slug: ProjectSlug;
	title: string;
	summary: string;
	tagline?: string;
	techStack: string[];
	links: ProjectLink[];
	keywords: string[];
	audiences: string[];
	emphasize: string[];
	avoid: string[];
	capabilities: string[];
	limitations: string[];
	highlightOrder: string[];
	suggestedQuestions: string[];
	relatedProjects: string[];
	sectionSummaries: { title: string; content: string[] }[];
	stats: { value: string; label: string }[];
};

export type ProjectViewType = 'page' | 'ai' | 'tile';

export type ProjectDetailsComponent = ComponentType;

export type ThemedImage = {
	image: StaticImageData;
	imageLight: StaticImageData;
};
