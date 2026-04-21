import { addMic, granularExports } from './code-content';

export const snippets = {
	addMic,
	granularExports,
} as const;

export type SliceSnippetName = keyof typeof snippets;
