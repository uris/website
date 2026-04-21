import React, { useMemo } from 'react';
import Highlight from 'react-highlight';

interface CodeSnippetProps {
	children?: React.ReactNode;
	snippet?: string;
	language?: 'typescript' | 'javascript' | 'css' | 'html' | 'json';
}

export function CodeSnippet(props: Readonly<CodeSnippetProps>) {
	const { children, snippet = '', language = 'typescript' } = props;

	const childrenText = useMemo(() => {
		if (!children) return undefined;
		return React.Children.toArray(children)
			.map((child) => {
				if (typeof child === 'string') return child;
				return '';
			})
			.join('');
	}, [children]);

	return <Highlight className={language}>{childrenText ?? snippet}</Highlight>;
}
