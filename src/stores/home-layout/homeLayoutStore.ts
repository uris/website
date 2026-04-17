import { create } from 'zustand';
import type { ProjectTileData } from '@/projects/server/types';
import type { HomeLayoutStore } from './_types';

// check the local store exists before server side rendering
const hasLocalStore = typeof localStorage !== 'undefined';

export const useHomeLayoutStore = create<HomeLayoutStore>((set, get) => ({
	sidebarOpen: true,
	storedSidebarOpen: null,
	settingsOpen: false,
	textInputBar: false,
	footerSize: undefined,
	didAnimateProjects: false,
	userName: hasLocalStore ? localStorage.getItem('userName') : null,
	showTalkToViLabel: false,
	projects: [],
	draggingSidebar: false,
	actions: {
		toggleSideBar: (open) => {
			const sidebarOpen = open ?? !get().sidebarOpen;
			const settingsOpen = sidebarOpen ? false : get().settingsOpen;
			set({ sidebarOpen, settingsOpen });
		},
		toggleSettings: (open) => {
			const settingsOpen = open ?? !get().settingsOpen;
			// if opening settings, store the sidebar value
			if (settingsOpen) {
				const storedSidebarOpen = get().sidebarOpen ? true : null;
				set({ sidebarOpen: false, settingsOpen: true, storedSidebarOpen });
			} else {
				const sidebarOpen = get().storedSidebarOpen ?? false;
				set({ sidebarOpen, settingsOpen: false, storedSidebarOpen: null });
			}
		},
		toggleInputBar: (open) => {
			const current = get().textInputBar;
			const newValue = open ?? !current;
			set({ textInputBar: newValue });
		},
		setFooterSize: (size) => {
			set({ footerSize: size });
		},
		setUserName: (userName: string) => {
			set({ userName });
			localStorage.setItem('userName', userName);
		},
		setShowTalkToViLabel: (showTalkToViLabel: boolean) => {
			set({ showTalkToViLabel });
		},
		setDidAnimateProjects: (didAnimateProjects: boolean) => {
			set({ didAnimateProjects });
		},
		setProjects: (projects: ProjectTileData[]) => {
			set({ projects });
		},
		setDraggingSidebar: (draggingSidebar: boolean) => {
			set({ draggingSidebar });
		},
	},
}));

// prefer atomic selectors
export const useHomeLayout = () => useHomeLayoutStore((state) => state.actions);
export const useSidebarOpen = () => useHomeLayoutStore((state) => state.sidebarOpen);
export const useSettingsOpen = () => useHomeLayoutStore((state) => state.settingsOpen);
export const useTextInputBar = () => useHomeLayoutStore((state) => state.textInputBar);
export const useUserName = () => useHomeLayoutStore((state) => state.userName);
export const useFooterSize = () => useHomeLayoutStore((state) => state.footerSize);
export const useDidAnimateProjects = () => useHomeLayoutStore((state) => state.didAnimateProjects);
export const useShowTalkToViLabel = () => useHomeLayoutStore((state) => state.showTalkToViLabel);
export const useProjects = () => useHomeLayoutStore((state) => state.projects);
export const useDraggingSidebar = () => useHomeLayoutStore((state) => state.draggingSidebar);
