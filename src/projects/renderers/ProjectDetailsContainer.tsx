'use client';

import { FlexDiv, Preset } from '@apple-pie/slice';
import { useBrowserChannelMessage } from '@apple-pie/slice/stores';
import { type PropsWithChildren, useEffect, useState } from 'react';
import type { WorkChannelMessage } from '@/components/ProjectFrame/ProjectFrame';

// render project details inside a container with its height set to the observed iFrame height
export function ProjectDetailsContainer({ children }: Readonly<PropsWithChildren>) {
	const [height, setHeight] = useState<string | number>('100vh');
	const workMessage = useBrowserChannelMessage<WorkChannelMessage>('work');

	// set frame height based on parents' report of the height
	useEffect(() => {
		if (!workMessage?.content) return;
		if (typeof workMessage.content === 'string') return;
		const nextHeight = workMessage.content.height ?? 0;
		setHeight(nextHeight === 0 ? '100vh' : nextHeight);
	}, [workMessage]);

	return (
		<FlexDiv preset={Preset.Window} height={height} justify="center" align="center">
			{children}
		</FlexDiv>
	);
}
