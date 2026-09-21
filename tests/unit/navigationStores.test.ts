import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useHomeLayoutStore } from '@/stores/home-layout/homeLayoutStore';
import { Direction, SidebarSurface } from '@/stores/sidebar/_types';
import { useSidebarContentStore } from '@/stores/sidebar/sidebarStore';

const home = useHomeLayoutStore.getState().actions;
const sidebar = useSidebarContentStore.getState().actions;
beforeEach(() => {
	useHomeLayoutStore.setState(useHomeLayoutStore.getInitialState(), true);
	useSidebarContentStore.setState(useSidebarContentStore.getInitialState(), true);
});
describe('sidebar navigation', () => {
	it('tracks direction without notifying subscribers for the current surface', () => {
		const listener = vi.fn();
		const unsubscribe = useSidebarContentStore.subscribe(listener);
		try {
			sidebar.setSurface(SidebarSurface.Projects);
			expect(listener).not.toHaveBeenCalled();
			sidebar.setSurface(SidebarSurface.Contact);
			expect(useSidebarContentStore.getState().direction).toBe(Direction.Forward);
			sidebar.setSurface(SidebarSurface.Skills);
			expect(useSidebarContentStore.getState().direction).toBe(Direction.Backward);
		} finally {
			unsubscribe();
		}
	});
	it.each([
		['work', SidebarSurface.Projects],
		['skills', SidebarSurface.Skills],
		['contact', SidebarSurface.Contact],
		['unknown', SidebarSurface.Projects],
		[undefined, SidebarSurface.Projects],
	])('maps %s to a surface', (param, expected) => expect(sidebar.resolveParamToSurface(param)).toBe(expected));
	it.each([
		[SidebarSurface.Projects, 'work'],
		[SidebarSurface.Skills, 'skills'],
		[SidebarSurface.Contact, 'contact'],
		[undefined, 'work'],
	])('maps a surface to %s', (surface, param) => expect(sidebar.resolveSurfaceToParam(surface)).toBe(param));
	it('opens and closes project content and overlays', () => {
		sidebar.setProject('slice');
		sidebar.setShowProject(true);
		sidebar.setShowOverlays(false);
		const current = useSidebarContentStore.getState();
		sidebar.setProject('slice');
		expect(useSidebarContentStore.getState()).toBe(current);
		expect(current).toMatchObject({ project: 'slice', showProject: true, showOverlays: false });
		sidebar.closeProject();
		sidebar.setShowProject(false);
		sidebar.setShowOverlays(true);
		expect(useSidebarContentStore.getState()).toMatchObject({ project: null, showProject: false, showOverlays: true });
	});
});
describe('home panel state', () => {
	it.each([true, false])('restores sidebar=%s when closing settings', (open) => {
		home.toggleSideBar(open);
		home.toggleSettings();
		expect(useHomeLayoutStore.getState()).toMatchObject({ settingsOpen: true, sidebarOpen: false });
		home.toggleSettings();
		expect(useHomeLayoutStore.getState()).toMatchObject({
			settingsOpen: false,
			sidebarOpen: open,
			storedSidebarOpen: null,
		});
	});
	it('treats explicit open/close requests as idempotent', () => {
		home.toggleSettings(false);
		expect(useHomeLayoutStore.getState().sidebarOpen).toBe(true);
		home.toggleSettings(true);
		home.toggleSettings(true);
		home.toggleSettings(false);
		expect(useHomeLayoutStore.getState().sidebarOpen).toBe(true);
	});
	it('opening the sidebar closes settings, and toggles are reversible', () => {
		home.toggleSettings(true);
		home.toggleSideBar(true);
		home.toggleSideBar();
		expect(useHomeLayoutStore.getState()).toMatchObject({ sidebarOpen: false, settingsOpen: false });
		home.toggleSideBar();
		home.toggleInputBar();
		expect(useHomeLayoutStore.getState()).toMatchObject({ sidebarOpen: true, textInputBar: true });
		home.toggleInputBar(false);
		expect(useHomeLayoutStore.getState().textInputBar).toBe(false);
	});
	it('updates layout preferences and can request history safely during server rendering', () => {
		home.setFooterSize(50);
		home.setDidAnimateProjects(true);
		home.setDraggingSidebar(true);
		home.setShowTalkToViLabel(true);
		home.setWindowId('window');
		home.setProjects([]);
		home.pushHistory();
		expect(useHomeLayoutStore.getState()).toMatchObject({
			footerSize: 50,
			didAnimateProjects: true,
			draggingSidebar: true,
			showTalkToViLabel: true,
			windowId: 'window',
			projects: [],
		});
	});
});
