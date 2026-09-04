import type { ButtonProps } from '@apple-pie/slice';
import React, { useMemo } from 'react';
import styles from './DataButtons.module.css';

interface DataButtonGridProps {
	children?: React.ReactNode;
	margin?: boolean;
	marginSize?: number;
	maxWidth?: number;
	padding?: number;
}

export function DataButtonGrid(props: Readonly<DataButtonGridProps>) {
	const { children, margin = true, maxWidth = 1024, padding = 64, marginSize = 64 } = props;

	const buttons = React.Children.map(children, (child) => {
		if (!React.isValidElement(child)) return child;
		const button = child as React.ReactElement<ButtonProps>;

		return React.cloneElement(button, {
			...button.props,
		});
	});

	const cssVars = useMemo(() => {
		return {
			'--grid-max-width': `${maxWidth}px`,
			'--grid-padding': `0 ${padding}px`,
			'--grid-margin': margin ? `0 0 ${marginSize}px 0` : '0',
		} as React.CSSProperties;
	}, [maxWidth, padding, margin, marginSize]);

	return (
		<div className={styles.wrapper} style={cssVars}>
			{buttons}
		</div>
	);
}

interface DataButtonProps {
	value?: string;
	label?: string;
	icon?: string;
}

export function DataButton(props: Readonly<DataButtonProps>) {
	const { value, label } = props;
	return (
		<div className={styles.button}>
			<span className={styles.value}>{value}</span>
			<span className={styles.label}>{label}</span>
		</div>
	);
}
