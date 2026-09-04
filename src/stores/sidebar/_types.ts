import type { ProjectSlug } from '@/projects/_types/types';

export interface SidebarStore {
	surface: SidebarSurface;
	project: Project | null;
	showProject: boolean;
	direction: Direction;
	showCloseProject: boolean;
	actions: {
		setSurface: (surface: SidebarSurface) => void;
		setProject: (project: Project | null) => void;
		closeProject: () => void;
		setShowProject: (showProject: boolean) => void;
		setShowCloseProject: (showCloseProject: boolean) => void;
	};
}

export enum SidebarSurface {
	Projects = 0,
	Skills = 1,
	Contact = 2,
}

export type Project = ProjectSlug;

export enum Direction {
	Forward = 1,
	Backward = -1,
}
