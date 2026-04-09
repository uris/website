import type { Role } from '@/src/stores/responses/_types';

export enum EAction {
	TalkToVi = 'talk-to-vi',
	ToggleSidebar = 'toggle-sidebar',
	Contact = 'contact',
}

export const avatarColor = (role: Role) => {
	return {
		bgColor: role === 'assistant' ? 'var(--array-magenta)' : 'var(--array-land)',
		borderColor: role === 'assistant' ? 'var(--array-magenta-label)' : 'var(--array-land-label)',
		textColor: role === 'assistant' ? 'var(--array-magenta-label)' : 'var(--array-land-label)',
	};
};
