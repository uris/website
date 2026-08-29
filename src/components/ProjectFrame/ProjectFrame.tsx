'use client';

import { useObserveResize, useTheme } from '@apple-pie/slice';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDraggingSidebar } from '@/stores/home-layout/homeLayoutStore';
import styles from './ProjectFrame.module.css';

export interface ProjectIframeProps {
	projectSlug?: string | null;
	projectName?: string | null;
}

// event types for intra frame communication
export enum FrameEvent {
	INIT = 'INIT',
	STATE_CHANGE = 'STATE_CHANGE',
	CHILD_EVENT = 'CHILD_EVENT',
}

// check for client browser
const hasWindow = globalThis.window !== undefined;

export function ProjectFrame(props: Readonly<ProjectIframeProps>) {
	const { projectSlug, projectName } = props;
	const theme = useTheme().current.name;
	const dragging = useDraggingSidebar();
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const size = useObserveResize(iframeRef, { ignore: 'width' });

	// post state based on tracked theme (add other state items as needed)
	const postState = useCallback(
		(event?: FrameEvent) => {
			if (!hasWindow) return;
			iframeRef.current?.contentWindow?.postMessage(
				{ event: event ?? FrameEvent.STATE_CHANGE, theme: theme, height: size.height },
				globalThis.location.origin,
			);
		},
		[theme, size.height],
	);

	// handle events posted by the child on the parent
	const handleChildEvents = useCallback((event: MessageEvent) => {
		if (event.origin !== globalThis.location.origin) return;
		if (event.data.event === FrameEvent.CHILD_EVENT) {
			// handle event
		}
	}, []);

	// memo dynamic styles
	const cssVars = useMemo(() => {
		return {
			'--pointer-events': dragging ? 'none' : 'auto',
		} as React.CSSProperties;
	}, [dragging]);

	// set listener for child events
	useEffect(() => {
		window.addEventListener('message', handleChildEvents);
		return () => window.removeEventListener('message', handleChildEvents);
	}, [handleChildEvents]);

	// handle frame finished loading
	const handleOnLoad = useCallback(() => {
		postState(FrameEvent.INIT);
		// setShouldReload(false)
	}, [postState]);

	// post state updates automatically
	useEffect(() => postState(), [postState]);

	if (!projectSlug) return null;
	return (
		<iframe
			className={styles.frame}
			title={`Project Summary: ${projectName}`}
			style={cssVars}
			ref={iframeRef}
			src={`/projects/${projectSlug}?theme=${theme}`}
			onLoad={handleOnLoad}
			width="100%"
			height="100%"
		/>
	);
}
