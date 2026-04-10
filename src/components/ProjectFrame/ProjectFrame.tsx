'use client';

import { useCallback, useEffect, useRef } from 'react';

export interface ProjectIframeProps {
	projectSlug: string;
	projectName: string;
	theme: string;
}

export enum FrameEvent {
	INIT = 'INIT',
	STATE_CHANGE = 'STATE_CHANGE',
	CHILD_EVENT = 'CHILD_EVENT',
}

const hasWindow = globalThis.window !== undefined;

export function ProjectIframe(props: Readonly<ProjectIframeProps>) {
	const { projectSlug, projectName, theme } = props;
	const iframeRef = useRef<HTMLIFrameElement>(null);

	// post state based on tracked theme (add other state items as needed)
	const postState = useCallback(
		(event?: FrameEvent) => {
			if (!hasWindow) return;
			iframeRef.current?.contentWindow?.postMessage(
				{ event: event ?? FrameEvent.STATE_CHANGE, theme },
				globalThis.location.origin,
			);
		},
		[theme],
	);

	// handle events posted by the child on the parent
	const handleChildEvents = useCallback((event: MessageEvent) => {
		if (event.origin !== globalThis.location.origin) return;
		if (event.data.event === FrameEvent.CHILD_EVENT) {
			// handle event
		}
	}, []);

	// set listener for child events
	useEffect(() => {
		window.addEventListener('message', handleChildEvents);
		return () => window.removeEventListener('message', handleChildEvents);
	}, [handleChildEvents]);

	// Post state change updates from parent to child
	useEffect(() => postState(), [postState]);

	return (
		<iframe
			ref={iframeRef}
			src={`/projects/${projectSlug}?theme=${theme}`}
			onLoad={() => postState(FrameEvent.INIT)}
			width="100%"
			height="100%"
			style={{ border: 'none' }}
			title={`Project Summary: ${projectName}`}
		/>
	);
}
