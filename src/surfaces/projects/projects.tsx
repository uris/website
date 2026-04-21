import { FlexDiv, Preset, useObserveResize } from '@apple-pie/slice';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Direction } from '@/stores/sidebar/_types';
import { useShowProject, useSidebarActions } from '@/stores/sidebar/sidebarStore';
import styles from './Projects.module.css';
import { ProjectDetails } from './project-details';
import { ProjectList } from './project-list';

const transition: Transition = { duration: 0.5, ease: 'easeInOut' };

// note: use 'show project' to avoid removing iframe from dom while animating it's presence state
export function Projects() {
	const showProject = useShowProject();
	const setProject = useSidebarActions().setProject;
	const key = showProject ? 'project.details' : 'project.list';
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

	// set project null once the project list is back up
	const handleAnimationEnd = useCallback(() => {
		if (key === 'project.list') setProject(null);
	}, [key, setProject]);

	// set direction up/down
	useEffect(() => setDirection(showProject ? Direction.Backward : Direction.Forward), [showProject]);

	return (
		<FlexDiv preset={Preset.Column} width={'fill'} height={'fill'} justify={'start'} align={'start'} ref={ref}>
			<AnimatePresence initial={false} mode={'sync'} custom={direction} onExitComplete={handleAnimationEnd}>
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
					{showProject ? <ProjectDetails /> : <ProjectList />}
				</motion.div>
			</AnimatePresence>
		</FlexDiv>
	);
}
