'use client';

import { ProgressIndicator, useObserveResize, useTheme } from '@apple-pie/slice';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDraggingSidebar } from '@/stores/home-layout/homeLayoutStore';
import { useSidebarActions } from '@/stores/sidebar/sidebarStore';
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
	const setShowOverlays = useSidebarActions().setShowOverlays;
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const size = useObserveResize(iframeRef, { ignore: 'width' });
	const [isLoading, setIsLoading] = useState(true);

	// callback ref fired when iframe element is attached or removed from dom
	const setIframeRef = useCallback((node: HTMLIFrameElement | null) => {
		iframeRef.current = node;
		if (node) setIsLoading(true);
	}, []);

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
	const handleChildEvents = useCallback(
		(event: MessageEvent) => {
			if (event.origin !== globalThis.location.origin) return;
			if (event.data.event === FrameEvent.CHILD_EVENT) {
				if (event.data.type === 'video-started') {
					setShowOverlays(false);
				}
				if (event.data.type === 'video-ended') {
					setShowOverlays(true);
				}
			}
		},
		[setShowOverlays],
	);

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

	// handle frame finished loading posting the init event and setting loaded to remove spinner
	const handleOnLoad = useCallback(() => {
		postState(FrameEvent.INIT);
		setIsLoading(false);
	}, [postState]);

	// post state updates automatically
	useEffect(() => postState(), [postState]);

	if (!projectSlug) return null;
	const projectUrl = `/projects/${projectSlug}?theme=${theme}`;
	return (
		<div className={styles.frameContainer} aria-busy={isLoading}>
			{isLoading && (
				<div className={styles.loadingOverlay} role="status">
					<ProgressIndicator inline show size={32} stroke={1} />
				</div>
			)}
			<iframe
				key={projectUrl}
				className={styles.frame}
				title={`Project Summary: ${projectName}`}
				style={cssVars}
				ref={setIframeRef}
				src={projectUrl}
				onLoad={handleOnLoad}
				width="100%"
				height="100%"
			/>
		</div>
	);
}
