import { getAllProjectTiles } from '@/projects/server';
import Home from '@/src/landing/home';
import { SidebarSurface } from '@/stores/sidebar/_types';

/**
 * Server side page - pre-load projects data, etc.
 */

export default async function Page() {
	const projects = getAllProjectTiles();
	return <Home projects={projects} surface={SidebarSurface.Contact} />;
}
