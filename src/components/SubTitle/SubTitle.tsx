import type React from 'react';
import styles from './SubTitle.module.css';

interface SubTitleProps {
	title?: string;
	children?: React.ReactNode;
}
export function SubTitle(props: Readonly<SubTitleProps>) {
	const { title, children } = props;
	return <p className={styles.subtitle}>{children ?? title}</p>;
}
