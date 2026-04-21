import type React from 'react';
import styles from '@/projects/_helpers/Wrapper.module.css';

interface FigureTitleProps {
	title?: string;
	children?: React.ReactNode;
}

export function FigureTitle(props: Readonly<FigureTitleProps>) {
	const { title, children } = props;
	return <p className={styles.figureTitle}>{children ?? title}</p>;
}
