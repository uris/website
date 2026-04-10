export interface SidebarStore {
	surface: SidebarSurface;
	project: Project | null;
	actions: {
		setSurface: (surface: SidebarSurface) => void;
		setProject: (project: Project | null) => void;
	};
}

export enum SidebarSurface {
	Projects = 'project list',
	Contact = 'contact',
	Profile = 'profile',
}

export enum Project {
	Slice = 'slice',
}
