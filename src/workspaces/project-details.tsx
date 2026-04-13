'use client';

import { FlexDiv, Preset } from '@apple-pie/slice';
import { useEffect } from 'react';
import { projectMap } from '@/app/(content)/projects/[slug]/_projectsMap';
import NotFound from '@/projects/_helpers/NotFound';
import { FrameEvent } from '@/src/components/ProjectFrame/ProjectFrame';

export function ProjectDetails({ slug }: Readonly<{ slug: string }>) {
	const Project = projectMap[slug as keyof typeof projectMap];

	// listen for parent window events
	useEffect(() => {
		const handleParentEvents = (event: MessageEvent) => {
			if (event.origin !== globalThis.location.origin) return;
			if (!event.data?.event) return;
			if (event.data.event !== FrameEvent.INIT && event.data.event !== FrameEvent.STATE_CHANGE)
				return;
			// handle events // remove if not used later
		};
		window.addEventListener('message', handleParentEvents);
		return () => window.removeEventListener('message', handleParentEvents);
	}, []);

	// not found
	if (!Project)
		return (
			<FlexDiv preset={Preset.Window} justify="center" align="center">
				<NotFound />
			</FlexDiv>
		);

	return (
		<FlexDiv preset={Preset.Window} justify="center" align="center">
			<Project />
		</FlexDiv>
	);
}
