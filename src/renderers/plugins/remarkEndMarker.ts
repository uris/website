import type { PhrasingContent, Root, Text } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const END_MARKER = '[[END-MARKER]]';

type EndMarkerNode = {
	type: 'endMarker';
	data: {
		hName: 'endMarker';
		hProperties: Record<string, never>;
	};
};

function createTextNode(value: string): Text {
	return {
		type: 'text',
		value,
	};
}

function createEndMarkerNode(): EndMarkerNode {
	return {
		type: 'endMarker',
		data: {
			hName: 'endMarker',
			hProperties: {},
		},
	};
}

/**
 * Plugin to replace inline `[[END-MARKER]]` tokens with a custom inline node.
 */
export const remarkEndMarker: Plugin<[], Root> = () => {
	return (tree: Root) => {
		visit(tree, 'text', (node, index, parent) => {
			if (typeof index !== 'number' || !parent) return;
			if (!node.value.includes(END_MARKER)) return;

			const parts = node.value.split(END_MARKER);
			const replacement: PhrasingContent[] = [];

			for (let i = 0; i < parts.length; i += 1) {
				const part = parts[i];
				if (part) replacement.push(createTextNode(part));
				if (i < parts.length - 1) replacement.push(createEndMarkerNode() as never);
			}

			parent.children.splice(index, 1, ...replacement);
		});
	};
};
