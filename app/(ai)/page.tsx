import { getAllProjectTiles } from '@/projects/server';
import Home from '@/src/landing/home';

/**
 * Server side page - pre-load projects data, etc.
 */
export default function Page() {
	const projects = getAllProjectTiles();
	return <Home projects={projects} />;
}
