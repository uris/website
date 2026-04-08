import { create } from 'zustand';
import type { AILayoutStore } from './_types';

const useAILayoutStore = create<AILayoutStore>((set, get) => ({
	sidebarOpen: false,
	settingsOpen: false,
	textInputBar: false,
	footerSize: undefined,
	actions: {
		toggleSideBar: (open) => {
			const sidebarOpen = open === undefined ? !get().sidebarOpen : open;
			const settingsOpen = sidebarOpen ? false : get().settingsOpen;
			set({ sidebarOpen, settingsOpen });
		},
		toggleSettings: (open) => {
			const settingsOpen = open === undefined ? !get().settingsOpen : open;
			const sidebarOpen = settingsOpen ? false : get().sidebarOpen;
			set({ settingsOpen, sidebarOpen });
		},
		toggleInputBar: (open) => {
			const current = get().textInputBar;
			const newValue = open === undefined ? !current : open;
			set({ textInputBar: newValue });
		},
		setFooterSize: (size) => {
			set({ footerSize: size });
		},
	},
}));

// prefer atomic selectors
export const useAILayout = () => useAILayoutStore((state) => state.actions);
export const useSidebarOpen = () => useAILayoutStore((state) => state.sidebarOpen);
export const useSettingsOpen = () => useAILayoutStore((state) => state.settingsOpen);
export const useTextInputBar = () => useAILayoutStore((state) => state.textInputBar);
export const useFooterSize = () => useAILayoutStore((state) => state.footerSize);
