export interface SidebarStore {
	surface: SidebarSurface;
	project: Project | null;
	showProject: boolean;
	direction: Direction;
	actions: {
		setSurface: (surface: SidebarSurface) => void;
		setProject: (project: Project | null) => void;
		closeProject: () => void;
		setShowProject: (showProject: boolean) => void;
	};
}

export enum SidebarSurface {
	Projects = 0,
	Skills = 1,
	Contact = 2,
}

export enum Project {
	Slice = 'slice',
	UrisDesign = 'uris-design',
}

export enum Direction {
	Forward = 1,
	Backward = -1,
}
