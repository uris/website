'use client';

import { AnimationType, type ButtonAnimation, IconButton, useTheme } from '@apple-pie/slice';
import type { AnimationDefinition, Transition, Variants } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useProject, useShowProject, useSidebarActions } from '@/stores/sidebar/sidebarStore';
import { gradientCover } from '@/utils/styles/styles';
import styles from './Surfaces.module.css';

const variants: Variants = {
	initial: { opacity: 0, transform: 'translateY(100%)' },
	animate: { opacity: 1, transform: 'translateY(0%)' },
	exit: { opacity: 0, transform: 'translateY(100%)' },
};

// custom animation for the close button
const closeAnimation = {
	animation: { type: AnimationType.Rotate, value: { off: 0, on: 180 } },
	transition: {
		on: { duration: 0.35, ease: 'linear', delay: 0.25 },
		off: { duration: 0.25, ease: 'linear', delay: 0 },
	},
} as ButtonAnimation;

export function ProjectsFooter() {
	const { current } = useTheme();
	const surfaceColor = current.colors['core-surface-primary-tint'];
	const project = useProject();
	const showProject = useShowProject();
	const setShowProject = useSidebarActions().setShowProject;
	const [toggled, setToggled] = useState(false);
	const delay = project ? 0.35 : 0.1;
	const transition: Transition = { duration: 0.25, ease: 'easeInOut', delay };

	// memo dynamic css variables
	const cssVars = useMemo(() => {
		return {
			'--footer-gradient': gradientCover(surfaceColor, 'top'),
		} as React.CSSProperties;
	}, [surfaceColor]);

	// set the toggle state to trigger button animation on/off
	const handleAnimationStart = (state: AnimationDefinition) => {
		if (state === 'animate') setToggled(true);
		if (state === 'exit') setToggled(false);
	};

	// toggle button animation off when closing a project
	const handleCloseProject = () => {
		setToggled(false);
		setShowProject(false);
	};

	return (
		<AnimatePresence initial={true}>
			{showProject && (
				<motion.div
					className={styles.footer}
					style={cssVars}
					variants={variants}
					transition={transition}
					initial={'initial'}
					animate={'animate'}
					exit={'exit'}
					onAnimationStart={handleAnimationStart}
				>
					<IconButton
						icon={'x'}
						buttonSize={'xl'}
						toggle={false}
						onClick={handleCloseProject}
						isToggled={toggled}
						customAnimations={closeAnimation}
						bgColorOn={'var(--core-surface-secondary)'}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
