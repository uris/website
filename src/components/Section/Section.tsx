import { useTheme } from '@apple-pie/slice';
import { addOpacity } from '@apple-pie/slice/utils';
import type React from 'react';
import { useMemo } from 'react';
import type { SectionProps } from '@/components/Section/_types';
import styles from './Section.module.css';

export function Section(props: Readonly<SectionProps>) {
	const { gradient = true, direction = 'bottom', children } = props;
	const { current } = useTheme();
	const surfaceColor = current.colors['core-surface-primary'];
	const borderColor = current.colors['core-outline-secondary'];
	const stops = [
		{ color: addOpacity(surfaceColor, 1), amount: 0 },
		{ color: addOpacity(surfaceColor, 0.25), amount: 25 },
		{ color: addOpacity(surfaceColor, 0), amount: 100 },
	];
	const styleValues = stops.map((stop) => `${stop.color} ${stop.amount}%`).join(', ');
	const bgGradient = `linear-gradient(to ${direction}, ${styleValues})`;

	const cssVars = useMemo(() => {
		return {
			'--section-gradient': gradient ? bgGradient : 'transparent',
			'--section-padding-bottom': gradient ? '0' : '64px',
			'--section-border-color': addOpacity(borderColor, 0.75),
		} as React.CSSProperties;
	}, [gradient, bgGradient, borderColor]);

	return (
		<div className={styles.wrapper} style={cssVars}>
			{children}
		</div>
	);
}
