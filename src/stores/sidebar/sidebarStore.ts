import { create } from 'zustand';
import { type Project, type SidebarStore, SidebarSurface } from '@/src/stores/sidebar/_types';

export const useSidebarContentStore = create<SidebarStore>((set, get) => ({
	surface: SidebarSurface.Projects,
	project: null,
	actions: {
		setSurface: (surface: SidebarSurface) => {
			if (surface === get().surface) return;
			set({ surface, project: null });
		},
		setProject: (project: Project | null) => {
			if (project === get().project) return;
			set({ project });
		},
	},
}));

export const useSidebarActions = () => useSidebarContentStore((state) => state.actions);
export const useSurface = () => useSidebarContentStore((state) => state.surface);
export const useProject = () => useSidebarContentStore((state) => state.project);
