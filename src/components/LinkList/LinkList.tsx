import type { ButtonProps } from '@apple-pie/slice';
import React, { useMemo } from 'react';
import { classNames } from '@/utils/styles/styles';
import styles from './LinkList.module.css';

interface LinkListProps {
	children: React.ReactNode;
	direction?: 'row' | 'column';
	margin?: boolean;
	marginSize?: number;
}

export const LinkList = (props: Readonly<LinkListProps>) => {
	const { children, direction = 'column', margin = false, marginSize = 88 } = props;

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

	const cssVars = useMemo(() => {
		return {
			'--links-bottom-margin': margin ? `${marginSize}px` : '0',
		} as React.CSSProperties;
	}, [margin, marginSize]);

	const styleNames = useMemo(() => {
		const names = [styles.wrapper];
		if (direction === 'row') names.push(styles.row);
		return names;
	}, [direction]);

	return (
		<div className={classNames(styleNames)} style={cssVars}>
			{items}
		</div>
	);
};
