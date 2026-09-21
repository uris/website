import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { cleanup, render } from 'vitest-browser-react';
import * as home from '@/stores/home-layout/homeLayoutStore';
import { ResponseType } from '@/stores/responses/_types';
import * as responses from '@/stores/responses/responsesStore';
import { SidebarSurface } from '@/stores/sidebar/_types';
import * as sidebar from '@/stores/sidebar/sidebarStore';

const originalUrl = location.href;
let storedName: string | null;
beforeEach(() => {
	storedName = localStorage.getItem('userName');
	home.useHomeLayoutStore.setState(home.useHomeLayoutStore.getInitialState(), true);
	sidebar.useSidebarContentStore.setState(sidebar.useSidebarContentStore.getInitialState(), true);
	responses.useViResponsesStore.setState(responses.useViResponsesStore.getInitialState(), true);
});
afterEach(async () => {
	await cleanup();
	history.replaceState(null, '', originalUrl);
	if (storedName === null) localStorage.removeItem('userName');
	else localStorage.setItem('userName', storedName);
	home.useHomeLayoutStore.setState(home.useHomeLayoutStore.getInitialState(), true);
	sidebar.useSidebarContentStore.setState(sidebar.useSidebarContentStore.getInitialState(), true);
	responses.useViResponsesStore.setState(responses.useViResponsesStore.getInitialState(), true);
});
function NavigationProbe() {
	const actions = home.useHomeLayout();
	const side = sidebar.useSidebarActions();
	const state = {
		sidebar: home.useSidebarOpen(),
		settings: home.useSettingsOpen(),
		input: home.useTextInputBar(),
		name: home.useUserName(),
		footer: home.useFooterSize(),
		animated: home.useDidAnimateProjects(),
		label: home.useShowTalkToViLabel(),
		projects: home.useProjects().length,
		dragging: home.useDraggingSidebar(),
		window: home.useWindowId(),
		surface: sidebar.useSurface(),
		project: sidebar.useProject(),
		direction: sidebar.useDirection(),
		showProject: sidebar.useShowProject(),
		overlays: sidebar.useShowOverlays(),
	};
	return (
		<>
			<output aria-label="Navigation state">{JSON.stringify(state)}</output>
			<button type="button" onClick={() => actions.toggleSettings()}>
				Settings
			</button>
			<button type="button" onClick={() => actions.setUserName('Ada')}>
				Save name
			</button>
			<button
				type="button"
				onClick={() => {
					side.setSurface(SidebarSurface.Contact);
					actions.pushHistory({ sidebar: SidebarSurface.Contact });
				}}
			>
				Contact
			</button>
		</>
	);
}
function ResponseProbe() {
	const actions = responses.useViResponsesActions();
	const state = {
		history: responses.useViResponses().length,
		last: responses.useViLastResponse()?.value,
		active: responses.useViActive(),
		buffering: responses.useViBufferStreaming(),
		scroll: responses.useAutoScrollStream(),
	};
	return (
		<>
			<output aria-label="Response state">{JSON.stringify(state)}</output>
			<button
				type="button"
				onClick={() => {
					actions.handleResponseStart('answer', ResponseType.Text);
					actions.handleResponseDelta('answer', 'Hello');
					actions.setBufferStreaming(true);
					actions.setAutoScrollStream(false);
				}}
			>
				Receive answer
			</button>
			<button type="button" onClick={() => actions.handleResponseEnd('answer')}>
				Finish
			</button>
		</>
	);
}
describe('browser-backed navigation state', () => {
	it('updates subscribed panels and persists a user name', async () => {
		await render(<NavigationProbe />);
		await page.getByRole('button', { name: 'Settings' }).click();
		await expect
			.element(page.getByRole('status', { name: 'Navigation state' }))
			.toHaveTextContent('"sidebar":false,"settings":true');
		await page.getByRole('button', { name: 'Settings' }).click();
		await expect
			.element(page.getByRole('status', { name: 'Navigation state' }))
			.toHaveTextContent('"sidebar":true,"settings":false');
		await page.getByRole('button', { name: 'Save name' }).click();
		expect(localStorage.getItem('userName')).toBe('Ada');
		await expect.element(page.getByRole('status', { name: 'Navigation state' })).toHaveTextContent('"name":"Ada"');
		await page.getByRole('button', { name: 'Contact', exact: true }).click();
		expect(location.pathname).toBe('/contact');
	});
	it.each([
		[{ sidebar: SidebarSurface.Skills }, '/skills'],
		[{ sidebar: SidebarSurface.Contact, slug: 'slice' }, '/work/slice'],
		[{ sidebar: SidebarSurface.Contact, slug: '../../bad' }, '/contact'],
		[undefined, '/work'],
	])('writes only recognized route segments to browser history', (options, pathname) => {
		home.useHomeLayoutStore.getState().actions.pushHistory(options);
		expect(location.pathname).toBe(pathname);
	});
	it('reactively displays incoming responses and completion state', async () => {
		await render(<ResponseProbe />);
		await expect.element(page.getByRole('status', { name: 'Response state' })).toHaveTextContent('"active":false');
		await page.getByRole('button', { name: 'Receive answer' }).click();
		await expect
			.element(page.getByRole('status', { name: 'Response state' }))
			.toHaveTextContent('"last":"Hello","active":true,"buffering":true,"scroll":false');
		await page.getByRole('button', { name: 'Finish', exact: true }).click();
		await expect.element(page.getByRole('status', { name: 'Response state' })).toHaveTextContent('"active":false');
	});
});
