'use client';

import { FlexDiv, Preset } from '@apple-pie/slice';
import { type PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { FrameEvent } from '@/components/ProjectFrame/ProjectFrame';

// render project details inside a container with its height set to the observed iFrame height
export function ProjectDetailsContainer({ children }: Readonly<PropsWithChildren>) {
	const [height, setHeight] = useState<string | number>('100vh');

	// handler for messages received from parent window
	const handleParentMessage = useCallback((event: MessageEvent) => {
		if (event.origin !== window.location.origin) return; // ignore messages from other origins
		if (!event.data?.event || event.data.event === FrameEvent.CHILD_EVENT) return; // ignore non-events or child events
		if (event.data.height !== undefined) {
			const nextHeight = event.data.height;
			setHeight(nextHeight === 0 ? '100vh' : nextHeight);
		}
	}, []);

	// listen for event data to update size height
	useEffect(() => {
		window.addEventListener('message', handleParentMessage);
		return () => window.removeEventListener('message', handleParentMessage);
	}, [handleParentMessage]);

	return (
		<FlexDiv preset={Preset.Window} height={height} justify="center" align="center">
			{children}
		</FlexDiv>
	);
}
