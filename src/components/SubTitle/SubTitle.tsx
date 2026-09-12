import type React from 'react';
import { useMemo } from 'react';
import { setStyle } from '@/utils/styles/styles';
import styles from './SubTitle.module.css';

interface SubTitleProps {
	title?: string;
	children?: React.ReactNode;
	margin?: boolean;
	marginSize?: number;
	maxWidth?: string | number;
}
export function SubTitle(props: Readonly<SubTitleProps>) {
	const { title, children, margin = true, marginSize = 64, maxWidth = 600 } = props;

	const cssVars = useMemo(() => {
		return {
			'--subtitle-margin-bottom': margin ? `${marginSize}px` : '0',
			'--subtitle-max-width': setStyle(maxWidth),
		} as React.CSSProperties;
	}, [margin, marginSize, maxWidth]);

	return (
		<div className={styles.subtitle} style={cssVars}>
			{children ?? title}
		</div>
	);
}
