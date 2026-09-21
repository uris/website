'use client';

import { useEffect, useRef } from 'react';
import { isProjectSlug } from '@/projects/_registry/slugs';
import { SidebarSurface } from '@/stores/sidebar/_types';
import { useProject, useShowProject, useSurface } from '@/stores/sidebar/sidebarStore';
import { AppEvent } from './events';
import { useAppEvent } from './useAppEvent';

type ProjectViewTrackerProps = {
	projectSlug?: string | null;
	presentation: 'workspace' | 'standalone';
};

export function ProjectViewTracker({ projectSlug, presentation }: Readonly<ProjectViewTrackerProps>) {
	const { postAppEvent } = useAppEvent();
	const lastProject = useRef<string | null>(null);

	useEffect(() => {
		// don't process standalone project outside the project iframe.
		if (window.self !== window.top) return;

		// need valid project info to log
		if (!projectSlug || !isProjectSlug(projectSlug)) {
			lastProject.current = null;
			return;
		}

		// ignore rerenders and strict mode effect replay, but allow returning after leaving a project.
		if (lastProject.current === projectSlug) return;
		lastProject.current = projectSlug;

		// post the event
		postAppEvent(AppEvent.ViewedProject, { project_slug: projectSlug, presentation });
	}, [projectSlug, presentation, postAppEvent]);

	return null;
}

export function WorkspaceProjectViewTracker() {
	const project = useProject();
	const showProject = useShowProject();
	const surface = useSurface();
	const visibleProject = surface === SidebarSurface.Projects && showProject ? project : null;

	return <ProjectViewTracker projectSlug={visibleProject} presentation="workspace" />;
}
