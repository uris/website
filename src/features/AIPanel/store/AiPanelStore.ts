import { create } from 'zustand';
import type { AIPanelStore } from './_types';

const useAIPanelStore = create<AIPanelStore>((set, get) => ({
	sidebarOpen: true,
	micMuted: false,
	actions: {
		toggleSideBar: () => {
			const state = get().sidebarOpen;
			set({ sidebarOpen: !state });
		},
		toggleMicMute: () => {
			const state = get().micMuted;
			set({ micMuted: !state });
		},
	},
}));

// prefer atomic selectors
export const useAIPanel = () => useAIPanelStore((state) => state.actions);
export const useSidebarOpen = () =>
	useAIPanelStore((state) => state.sidebarOpen);
export const useMicMuted = () => useAIPanelStore((state) => state.micMuted);
