import projectData from '@/data/projects.json';
import type { ProjectTileProps } from '@/src/components/ProjectTile/_types';

export function getGridProjects(): Partial<ProjectTileProps>[] {
	const projects = projectData;
	const gridProjects = [];
	for (const project of projects) {
		const { title, type, logo, image, titleColor, typeColor, heavy, layout, ..._rest } = project;
		gridProjects.push({ title, type, logo, image, titleColor, typeColor, layout, heavy });
	}
	return gridProjects as ProjectTileProps[];
}
