import type React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import { EndMarker } from '@/src/components/EndMarker/EndMarker';
import { MarkdownLink } from '@/src/components/MarkdownLink/MarkdownLink';
import { MarkdownSelect } from '@/src/components/MarkdownSelect/MarkdownSelect';
import { remarkEndMarker } from '@/src/renderers/plugins/remarkEndMarker';
import { remarkSelectList } from '@/src/renderers/plugins/remarkSelectList';

// extend the default markdown component type with custom components definitions
interface ExtendedComponents extends Components {
	customSelect?: React.ComponentType<{ options?: unknown }>;
	endMarker?: React.ComponentType;
}

// create a new component set that contains the new component renders
const extendedComponents: ExtendedComponents = {
	customSelect: ({ options }: { options?: unknown }) => <MarkdownSelect options={options} />,
	endMarker: () => <EndMarker />,
	a: ({ ...props }) => <MarkdownLink options={props} />,
};

// create interface with raw md string and extended component set
interface MarkdownRendererProps {
	content?: string | null;
	components?: ExtendedComponents;
}

// create the core renderer
export function MarkdownRenderer(props: Readonly<MarkdownRendererProps>) {
	const { content, components = extendedComponents } = props;
	// if no content, return null
	if (!content) return null;

	// return JSX
	return (
		<ReactMarkdown remarkPlugins={[remarkSelectList, remarkEndMarker]} components={components}>
			{content}
		</ReactMarkdown>
	);
}
