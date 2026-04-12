import { FlexDiv, Preset, useObserveResize } from '@apple-pie/slice';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ProjectDetails } from '@/src/surfaces/project-details';
import { ProjectList } from '@/src/surfaces/project-list';
import { ProjectsFooter } from '@/src/surfaces/projects-footer';
import { Direction } from '@/stores/sidebar/_types';
import { useProject } from '@/stores/sidebar/sidebarStore';
import styles from './Surfaces.module.css';

const transition: Transition = { duration: 0.5, ease: 'easeInOut' };

export function Projects() {
	const project = useProject();
	const key = project ? 'project.details' : 'project.list';
	const ref = useRef<HTMLDivElement>(null);
	const { height } = useObserveResize(ref, { ignore: 'width' });
	const [direction, setDirection] = useState<Direction>(Direction.Forward);

	// variants with a custom direction to animate left/right
	const variants = {
		enter: (direction: Direction) => {
			return { y: direction > 0 ? height : -height, opacity: 0 };
		},
		center: { zIndex: 1, y: 0, opacity: 1 },
		exit: (direction: Direction) => {
			return { zIndex: 0, y: direction < 0 ? height : -height, opacity: 0 };
		},
	};

	// set direction up/down
	useEffect(() => setDirection(project ? Direction.Backward : Direction.Forward), [project]);

	return (
		<FlexDiv
			preset={Preset.Column}
			width={'fill'}
			height={'fill'}
			justify={'start'}
			align={'start'}
			ref={ref}
		>
			<AnimatePresence initial={false} mode={'sync'} custom={direction}>
				<motion.div
					transition={transition}
					variants={variants}
					initial={'enter'}
					animate={'center'}
					exit={'exit'}
					custom={direction}
					className={styles.projectsWrapper}
					key={key}
				>
					{project ? <ProjectDetails /> : <ProjectList />}
				</motion.div>
			</AnimatePresence>
			<ProjectsFooter />
		</FlexDiv>
	);
}
