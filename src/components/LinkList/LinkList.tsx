import type { ButtonProps } from '@apple-pie/slice';
import React, { useMemo } from 'react';
import { classNames } from '@/utils/styles/styles';
import styles from './LinkList.module.css';

interface LinkListProps {
	children: React.ReactNode;
	direction?: 'row' | 'column';
}

export const LinkList = (props: Readonly<LinkListProps>) => {
	const { children, direction = 'column' } = props;

	const items = React.Children.map(children, (child) => {
		if (!React.isValidElement(child)) return child;
		const button = child as React.ReactElement<ButtonProps>;

		return React.cloneElement(button, {
			...button.props,
			variant: 'text',
			underline: true,
			labelColor: 'var(--core-text-special)',
			className: styles.button,
		});
	});

	const styleNames = useMemo(() => {
		const names = [styles.wrapper];
		if (direction === 'row') names.push(styles.row);
		return names;
	}, [direction]);

	return <div className={classNames(styleNames)}>{items}</div>;
};
