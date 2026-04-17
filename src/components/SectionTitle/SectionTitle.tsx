import { Icon } from '@apple-pie/slice';
import type React from 'react';
import styles from './SectionTitle.module.css';

interface SectionTitleProps {
	children?: React.ReactNode;
	title?: string;
	icon?: string;
	fill?: boolean;
	iconSize?: number;
}

export function SectionTitle(props: Readonly<SectionTitleProps>) {
	const { title, icon, children, fill = true, iconSize = 20 } = props;

	return (
		<div className={styles.wrapper}>
			{icon && <Icon name={icon} fill={fill} size={iconSize} />}
			<span className={'body-l-bold'}>{children ?? title}</span>
		</div>
	);
}
