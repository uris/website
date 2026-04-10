import { FlexDiv, Preset } from '@apple-pie/slice';
import type React from 'react';
import { useEffect, useMemo } from 'react';
import { useAILayout, useDidAnimateProjects } from '@/app/(ai)/store/layout-store';
import { RcLogo, SliceLogo } from '@/src/components/Logos/Logos';
import type { ProjectTileProps } from '@/src/components/ProjectTile/_types';
import { ProjectTile } from '@/src/components/ProjectTile/ProjectTile';
import styles from './ProjectGrid.module.css';

export interface ProjectGridProps {
	tileSize?: number;
	listGap?: number;
	stagger?: number;
}

const projects: ProjectTileProps[] = [
	{
		logo: <SliceLogo size={28} color={'#ffffff'} />,
		image: '/projects/slicebg.png',
		title: 'React UI Kit',
		type: 'Systems & SDKs',
		titleColor: '#ffffff',
		typeColor: 'rgba(0,0,0,0.3)',
	},
	{
		logo: <RcLogo size={28} color={'#1f262d'} />,
		image: '/projects/rcphonebg.png',
		title: 'Phone & Video',
		type: 'Electron Apps',
		titleColor: '#1f262d',
		typeColor: 'rgba(0,0,0,0.3)',
	},
	{
		logo: <RcLogo size={28} color={'#1f262d'} />,
		image: '/projects/rcvideobg.png',
		title: 'Making meetings happy again',
		type: 'Productivity',
		titleColor: '#1f262d',
		typeColor: 'rgba(0,0,0,0.3)',
		layout: 'long',
	},
	{
		logo: { name: 'linkedin', strokeColor: '#1f262d', size: 32 },
		image: '/projects/gdbg.png',
		title: 'Business ready website builder',
		type: 'Web Apps',
		titleColor: '#1f262d',
		typeColor: 'rgba(0,0,0,0.3)',
	},
	{
		logo: { name: 'linkedin', strokeColor: '#ffffff', size: 32 },
		image: '/projects/unrealbg.png',
		title: 'Unreal & C++ Multiplayer',
		type: 'Gaming',
		titleColor: '#ffffff',
		typeColor: '#ffffff',
		heavy: true,
	},
];

export function ProjectGrid(props: Readonly<ProjectGridProps>) {
	const { tileSize = 200, listGap = 24, stagger = 0.1 } = props;
	const didAnimate = useDidAnimateProjects();
	const setDidAnimate = useAILayout().setDidAnimateProjects;

	const cssVars = useMemo(() => {
		return { '--tile-size': `${tileSize}px`, '--list-gap': `${listGap}px` } as React.CSSProperties;
	}, [tileSize, listGap]);

	// only animate projects in once per session
	useEffect(() => setDidAnimate(true), [setDidAnimate]);

	return (
		<FlexDiv preset={Preset.FillScroll} scrollY={true} padding={64}>
			<div className={styles.grid} style={cssVars}>
				{projects.map((project, index) => {
					const staggerChild = stagger ? stagger * index : 0;
					const rounded = Math.round(staggerChild * 100) / 100;
					return (
						<ProjectTile
							key={project.title}
							listGap={listGap}
							stagger={didAnimate ? 0 : rounded}
							{...project}
						/>
					);
				})}
			</div>
		</FlexDiv>
	);
}
