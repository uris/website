'use client';

import { FlexDiv, Preset } from '@apple-pie/slice';
import type React from 'react';
import { useCallback, useMemo } from 'react';
import { resolveAnimation } from '@/src/components/ProjectGrid/_data';
import { ProjectTile } from '@/src/components/ProjectTile/ProjectTile';
import {
	useDidAnimateProjects,
	useHomeLayout,
	useProjects,
} from '@/src/stores/home-layout/homeLayoutStore';
import styles from './ProjectGrid.module.css';

export interface ProjectGridProps {
	tileSize?: number;
	listGap?: number;
	stagger?: number;
	staggerSeed?: number;
}

export function ProjectGrid(props: Readonly<ProjectGridProps>) {
	const { tileSize = 200, listGap = 24, stagger = 0.1, staggerSeed = 0 } = props;
	const projects = useProjects();
	const didAnimate = useDidAnimateProjects();
	const setDidAnimate = useHomeLayout().setDidAnimateProjects;

	// memo dynamic css vars
	const cssVars = useMemo(() => {
		return { '--tile-size': `${tileSize}px`, '--list-gap': `${listGap}px` } as React.CSSProperties;
	}, [tileSize, listGap]);

	// only animate once each session
	const handleAnimationEnd = useCallback(
		(index: number) => {
			if (index === projects.length - 1) setDidAnimate(true);
		},
		[projects.length, setDidAnimate],
	);

	return (
		<FlexDiv preset={Preset.FillScroll} scrollY={true} padding={64}>
			<div className={styles.grid} style={cssVars}>
				{projects.map((project: any, index: number) => {
					const staggerChild = stagger * index + staggerSeed;
					const rounded = Math.round(staggerChild * 100) / 100;
					return (
						<ProjectTile
							key={project.title}
							listGap={listGap}
							stagger={didAnimate ? 0 : rounded}
							animate={resolveAnimation(index)}
							onAnimationEnd={handleAnimationEnd}
							{...project}
						/>
					);
				})}
			</div>
		</FlexDiv>
	);
}
