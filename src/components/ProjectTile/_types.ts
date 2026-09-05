import type { ProjectSlug, ProjectTileData } from '@/projects/_types/types';

export type AnimationValue = { [key: string]: number };

export interface ProjectTileProps {
	project: ProjectTileData;
	width?: number;
	height?: number;
	titleColor?: string;
	listGap?: number;
	stagger?: number;
	animate?: { start: AnimationValue; end: AnimationValue };
	borderColor?: string;
	onAnimationEnd?: (index: number) => void;
	onClick?: (slug: ProjectSlug) => void;
	index?: number;
	backgroundColor?: string;
}
