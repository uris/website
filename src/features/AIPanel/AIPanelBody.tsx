'use client';

import { Spacer, useLocalStore } from '@apple-pie/slice';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAILayout, useFooterSize, useSettingsOpen } from '@/app/(ai)/store/layout-store';
import { MessagesThread } from '@/features/AIPanel/MessagesThread';
import { ProfilePic } from '@/src/components/ProfilePic/ProfilePic';
import { introMessageMd } from '@/src/content/intro/intro';
import { useStreamSimulator } from '@/src/hooks/streamSimulator/streamSimulator';
import { MarkdownRenderer } from '@/src/renderers/markdown/MarkdownRenderer';
import { useAutoScrollStream, useViBufferStreaming } from '@/src/stores/responses/responsesStore';
import styles from './AIPanel.module.css';

export function AIPanelBody() {
	const [showIntro, setShowIntro, hydrated] = useLocalStore('showIntro', true);
	const showSidebar = useAILayout().toggleSideBar;
	const settingsOpen = useSettingsOpen();
	const ref = useRef<HTMLDivElement>(null);
	const { healthy, startStream, source } = useStreamSimulator(introMessageMd, handleIntroEnd);
	const timeout = useRef<NodeJS.Timeout | null>(null);
	const footerSize = useFooterSize();
	const autoScroll = useAutoScrollStream();
	const streaming = useViBufferStreaming();
	const lastScrollTop = useRef<number | undefined>(undefined);
	const pauseAutoScroll = useRef<boolean>(false);

	// trigger the sidebar on the message end
	function handleIntroEnd() {
		setShowIntro(false);
		if (!settingsOpen) showSidebar(true);
	}

	// scroll to the bottom at stream start, reset auto stream
	function handleStreamStart() {
		if (timeout.current) clearTimeout(timeout.current);
		pauseAutoScroll.current = false;
		timeout.current = setTimeout(() => {
			if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
		}, 100);
	}

	// auto scroll to bottom while streaming
	function handleStreamAppend() {
		if (autoScroll && !pauseAutoScroll.current && ref.current) {
			if (timeout.current) clearTimeout(timeout.current);
			if (ref.current.scrollTop === ref.current.scrollHeight) return;
			ref.current.scrollTop = ref.current.scrollHeight;
		}
	}

	// set pause auto scroll when scrolling up
	const handleBodyScroll = useCallback(
		(e: Event) => {
			// get current scroll / container values
			const currentEl = e.currentTarget as HTMLDivElement;
			const height = currentEl.offsetHeight;
			const scrollHeight = currentEl.scrollHeight;
			const next = currentEl.scrollTop;
			const prev = lastScrollTop.current;

			// update tracked last scroll position
			lastScrollTop.current = next;
			
			// if no values return
			if (!prev || !next) return;

			// derive values to set pause in auto scroll
			const isAtBottom = next + height >= scrollHeight - 24; // a little padding
			const scrolledUp = prev && next < prev;

			// if at bottom reset pause, if scroll up pause auto scroll
			if (streaming && scrolledUp) pauseAutoScroll.current = true;
			else if (isAtBottom) pauseAutoScroll.current = false;
		},
		[streaming],
	);

	const cssVars = useMemo(() => {
		return {
			'--padding-bottom': footerSize ? `${footerSize}px` : '0',
		} as React.CSSProperties;
	}, [footerSize]);

	// kick off intro message on mount
	useEffect(() => {
		if (showIntro && hydrated) startStream();
	}, [startStream, showIntro, hydrated]);

	// listeners and timers - set up and clean up
	useEffect(() => {
		ref.current?.addEventListener('scroll', handleBodyScroll);
		return () => {
			ref.current?.removeEventListener('scroll', handleBodyScroll);
			if (timeout.current) clearTimeout(timeout.current);
		};
	}, [handleBodyScroll]);

	return (
		<div className={styles.body} ref={ref} style={cssVars}>
			<div className={styles.content}>
				<ProfilePic />
				<Spacer size={8} />
				{hydrated && <MarkdownRenderer content={showIntro ? healthy : source} />}
				<MessagesThread handleStart={handleStreamStart} handleAppend={handleStreamAppend} />
			</div>
		</div>
	);
}
