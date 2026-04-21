import 'client-only';
import type { StaticImageData } from 'next/image';
import type { ProjectSlug } from '@/projects/server/types';
import { snippets as sliceSnippets } from '@/projects/slice/code-snippets';
import { images as sliceImages } from '@/projects/slice/images';
import { snippets as urisDesignSnippets } from '@/projects/uris-design/code-snippets';
import { images as urisDesignImages } from '@/projects/uris-design/images';

type ImageValue = string | StaticImageData | undefined;
type SnippetValue = string | undefined;

const imageRegistry: Record<ProjectSlug, Record<string, ImageValue>> = {
	slice: sliceImages,
	'uris-design': urisDesignImages,
};

const snippetRegistry: Record<ProjectSlug, Record<string, SnippetValue>> = {
	slice: sliceSnippets,
	'uris-design': urisDesignSnippets,
};

export function resolveProjectImage(slug: ProjectSlug, name?: string): ImageValue {
	if (!name) return undefined;
	return imageRegistry[slug]?.[name];
}

export function resolveProjectSnippet(slug: ProjectSlug, name?: string): SnippetValue {
	if (!name) return undefined;
	return snippetRegistry[slug]?.[name];
}
