import { AnimationType, type ButtonAnimation } from '@apple-pie/slice';

/**
 * Actions for link renderer
 */
export enum EAction {
	TalkToVi = 'talk-to-vi',
	Sidebar = 'sidebar',
}

/**
 * Button rotate used in toggle buttons
 */
export const buttonRotateAnimation: ButtonAnimation = {
	animation: { type: AnimationType.Rotate, value: { on: 0, off: 180 } },
	transition: {
		on: { duration: 0.25, ease: 'linear', delay: 0.25 },
		off: { duration: 0.25, ease: 'linear', delay: 0 },
	},
};

/**
 * Button rotate used in toggle buttons
 */
export const viTalkButtonAnimation: ButtonAnimation = {
	animation: { type: AnimationType.Rotate, value: { on: 180, off: 0 } },
	transition: {
		on: { duration: 0.25, ease: 'linear' },
		off: { duration: 0, ease: 'linear' },
	},
};

export const linkedinProfilePage = 'https://www.linkedin.com/in/uris-dacosta-4b100735a/';
