import { ThemeProvider } from '@apple-pie/slice/providers/ThemeProvider';
import { useBrowserChannelsStore } from '@apple-pie/slice/stores';
import { MessageType } from '@apple-pie/slice/utils';
import { afterEach, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { FrameEvent, ProjectFrame } from '@/components/ProjectFrame/ProjectFrame';
import { useHomeLayoutStore } from '@/stores/home-layout/homeLayoutStore';
import { SidebarSurface } from '@/stores/sidebar/_types';
import { useSidebarContentStore } from '@/stores/sidebar/sidebarStore';

const channel = 'work.navigation-test';
function notifyContact() {
	useBrowserChannelsStore.setState({
		messages: {
			[channel]: {
				type: MessageType.Data,
				origin: 'navigation-test.project-frame.test',
				content: { event: FrameEvent.CHILD_EVENT, type: 'navigate-contact' },
			},
		},
	});
}
function frame(slug: string) {
	return (
		<ThemeProvider initialTheme="lightMode" initialSystem={false}>
			<ProjectFrame projectSlug={slug} />
		</ThemeProvider>
	);
}
afterEach(async () => {
	await cleanup();
	useBrowserChannelsStore.setState({ messages: null });
	useHomeLayoutStore.setState(useHomeLayoutStore.getInitialState(), true);
	useSidebarContentStore.setState(useSidebarContentStore.getInitialState(), true);
});

it('does not replay contact navigation when another project opens', async () => {
	useHomeLayoutStore.getState().actions.setWindowId('navigation-test');
	const first = await render(frame('hiring'));
	notifyContact();
	await expect.poll(() => useSidebarContentStore.getState().surface).toBe(SidebarSurface.Contact);
	await first.unmount();

	// Browser Back restores the list, then selecting a project mounts a new frame.
	for (const slug of ['rc-phone', 'hiring']) {
		useSidebarContentStore.getState().actions.setSurface(SidebarSurface.Projects);
		const next = await render(frame(slug));
		expect(useSidebarContentStore.getState().surface).toBe(SidebarSurface.Projects);
		// Fresh notifications still work after the retained message was ignored.
		notifyContact();
		await expect.poll(() => useSidebarContentStore.getState().surface).toBe(SidebarSurface.Contact);
		await next.unmount();
	}
});
