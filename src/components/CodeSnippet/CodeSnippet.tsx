import React, { useMemo } from 'react';
import Highlight from 'react-highlight';
import styles from './CodeSnippet.module.css';

interface CodeSnippetProps {
	children?: React.ReactNode;
	snippet?: string;
	language?: 'typescript' | 'javascript' | 'css' | 'html' | 'json';
	margin?: number;
	noMargin?: boolean;
}

export function CodeSnippet(props: Readonly<CodeSnippetProps>) {
	const { children, snippet = '', language = 'typescript', margin = 64, noMargin = false } = props;

	const childrenText = useMemo(() => {
		if (!children) return undefined;
		return React.Children.toArray(children)
			.map((child) => {
				if (typeof child === 'string') return child;
				return '';
			})
			.join('');
	}, [children]);

	const cssVars = useMemo(() => {
		return {
			'--code-margin': noMargin ? '0' : `0 ${margin}px`,
		} as React.CSSProperties;
	}, [margin, noMargin]);

	return (
		<div className={styles.wrapper} style={cssVars}>
			<Highlight className={language}>{childrenText ?? snippet}</Highlight>
		</div>
	);
}
