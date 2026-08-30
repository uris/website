import type React from 'react';
import styles from './SubTitle.module.css';

interface SubTitleProps {
	title?: string;
	children?: React.ReactNode;
	margin?: boolean;
}
export function SubTitle(props: Readonly<SubTitleProps>) {
	const { title, children, margin = true } = props;
	return <p className={margin ? styles.margin : styles.nomargin}>{children ?? title}</p>;
}
