import { FlexDiv, Preset, useObserveResize } from '@apple-pie/slice';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'motion/react';
import { useRef } from 'react';
import { Contact } from '@/src/surfaces/contact';
import { Projects } from '@/src/surfaces/projects';
import { Skills } from '@/src/surfaces/skills';
import { type Direction, SidebarSurface } from '@/stores/sidebar/_types';
import { useDirection, useSurface } from '@/stores/sidebar/sidebarStore';
import styles from './Sidebar.module.css';

export function Content() {
	const surface = useSurface();
	const direction = useDirection();
	const ref = useRef<HTMLDivElement>(null);
	const { width } = useObserveResize(ref, { ignore: 'height' });

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

	return (
		<FlexDiv preset={Preset.FillCenter} ref={ref}>
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
