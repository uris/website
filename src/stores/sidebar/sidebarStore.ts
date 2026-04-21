import { create } from 'zustand';
import { Direction, type Project, type SidebarStore, SidebarSurface } from '@/src/stores/sidebar/_types';

export const useSidebarContentStore = create<SidebarStore>((set, get) => ({
	surface: SidebarSurface.Projects,
	direction: Direction.Forward,
	project: null,
	showProject: false,
	actions: {
		setSurface: (surface: SidebarSurface) => {
			if (surface === get().surface) return;
			const direction = surface > get().surface ? Direction.Forward : Direction.Backward;
			set({ surface, direction });
		},
		setProject: (project: Project | null) => {
			if (project === get().project) return;
			set({ project });
		},
		closeProject: () => {
			set({ project: null });
		},
		setShowProject: (showProject: boolean) => {
			set({ showProject });
		},
	},
}));

export const useSidebarActions = () => useSidebarContentStore((state) => state.actions);
export const useSurface = () => useSidebarContentStore((state) => state.surface);
export const useProject = () => useSidebarContentStore((state) => state.project);
export const useDirection = () => useSidebarContentStore((state) => state.direction);
export const useShowProject = () => useSidebarContentStore((state) => state.showProject);
