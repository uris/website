'use client';

import { FlexDiv, Preset } from '@apple-pie/slice';
import { useEffect } from 'react';
import type { ProjectPageData } from '@/projects/_types/types';
import { ProjectPageRenderer } from '@/projects/renderers/ProjectPageRenderer';
import { FrameEvent } from '@/src/components/ProjectFrame/ProjectFrame';

export function ProjectDetails({ project }: Readonly<{ project: ProjectPageData | null }>) {
	// listen for parent window events
	useEffect(() => {
		const handleParentEvents = (event: MessageEvent) => {
			if (event.origin !== globalThis.location.origin) return;
			if (!event.data?.event) return;
			if (event.data.event !== FrameEvent.INIT && event.data.event !== FrameEvent.STATE_CHANGE) return;
			// handle events // remove if not used later
		};
		window.addEventListener('message', handleParentEvents);
		return () => window.removeEventListener('message', handleParentEvents);
	}, []);

	// not found
	if (!project)
		return (
			<FlexDiv preset={Preset.Window} justify="center" align="center">
				<h1>Not Found</h1>
			</FlexDiv>
		);

	return (
		<FlexDiv preset={Preset.Window} justify="center" align="center">
			<ProjectPageRenderer project={project} />
		</FlexDiv>
	);
}
