'use client';

import { Avatar, Spacer, useLocalStore } from '@apple-pie/slice';
import { useEffect, useRef } from 'react';
import { useAILayout, useSettingsOpen } from '@/app/(ai)/store/layout-store';
import { ProfilePic } from '@/src/components/ProfilePic/ProfilePic';
import { introMessageMd } from '@/src/content/intro/intro';
import { useStreamSimulator } from '@/src/hooks/streamSimulator/streamSimulator';
import { useActiveResponse } from '@/src/hooks/useActiveResponse/useActiveResonse';
import { MarkdownRenderer } from '@/src/renderers/markdown/MarkdownRenderer';
import type { Role } from '@/src/stores/responses/_types';
import styles from './AIPanel.module.css';

export function AIPanelBody() {
	const combined = useActiveResponse(handleStreamEnd);
	const [showIntro, setShowIntro, hydrated] = useLocalStore('showIntro', true);
	const showSidebar = useAILayout().toggleSideBar;
	const settingsOpen = useSettingsOpen();
	const ref = useRef<HTMLDivElement>(null);
	const lastMessageRole = useRef<Role | undefined>(undefined);
	const { healthy, startStream, source } = useStreamSimulator(introMessageMd, handleMessageEnd);

	// trigger the sidebar on the message end
	function handleMessageEnd() {
		setShowIntro(false);
		if (!settingsOpen) showSidebar(true);
	}

	function handleStreamEnd() {
		// scroll to bottom of the chat at the end of a stream
		if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
	}

	// kick off intro message on mount
	useEffect(() => {
		if (showIntro && hydrated) startStream();
	}, [startStream, showIntro, hydrated]);

	return (
		<div className={styles.body} ref={ref}>
			<div className={styles.content}>
				<ProfilePic />
				<Spacer size={8} />
				{hydrated && <MarkdownRenderer content={showIntro ? healthy : source} />}
				{combined.map((response, index) => {
					const showAvatar = index === 0 || lastMessageRole.current !== response.role;
					const avatarName = response.role === 'assistant' ? 'V' : 'U';
					lastMessageRole.current = response.role;
					return (
						<div key={`${response.id}_${index}`} className={styles.response}>
							{showAvatar && (
								<div className={styles.responseAvatar}>
									<Avatar
										name={avatarName}
										borderWidth={2}
										bgColor={'var(--array-magenta)'}
										borderColor={'var(--array-magenta-label)'}
										textColor={'var(--array-magenta-label)'}
									/>
								</div>
							)}
							<MarkdownRenderer content={response.value} />
							{response.disconnected && (
								<span className={'feedback-attention'}>(disconnected)</span>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

// <AudioBubble audioStream={processedMicStream.current} playing={micActive && !micMuted} />
