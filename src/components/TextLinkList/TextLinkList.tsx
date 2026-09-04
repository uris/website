import type React from 'react';
import { useMemo } from 'react';
import styles from './TextLinkList.module.css';

interface ProjectTitleProps {
	children?: React.ReactNode;
	gap?: boolean;
	gapSize?: number;
	margin?: boolean;
	marginSize?: number;
}
export function TextLinkList(props: Readonly<ProjectTitleProps>) {
	const { children, margin = true, marginSize = 16, gap = true, gapSize = 8 } = props;

	const cssVars = useMemo(() => {
		return {
			'--links-gap': gap ? `${gapSize}px` : '0',
			'--links-margin': margin ? `0 0 ${marginSize}px 0` : '0',
		} as React.CSSProperties;
	}, [gap, gapSize, margin, marginSize]);

	return (
		<div className={styles.linklist} style={cssVars}>
			{children}
		</div>
	);
}
