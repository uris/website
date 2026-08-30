import type React from 'react';
import styles from './TextParagraph.module.css';

interface ProjectTitleProps {
	text?: string;
	children?: React.ReactNode;
}
export function TextParagraph(props: Readonly<ProjectTitleProps>) {
	const { text, children } = props;
	return <div className={styles.textParagraph}>{children ?? text}</div>;
}
