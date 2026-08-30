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

/**
 * Create a gradient cover-up for images with a harder transition from 100%
 */
export function hardGradientCover(surfaceHex: string, to: 'top' | 'bottom') {
	const rgb = hexToRgb(surfaceHex) ?? 'rgb(0,0,0)';
	const stops = [
		{ color: addOpacity(rgb, 1), amount: 0 },
		{ color: addOpacity(rgb, 1), amount: 25 },
		{ color: addOpacity(rgb, 0), amount: 100 },
	];
	const styleValues = stops.map((stop) => `${stop.color} ${stop.amount}%`).join(', ');
	return `linear-gradient(to ${to}, ${styleValues})`;
}

/**
 * Join an array of styles in single string for class name
 */
export function classNames(styles: string[]) {
	return styles.join(' ');
}

/**
 * Normalize a style value or fallback into a CSS-ready string.
 */
export function setStyle(value: string | number | undefined, defaultVal: number | string | undefined = undefined) {
	const useValue = value ?? defaultVal;
	if (!useValue) return 'unset';
	if (typeof useValue === 'string') return useValue;
	return `${useValue}px`;
}
