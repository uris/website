'use client';

import { Spacer } from '@apple-pie/slice';
import { useEffect } from 'react';
import { useAILayout, useSettingsOpen } from '@/app/(ai)/store/layout-store';
import { ProfilePic } from '@/src/components/ProfilePic/ProfilePic';
import { introMessageMd } from '@/src/content/intro/intro';
import { useStreamSimulator } from '@/src/hooks/streamSimulator/streamSimulator';
import { MarkdownRenderer } from '@/src/renderers/markdown/MarkdownRenderer';
import styles from './AIPanel.module.css';

export function AIPanelBody() {
	const showSidebar = useAILayout().toggleSideBar;
	const settingsOpen = useSettingsOpen();
	// set up the initial message as simulated
	const { healthy, startStream } = useStreamSimulator(introMessageMd, handleMessageEnd);

	// trigger the sidebar on the message end
	function handleMessageEnd() {
		console.log('message end', settingsOpen);
		if (!settingsOpen) showSidebar(true);
	}

	// kick off the first on-screen message
	useEffect(() => startStream(), [startStream]);

	return (
		<div className={styles.body}>
			<div className={styles.content}>
				<ProfilePic />
				<Spacer size={8} />
				<MarkdownRenderer content={healthy} />
			</div>
		</div>
	);
}

// <AudioBubble audioStream={processedMicStream.current} playing={micActive && !micMuted} />
