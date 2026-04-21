import type { AnimationValue } from '@/src/components/ProjectTile/_types';

/**
 * Avoid hydration issues by making these non random
 */
export const animateMap: { start: AnimationValue; end: AnimationValue }[] = [
	{ start: { y: 50 }, end: { y: 0 } },
	{ start: { x: -50 }, end: { x: 0 } },
	{ start: { y: -50 }, end: { y: 0 } },
	{ start: { x: 50 }, end: { x: 0 } },
];

/**
 * Tile index selects the transform to apply on entry
 */
export function resolveAnimation(index: number) {
	return animateMap[index % animateMap.length];
}
