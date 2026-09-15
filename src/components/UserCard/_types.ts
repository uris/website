import type { StaticImageData } from 'next/image';

export interface UserCardProps {
	photo?: StaticImageData;
	name?: string;
	role: string;
	company?: string;
	quote?: string;
	videoLabel?: string;
	videoUrl?: string;
	height?: number | string;
	width?: number | string;
	showVideo?: boolean;
}

export interface UserGridProps {
	gap?: number | string;
	maxCards?: number;
	cards?: UserCardProps[];
	cardHeight?: number | string;
	cardWidth?: number | string;
	showVideo?: boolean;
	margin?: boolean;
	marginSize?: number | string;
}
