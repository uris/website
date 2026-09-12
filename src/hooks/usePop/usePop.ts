import { useCallback, useEffect } from 'react';
import { isProjectSlug, type ProjectSlug } from '@/projects/_registry/slugs';
import { useSidebarActions } from '@/stores/sidebar/sidebarStore';

export function usePop() {
	const sidebar = useSidebarActions();

	// parse url and return parts shape
	const parseHistory = useCallback(
		(pathname: string) => {
			const [surfaceSegment, slugSegment] = pathname.split('/').filter(Boolean);
			return {
				surface: sidebar.resolveParamToSurface(surfaceSegment),
				slug: isProjectSlug(slugSegment ?? '') ? (slugSegment as ProjectSlug) : undefined,
			};
		},
		[sidebar],
	);

	// update state based on url parts
	const sync = useCallback(() => {
		const { surface, slug } = parseHistory(window.location.pathname);
		sidebar.setSurface(surface);
		sidebar.setProject(slug ?? null);
		sidebar.setShowProject(!!slug);
	}, [sidebar, parseHistory]);

	useEffect(() => {
		sync(); // initial load
		window.addEventListener('popstate', sync);
		return () => window.removeEventListener('popstate', sync);
	}, [sync]);
}
