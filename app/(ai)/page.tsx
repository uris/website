import { getGridProjects } from '@/data/dataOperations';
import Home from '@/src/workspaces/home';

/**
 * Server side page - pre-load projects data, etc.
 */
export default function Page() {
	const projects = getGridProjects();
	return <Home projects={projects} />;
}
