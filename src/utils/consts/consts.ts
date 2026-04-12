import { AnimationType, type ButtonAnimation } from '@apple-pie/slice';
import type { Role } from '@/src/stores/responses/_types';

/**
 * Default marker for end-of-response to show blinking cursor
 */
export const DEFAULT_MARKER = ' [[END-MARKER]]';

/**
 * Thinking placeholder message for awaiting response streams
 */
export const THINKING_PLACEHOLDER = 'Thinking... [[END-MARKER]]';

/**
 * Actions for link renderer
 */
export enum EAction {
	TalkToVi = 'talk-to-vi',
	ToggleSidebar = 'toggle-sidebar',
	Contact = 'contact',
}

/**
 * Color map schemes for avatars
 */
export const avatarColor = (role: Role) => {
	return {
		bgColor: role === 'assistant' ? 'var(--array-magenta)' : 'var(--array-land)',
		borderColor: role === 'assistant' ? 'var(--array-magenta-label)' : 'var(--array-land-label)',
		textColor: role === 'assistant' ? 'var(--array-magenta-label)' : 'var(--array-land-label)',
	};
};

/**
 * Button rotate used in toggle buttons
 */
export const buttonRotateAnimation: ButtonAnimation = {
	type: AnimationType.Rotate,
	value: { start: 0, end: 180 },
	transition: { duration: 0.25, ease: 'linear', delay: 0.25 },
};
