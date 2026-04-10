import type { IconProps } from '@apple-pie/slice';
import type React from 'react';

export interface ProjectTileProps {
	title?: string;
	type?: string;
	logo?: React.ReactNode | IconProps | string;
	image?: React.ReactNode | string;
	width?: number;
	height?: number;
	titleColor?: string;
	typeColor?: string;
	layout?: 'square' | 'wide' | 'long';
	listGap?: number;
	heavy?: boolean;
	stagger?: number;
}
