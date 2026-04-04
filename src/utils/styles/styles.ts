import { addOpacity, hexToRgb } from '@apple-pie/slice/utils';

/**
 * Create gradient cover-ups
 */
export function gradientCover(surfaceHex: string, to: 'top' | 'bottom') {
	const rgb = hexToRgb(surfaceHex) ?? 'rgb(0,0,0)';
	const stops = [
		{ color: addOpacity(rgb, 1), amount: 0 },
		{ color: addOpacity(rgb, 0.8), amount: 65 },
		{ color: addOpacity(rgb, 0), amount: 100 },
	];
	const styleValues = stops.map((stop) => `${stop.color} ${stop.amount}%`).join(', ');
	return `linear-gradient(to ${to}, ${styleValues})`;
}
