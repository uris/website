'use client';

import { AnimationType, type ButtonAnimation, IconButton, ToastType, useClipboard } from '@apple-pie/slice';
import { type Toast, useTipActions, useToastActions } from '@apple-pie/slice/stores';
import type { AnimationDefinition, Transition, Variants } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useHomeLayout } from '@/stores/home-layout/homeLayoutStore';
import { SidebarSurface } from '@/stores/sidebar/_types';
import {
	useProject,
	useShowOverlays,
	useShowProject,
	useSidebarActions,
	useSurface,
} from '@/stores/sidebar/sidebarStore';
import styles from './Projects.module.css';

const variants: Variants = {
	initial: { opacity: 0, transform: 'translateY(-100%)' },
	animate: { opacity: 1, transform: 'translateY(0%)' },
	exit: { opacity: 0, transform: 'translateY(-100%)' },
};

// custom animation for the close button
const closeAnimation = {
	animation: { type: AnimationType.Rotate, value: { off: 0, on: 180 } },
	transition: {
		on: { duration: 0.35, ease: 'linear', delay: 0.25 },
		off: { duration: 0.25, ease: 'linear', delay: 0 },
	},
} as ButtonAnimation;

// custom animation for the share button
const shareAnimation = {
	animation: { type: AnimationType.Scale, value: { off: 0, on: 1 } },
	transition: {
		on: { duration: 0.35, ease: 'linear', delay: 0.25 },
		off: { duration: 0.25, ease: 'linear', delay: 0 },
	},
} as ButtonAnimation;

export function ProjectsHeader() {
	const project = useProject();
	const showCloseProject = useShowOverlays();
	const showProject = useShowProject();
	const pushTip = useTipActions().push;
	const pushToast = useToastActions().push;
	const isProject = useSurface() === SidebarSurface.Projects;
	const setShowProject = useSidebarActions().setShowProject;
	const pushHistory = useHomeLayout().pushHistory;
	const { isSupported, copy } = useClipboard();
	const [toggled, setToggled] = useState(false);
	const delay = project ? 0.35 : 0.1;
	const transition: Transition = { duration: 0.25, ease: 'easeInOut', delay };

	// set the toggle state to trigger button animation on/off
	const handleAnimationStart = (state: AnimationDefinition) => {
		if (state === 'animate') setToggled(true);
		if (state === 'exit') setToggled(false);
	};

	// toggle button animation off when closing a project
	const handleCloseProject = () => {
		pushTip(null);
		setToggled(false);
		setShowProject(false);
		pushHistory({ sidebar: SidebarSurface.Projects });
	};

	// copy to clipboard and notify
	const handleShare = async () => {
		pushTip(null);
		let copied = false;
		if (isSupported) copied = await copy(window.location.href);
		const notify: Toast = {
			notifId: Date.now().toString(),
			message: copied ? 'Project link copied to clipboard' : 'Failed to copy project link',
			position: 'top',
			type: copied ? ToastType.Success : ToastType.Error,
			container: 'window',
		};
		pushToast(notify);
	};

	// needs a valid slug
	if (!isProject) return null;

	return (
		<AnimatePresence initial={true}>
			{showProject && (
				<motion.div
					className={styles.header}
					variants={variants}
					transition={transition}
					initial={'initial'}
					animate={'animate'}
					exit={'exit'}
					onAnimationStart={handleAnimationStart}
				>
					{showCloseProject && (
						<>
							<IconButton
								icon={'share'}
								buttonSize={'l'}
								toggle={false}
								isToggled={toggled}
								customAnimations={shareAnimation}
								bgColorOn={'var(--core-surface-secondary)'}
								tooltip={'Share link'}
								onClick={handleShare}
								onToolTip={pushTip}
							/>
							<IconButton
								icon={'x'}
								buttonSize={'l'}
								toggle={false}
								onClick={handleCloseProject}
								isToggled={toggled}
								customAnimations={closeAnimation}
								bgColorOn={'var(--core-surface-secondary)'}
								tooltip={'Close'}
								onToolTip={pushTip}
							/>
						</>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
