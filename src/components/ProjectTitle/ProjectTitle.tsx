import type React from 'react';
import { useMemo } from 'react';
import { setStyle } from '@/utils/styles/styles';
import styles from './ProjectTitle.module.css';

interface ProjectTitleProps {
	title?: string;
	children?: React.ReactNode;
	nowrap?: boolean;
	maxWidth?: string | number;
}
export function ProjectTitle(props: Readonly<ProjectTitleProps>) {
	const { title, children, nowrap = false, maxWidth = 600 } = props;

	const cssVars = useMemo(() => {
		return {
			'--title-nowrap': nowrap ? 'nowrap' : 'normal',
			'--title-max-width': setStyle(maxWidth),
		} as React.CSSProperties;
	}, [nowrap, maxWidth]);

	return (
		<h1 className={styles.title} style={cssVars}>
			{children ?? title}
		</h1>
	);
}
