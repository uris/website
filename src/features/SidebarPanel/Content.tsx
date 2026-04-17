import { FlexDiv, Preset, useObserveResize, useTheme } from '@apple-pie/slice';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'motion/react';
import type React from 'react';
import { useMemo, useRef } from 'react';
import { Contact } from '@/src/surfaces/contact/contact';
import { Projects } from '@/src/surfaces/projects/projects';
import { ProjectsHeader } from '@/src/surfaces/projects/projects-header';
import { Skills } from '@/src/surfaces/skills/skills';
import { type Direction, SidebarSurface } from '@/stores/sidebar/_types';
import { useDirection, useSurface } from '@/stores/sidebar/sidebarStore';
import { gradientCover } from '@/utils/styles/styles';
import styles from './Sidebar.module.css';

export function Content() {
	const { current } = useTheme();
	const surfaceColor = current.colors['core-surface-primary-tint'];
	const surface = useSurface();
	const direction = useDirection();
	const ref = useRef<HTMLDivElement>(null);
	const { width } = useObserveResize(ref, { ignore: 'height' });
	const isProject = surface === SidebarSurface.Projects;

	// variants with a custom direction to animate left/right
	const variants = {
		enter: (direction: Direction) => {
			return { x: direction > 0 ? width : -width, opacity: 0 };
		},
		center: { zIndex: 1, x: 0, opacity: 1 },
		exit: (direction: Direction) => {
			return { zIndex: 0, x: direction < 0 ? width : -width, opacity: 0 };
		},
	};

	const cssVars = useMemo(() => {
		return {
			'--bot-gradient': gradientCover(surfaceColor, 'top'),
			'--top-gradient': gradientCover(surfaceColor, 'bottom'),
		} as React.CSSProperties;
	}, [surfaceColor]);

	return (
		<FlexDiv preset={Preset.FillCenter} ref={ref} style={cssVars}>
			<div className={`${styles.cover} ${styles.top}`} />
			<div className={`${styles.cover} ${styles.bot}`} />
			{isProject && <ProjectsHeader />}
			<AnimatePresence initial={false} custom={direction}>
				<motion.div
					className={styles.contentWrapper}
					variants={variants}
					transition={{ duration: 0.35, ease: 'easeInOut' }}
					initial={'enter'}
					animate={'center'}
					exit={'exit'}
					custom={direction}
					key={`surface_${surface}`}
				>
					{surface === SidebarSurface.Projects && <Projects />}
					{surface === SidebarSurface.Skills && <Skills />}
					{surface === SidebarSurface.Contact && <Contact />}
				</motion.div>
			</AnimatePresence>
		</FlexDiv>
	);
}
