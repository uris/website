import type React from 'react';
import { useMemo } from 'react';
import styles from './TextParagraph.module.css';

interface ProjectTitleProps {
	text?: string;
	children?: React.ReactNode;
	maxWidth?: number;
	margin?: boolean;
	marginSize?: number;
}
export function TextParagraph(props: Readonly<ProjectTitleProps>) {
	const { text, children, maxWidth = 600, margin = true, marginSize = 0 } = props;

	const cssVars = useMemo(() => {
		return {
			'--text-max-width': `${maxWidth}px`,
			'--text-margin': margin ? `0 0 ${marginSize}px 0` : '0',
		} as React.CSSProperties;
	}, [maxWidth, margin, marginSize]);

	return (
		<div className={styles.textParagraph} style={cssVars}>
			{children ?? text}
		</div>
	);
}
