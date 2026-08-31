import type React from 'react';
import { useMemo } from 'react';
import styles from './ProjectTitle.module.css';

interface ProjectTitleProps {
	title?: string;
	children?: React.ReactNode;
	nowrap?: boolean;
}
export function ProjectTitle(props: Readonly<ProjectTitleProps>) {
	const { title, children, nowrap = false } = props;

	const cssVars = useMemo(() => {
		return {
			'--title-nowrap': nowrap ? 'nowrap' : 'normal',
		} as React.CSSProperties;
	}, [nowrap]);

	return (
		<h1 className={styles.title} style={cssVars}>
			{children ?? title}
		</h1>
	);
}
