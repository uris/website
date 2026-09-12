import { ToastType } from '@apple-pie/slice';
import type { Toast } from '@apple-pie/slice/stores';
import { isProjectSlug, type ProjectSlug } from '@/projects/_registry/slugs';
import { getAllProjectTiles } from '@/projects/server';
import Home from '@/src/landing/home';
import { SidebarSurface } from '@/stores/sidebar/_types';

/**
 * Server side page - pre-load projects data, etc.
 */
interface PageProps {
	params: Promise<{ slug: string }>;
}

// default message for no project
const slugNotValid = (slug: string): Toast => {
	return {
		message: `No project matches "${slug}"`,
		position: 'top',
		type: ToastType.Warning,
	};
};

export default async function Page(props: Readonly<PageProps>) {
	const { params } = props;
	const { slug } = await params;
	const projects = getAllProjectTiles();
	const project = isProjectSlug(slug) ? (slug as ProjectSlug) : undefined;
	const message = !project ? slugNotValid(slug) : undefined;
	return <Home projects={projects} project={project} surface={SidebarSurface.Projects} message={message} />;
}
