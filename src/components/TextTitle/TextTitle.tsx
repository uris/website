import type React from 'react';
import styles from './TextTitle.module.css';

interface ProjectTitleProps {
	title?: string;
	children?: React.ReactNode;
	maxWidth?: string | number;
}
export function TextTitle(props: Readonly<ProjectTitleProps>) {
	const { title, children } = props;

	return <h1 className={styles.title}>{children ?? title}</h1>;
}
