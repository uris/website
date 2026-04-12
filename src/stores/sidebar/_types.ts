export interface SidebarStore {
	surface: SidebarSurface;
	project: Project | null;
	direction: Direction;
	actions: {
		setSurface: (surface: SidebarSurface) => void;
		setProject: (project: Project | null) => void;
		closeProject: () => void;
	};
}

export enum SidebarSurface {
	Projects = 0,
	Skills = 1,
	Contact = 2,
}

export enum Project {
	Slice = 'slice',
}

export enum Direction {
	Forward = 1,
	Backward = -1,
}
