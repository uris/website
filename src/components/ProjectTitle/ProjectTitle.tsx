import type React from 'react';
import styles from './ProjectTitle.module.css';

interface ProjectTitleProps {
	title?: string;
	children?: React.ReactNode;
}
export function ProjectTitle(props: Readonly<ProjectTitleProps>) {
	const { title, children } = props;
	return <h1 className={styles.title}>{children ?? title}</h1>;
}
