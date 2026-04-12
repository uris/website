import type React from 'react';

export type AnimationValue = { [key: string]: number };

export interface ProjectTileProps {
	title?: string;
	type?: string;
	logo?: string | { type: 'icon' | 'logo'; props?: any };
	image?: React.ReactNode | string;
	width?: number;
	height?: number;
	titleColor?: string;
	typeColor?: string;
	layout?: 'square' | 'wide' | 'long';
	listGap?: number;
	heavy?: boolean;
	stagger?: number;
	animate?: { start: AnimationValue; end: AnimationValue };
	borderColor?: string;
	onAnimationEnd?: (index: number) => void;
	index?: number;
}
