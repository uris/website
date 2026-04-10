import { create } from 'zustand';
import type { AILayoutStore } from './_types';

// check the local store exists before server side rendering
const hasLocalStore = typeof localStorage !== 'undefined';

export const useAILayoutStore = create<AILayoutStore>((set, get) => ({
	sidebarOpen: false,
	storedSidebarOpen: null,
	settingsOpen: false,
	textInputBar: false,
	footerSize: undefined,
	didAnimateProjects: false,
	userName: hasLocalStore ? localStorage.getItem('userName') : null,
	showTalkToViLabel: true,
	actions: {
		toggleSideBar: (open) => {
			const sidebarOpen = open === undefined ? !get().sidebarOpen : open;
			const settingsOpen = sidebarOpen ? false : get().settingsOpen;
			set({ sidebarOpen, settingsOpen });
		},
		toggleSettings: (open) => {
			const settingsOpen = open === undefined ? !get().settingsOpen : open;
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
			const newValue = open === undefined ? !current : open;
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
	},
}));

// prefer atomic selectors
export const useAILayout = () => useAILayoutStore((state) => state.actions);
export const useSidebarOpen = () => useAILayoutStore((state) => state.sidebarOpen);
export const useSettingsOpen = () => useAILayoutStore((state) => state.settingsOpen);
export const useTextInputBar = () => useAILayoutStore((state) => state.textInputBar);
export const useUserName = () => useAILayoutStore((state) => state.userName);
export const useFooterSize = () => useAILayoutStore((state) => state.footerSize);
export const useDidAnimateProjects = () => useAILayoutStore((state) => state.didAnimateProjects);
export const useShowTalkToViLabel = () => useAILayoutStore((state) => state.showTalkToViLabel);
