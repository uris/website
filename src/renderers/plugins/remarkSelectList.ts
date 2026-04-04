import type { PhrasingContent, Root, Text } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

// custom select type => name must mach custom component key name
type CustomSelectNode = {
	type: 'customSelect';
	data: {
		hName: 'customSelect';
		hProperties: {
			options: string;
		};
	};
};

// text node from string value
function createTextNode(value: string): Text {
	return {
		type: 'text',
		value,
	};
}

// create a custom select node with options
function createSelectNode(options: string[]): CustomSelectNode {
	return {
		type: 'customSelect',
		data: {
			hName: 'customSelect', // <-- must match custom component key name
			hProperties: {
				options: JSON.stringify(options),
			},
		},
	};
}

// check if next character is valid for continuing select
function shouldContinueSelect(nextChar?: string) {
	if (!nextChar) return false;
	return !/[\s.,!?;:)\]}]/.test(nextChar);
}

// main parse logic
function parseInlineSelectNodes(value: string): PhrasingContent[] {
	const nextChildren: PhrasingContent[] = [];
	let index = 0;

	while (index < value.length) {
		const start = value.indexOf('$$', index);

		if (start === -1) {
			nextChildren.push(createTextNode(value.slice(index)));
			break;
		}

		if (start > index) {
			nextChildren.push(createTextNode(value.slice(index, start)));
		}

		const options: string[] = [];
		let cursor = start + 2;
		let validGroup = false;

		while (cursor < value.length) {
			const end = value.indexOf('$$', cursor);
			if (end === -1) break;

			const option = value.slice(cursor, end).trim();
			if (!option) break;

			options.push(option);
			validGroup = true;

			const nextChar = value[end + 2];
			if (!shouldContinueSelect(nextChar)) {
				nextChildren.push(createSelectNode(options) as never);
				index = end + 2;
				break;
			}

			cursor = end + 2;
		}

		if (validGroup && index > start) {
			continue;
		}

		nextChildren.push(createTextNode(value.slice(start, start + 2)));
		index = start + 2;
	}

	return nextChildren.length > 0 ? nextChildren : [createTextNode(value)];
}

/**
 * Plugin to convert inline `$$option$$option$$...$$` sequences into a custom select node.
 */
export const remarkSelectList: Plugin<[], Root> = () => {
	return (tree: Root) => {
		visit(tree, 'paragraph', (node) => {
			const nextChildren: PhrasingContent[] = [];

			for (const child of node.children) {
				if (child.type !== 'text') {
					nextChildren.push(child);
					continue;
				}

				nextChildren.push(...parseInlineSelectNodes(child.value));
			}

			node.children = nextChildren;
		});
	};
};
