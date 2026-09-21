'use client';

import { ProgressIndicator, useObserveResize, useTheme } from '@apple-pie/slice';
import { useBrowserChannelActions, useIsActiveChannel, useParentMessage } from '@apple-pie/slice/stores';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDraggingSidebar, useWindowId } from '@/stores/home-layout/homeLayoutStore';
import { SidebarSurface } from '@/stores/sidebar/_types';
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

export type WorkChannelMessage = {
	event: FrameEvent;
	theme?: string;
	height?: number;
	type?: string;
};

export function ProjectFrame(props: Readonly<ProjectIframeProps>) {
	const { projectSlug, projectName } = props;
	const theme = useTheme().current.name;
	const dragging = useDraggingSidebar();
	const setShowOverlays = useSidebarActions().setShowOverlays;
	const setSurface = useSidebarActions().setSurface;
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const size = useObserveResize(iframeRef, { ignore: 'width' });
	const [isLoading, setIsLoading] = useState(true);
	const windowId = useWindowId();
	const channelName = `work.${windowId}`;
	const isWorkActive = useIsActiveChannel(channelName);
	const workMessage = useParentMessage<WorkChannelMessage>(channelName, windowId);
	const currentMessage = useRef(workMessage);
	const post = useBrowserChannelActions().post;

	// memo dynamic styles
	const cssVars = useMemo(() => {
		return {
			'--pointer-events': dragging ? 'none' : 'auto',
		} as React.CSSProperties;
	}, [dragging]);

	// memo state updates for work channel messages
	const stateUpdate = useMemo(
		(): WorkChannelMessage => ({ event: FrameEvent.STATE_CHANGE, theme, height: size.height }),
		[theme, size.height],
	);

	// callback ref fired when iframe element is attached or removed from dom
	const setIframeRef = useCallback((node: HTMLIFrameElement | null) => {
		iframeRef.current = node;
		if (node) setIsLoading(true);
	}, []);

	// handle messages received on the "work" chanel shared with iframe
	useEffect(() => {
		// A retained message belongs to the previous frame; only handle new arrivals.
		if (!workMessage || workMessage === currentMessage.current) return;
		currentMessage.current = workMessage;

		// handle message types
		switch (workMessage?.content?.type) {
			case 'video-started':
				setShowOverlays(false);
				break;
			case 'video-ended':
				setShowOverlays(true);
				break;
			case 'navigate-contact':
				setSurface(SidebarSurface.Contact);
				break;
			case 'project-loaded': {
				const message: WorkChannelMessage = { ...stateUpdate, event: FrameEvent.INIT };
				post(channelName, message);
				break;
			}
		}
	}, [workMessage, setShowOverlays, setSurface, post, stateUpdate, channelName]);

	// post further state updates to child automatically
	useEffect(() => {
		if (isWorkActive) post(channelName, stateUpdate);
	}, [stateUpdate, post, isWorkActive, channelName]);

	if (!projectSlug) return null;
	const projectUrl = `/projects/${projectSlug}?theme=${theme}&windowId=${windowId}`;
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
				onLoad={() => setIsLoading(false)}
				width="100%"
				height="100%"
			/>
		</div>
	);
}
