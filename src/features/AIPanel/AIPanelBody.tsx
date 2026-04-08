'use client';

import { Avatar, Spacer, useLocalStore } from '@apple-pie/slice';
import type React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { useAILayout, useFooterSize, useSettingsOpen } from '@/app/(ai)/store/layout-store';
import { ProfilePic } from '@/src/components/ProfilePic/ProfilePic';
import { ResponseActionBar } from '@/src/components/ResponseActionBar/ResponseActionBar';
import { introMessageMd } from '@/src/content/intro/intro';
import { useStreamSimulator } from '@/src/hooks/streamSimulator/streamSimulator';
import { useActiveResponse } from '@/src/hooks/useActiveResponse/useActiveResonse';
import { MarkdownRenderer } from '@/src/renderers/markdown/MarkdownRenderer';
import styles from './AIPanel.module.css';

export function AIPanelBody() {
	const { responses, active } = useActiveResponse({ onStart: handleScrollToBottom });
	const [showIntro, setShowIntro, hydrated] = useLocalStore('showIntro', true);
	const showSidebar = useAILayout().toggleSideBar;
	const settingsOpen = useSettingsOpen();
	const ref = useRef<HTMLDivElement>(null);
	const { healthy, startStream, source } = useStreamSimulator(introMessageMd, handleMessageEnd);
	const [userName] = useLocalStore('userName', '');
	const timeout = useRef<NodeJS.Timeout | null>(null);
	const footerSize = useFooterSize();

	// trigger the sidebar on the message end
	function handleMessageEnd() {
		setShowIntro(false);
		if (!settingsOpen) showSidebar(true);
	}

	function handleScrollToBottom() {
		// scroll to the bottom of the chat at the end of a stream
		if (timeout.current) clearTimeout(timeout.current);
		timeout.current = setTimeout(() => {
			if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
		}, 100);
	}

	// kick off intro message on mount
	useEffect(() => {
		if (showIntro && hydrated) startStream();
	}, [startStream, showIntro, hydrated]);

	// clean up timers
	useEffect(() => {
		return () => {
			if (timeout.current) clearTimeout(timeout.current);
		};
	}, []);

	const cssVars = useMemo(() => {
		return {
			'--padding-bottom': footerSize ? `${footerSize}px` : '0',
		} as React.CSSProperties;
	}, [footerSize]);

	return (
		<div className={styles.body} ref={ref} style={cssVars}>
			<div className={styles.content}>
				<ProfilePic />
				<Spacer size={8} />
				{hydrated && <MarkdownRenderer content={showIntro ? healthy : source} />}
				{responses.map((response, index) => {
					const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';
					const avatarName = response.role === 'assistant' ? 'V' : userInitial;
					const last = index === responses.length - 1;
					return (
						<div key={`${response.id}_${index}`} className={styles.response}>
							<div className={styles.responseAvatar}>
								<Avatar
									name={avatarName}
									borderWidth={2}
									bgColor={'var(--array-magenta)'}
									borderColor={'var(--array-magenta-label)'}
									textColor={'var(--array-magenta-label)'}
								/>
							</div>
							<MarkdownRenderer content={response.value} />
							<ResponseActionBar response={response} active={active} last={last} />
						</div>
					);
				})}
			</div>
		</div>
	);
}

// <AudioBubble audioStream={processedMicStream.current} playing={micActive && !micMuted} />
