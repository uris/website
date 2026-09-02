import type React from 'react';
import { useMemo } from 'react';
import styles from './SubTitle.module.css';

interface SubTitleProps {
	title?: string;
	children?: React.ReactNode;
	margin?: boolean;
	marginSize?: number;
}
export function SubTitle(props: Readonly<SubTitleProps>) {
	const { title, children, margin = true, marginSize = 64 } = props;

	const cssVars = useMemo(() => {
		return {
			'--subtitle-margin-bottom': margin ? `${marginSize}px` : '0',
		} as React.CSSProperties;
	}, [margin, marginSize]);

	return (
		<div className={styles.subtitle} style={cssVars}>
			{children ?? title}
		</div>
	);
}
