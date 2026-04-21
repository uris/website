import type { LabelProps } from '@apple-pie/slice';
import React from 'react';
import styles from './TechStack.module.css';

interface TechStackProps {
	children: React.ReactNode;
}

export function TechStack({ children }: Readonly<TechStackProps>) {
	const items = React.Children.map(children, (child) => {
		if (!React.isValidElement(child)) return child;
		const label = child as React.ReactElement<LabelProps>;

		return React.cloneElement(label, {
			bgColor: 'var(--array-sea-label)',
			textColor: 'var(--core-text-light)',
			borderSize: 0,
			borderRadius: 16,
			padding: '4px 12px',
			style: { display: 'flex' },
		});
	});

	return <div className={styles.wrapper}>{items}</div>;
}
