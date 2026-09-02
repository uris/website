import type React from 'react';
import { useMemo } from 'react';
import styles from './InlineTitle.module.css';

interface ProjectTitleProps {
	title?: string;
	children?: React.ReactNode;
	nowrap?: boolean;
	margin?: boolean;
	marginSize?: number;
}
export function InlineTitle(props: Readonly<ProjectTitleProps>) {
	const { title, children, nowrap = false, margin = true, marginSize = 64 } = props;

	const cssVars = useMemo(() => {
		return {
			'--title-nowrap': nowrap ? 'nowrap' : 'normal',
			'--title-margin': margin ? `${marginSize}px 0` : '0',
		} as React.CSSProperties;
	}, [nowrap, margin, marginSize]);

	return (
		<div className={styles.wrapper} style={cssVars}>
			<div className={styles.line} />
			{(children || title) && (
				<span className={styles.title} style={cssVars}>
					{children ?? title}
				</span>
			)}
			<div className={styles.line} />
		</div>
	);
}
