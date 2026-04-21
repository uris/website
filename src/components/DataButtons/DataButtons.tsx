import type { ButtonProps } from '@apple-pie/slice';
import React from 'react';
import styles from './DataButtons.module.css';

interface DataButtonsProps {
	children?: React.ReactNode;
}

export function DataButtonGrid(props: Readonly<DataButtonsProps>) {
	const { children } = props;

	const buttons = React.Children.map(children, (child) => {
		if (!React.isValidElement(child)) return child;
		const button = child as React.ReactElement<ButtonProps>;

		return React.cloneElement(button, {
			...button.props,
		});
	});

	return <div className={styles.grid}>{buttons}</div>;
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
