import type React from 'react';
import { useMemo } from 'react';
import styles from './TextTitle.module.css';

interface ProjectTitleProps {
	title?: string;
	children?: React.ReactNode;
	maxWidth?: string | number;
	align?: 'left' | 'right' | 'center';
}
export function TextTitle(props: Readonly<ProjectTitleProps>) {
	const { title, children, align = 'left' } = props;

	const cssVars = useMemo(() => {
		return {
			'--title-text-align': align,
		} as React.CSSProperties;
	}, [align]);

	return (
		<h1 className={styles.title} style={cssVars}>
			{children ?? title}
		</h1>
	);
}
