import { StrictMode } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { ProjectViewTracker, WorkspaceProjectViewTracker } from '@/src/analytics/ProjectViewTracker';
import { SidebarSurface } from '@/stores/sidebar/_types';
import { useSidebarContentStore } from '@/stores/sidebar/sidebarStore';

const { capture } = vi.hoisted(() => ({ capture: vi.fn() }));
vi.mock('@/src/analytics/useAppEvent', () => ({
	useAppEvent: () => ({ postAppEvent: capture }),
}));

afterEach(async () => {
	await cleanup();
	useSidebarContentStore.setState(useSidebarContentStore.getInitialState(), true);
});

it('counts each project visit once, including returns, without counting effect replays or rerenders', async () => {
	vi.spyOn(window, 'self', 'get').mockReturnValue(window.top as typeof window.self);
	const view = (slug: string | null) => (
		<StrictMode>
			<ProjectViewTracker projectSlug={slug} presentation="standalone" />
		</StrictMode>
	);
	const screen = await render(view('uris-design'));
	expect(capture).toHaveBeenCalledTimes(1);
	expect(capture).toHaveBeenLastCalledWith('viewed_project', {
		project_slug: 'uris-design',
		presentation: 'standalone',
	});
	await screen.rerender(view('uris-design'));
	expect(capture).toHaveBeenCalledTimes(1);
	await screen.rerender(view('rc-phone'));
	expect(capture).toHaveBeenCalledTimes(2);
	await screen.rerender(view(null));
	await screen.rerender(view('rc-phone'));
	expect(capture).toHaveBeenCalledTimes(3);
});

it('does not capture embedded project content', async () => {
	// Vitest renders browser tests inside an iframe.
	expect(window.self).not.toBe(window.top);
	await render(<ProjectViewTracker projectSlug="uris-design" presentation="standalone" />);
	expect(capture).not.toHaveBeenCalled();
});

it('tracks workspace visibility rather than retained project selection', async () => {
	vi.spyOn(window, 'self', 'get').mockReturnValue(window.top as typeof window.self);
	useSidebarContentStore.setState({ project: 'uris-design', showProject: false });
	await render(<WorkspaceProjectViewTracker />);
	expect(capture).not.toHaveBeenCalled();
	useSidebarContentStore.setState({ showProject: true });
	await expect.poll(() => capture.mock.calls.length).toBe(1);
	useSidebarContentStore.setState({ surface: SidebarSurface.Skills });
	// Wait for the tracker to observe leaving before returning.
	await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	useSidebarContentStore.setState({ surface: SidebarSurface.Projects });
	await expect.poll(() => capture.mock.calls.length).toBe(2);
	expect(capture).toHaveBeenLastCalledWith('viewed_project', {
		project_slug: 'uris-design',
		presentation: 'workspace',
	});
});
