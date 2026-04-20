'use client';

import { useLocalStore } from '@apple-pie/slice';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { MessagesThread } from '@/features/AIPanel/MessagesThread';
import { introMessageMd } from '@/src/content/intro/intro';
import { useStreamSimulator } from '@/src/hooks/streamSimulator/streamSimulator';
import { MarkdownRenderer } from '@/src/renderers/markdown/MarkdownRenderer';
import { useAutoScrollStream, useViBufferStreaming } from '@/src/stores/responses/responsesStore';
import { CallbackEvent } from '@/stores/ai/_types';
import { useViActions } from '@/stores/ai/viStore';
import {
	useFooterSize,
	useHomeLayout,
	useSettingsOpen,
} from '@/stores/home-layout/homeLayoutStore';
import styles from './AIPanel.module.css';

function AIPanelBody() {
	const [showIntro, setShowIntro, hydrated] = useLocalStore('showIntro', true);
	const showSidebar = useHomeLayout().toggleSideBar;
	const settingsOpen = useSettingsOpen();
	const ref = useRef<HTMLDivElement>(null);
	const timeout = useRef<NodeJS.Timeout | null>(null);
	const footerSize = useFooterSize();
	const autoScroll = useAutoScrollStream();
	const streaming = useViBufferStreaming();
	const lastScrollTop = useRef<number | undefined>(undefined);
	const pauseAutoScroll = useRef<boolean>(false);
	const setShowTalkToViLabel = useHomeLayout().setShowTalkToViLabel;
	const addViListener = useViActions().addViListener;
	const removeViListener = useViActions().removeViListener;

	// memo audio element for connected state
	const connectionSounds = useMemo(() => {
		if (typeof Audio === 'undefined') return null;
		const connected = new Audio('/audio/connected.mp3');
		const diconnected = new Audio('/audio/disconnected.mp3');
		return { connected, diconnected };
	}, []);

	// handle connection - play connection audio once on connection
	const handleViConnect = useCallback(() => {
		if (connectionSounds?.connected) connectionSounds.connected.play().then(() => null);
	}, [connectionSounds?.connected]);

	// handle disconnect - play disconnect audio once on disconnect
	const handleViDisconnect = useCallback(() => {
		if (connectionSounds?.diconnected) connectionSounds.diconnected.play().then(() => null);
	}, [connectionSounds?.diconnected]);

	// trigger the sidebar on the message end
	const handleIntroEnd = useCallback(() => {
		setShowIntro(false);
		if (!settingsOpen) showSidebar(true);
		setShowTalkToViLabel(true);
	}, [setShowIntro, setShowTalkToViLabel, settingsOpen, showSidebar]);
	const { healthy, startStream, source } = useStreamSimulator(introMessageMd, handleIntroEnd);

	// scroll to the bottom at stream start, reset auto stream
	const handleStreamStart = useCallback(() => {
		if (timeout.current) clearTimeout(timeout.current);
		pauseAutoScroll.current = false;
		timeout.current = setTimeout(() => {
			if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
		}, 100);
	}, []);

	// auto scroll to bottom while streaming
	const handleStreamAppend = useCallback(() => {
		if (autoScroll && !pauseAutoScroll.current && ref.current) {
			if (timeout.current) clearTimeout(timeout.current);
			if (ref.current.scrollTop === ref.current.scrollHeight) return;
			ref.current.scrollTop = ref.current.scrollHeight;
		}
	}, [autoScroll]);

	// handle scroll event to pause auto scroll of users scrolls up
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
			const didScrollUp = prev && next < prev;

			// if at bottom reset pause, if scroll up pause auto scroll
			if (isAtBottom) pauseAutoScroll.current = false;
			else if (streaming && didScrollUp) pauseAutoScroll.current = true;
		},
		[streaming],
	);

	// memo styles
	const cssVars = useMemo(() => {
		return {
			'--padding-bottom': footerSize ? `${footerSize}px` : '0',
		} as React.CSSProperties;
	}, [footerSize]);

	// kick off intro message on mount
	useEffect(() => {
		if (hydrated && showIntro) startStream();
		else if (hydrated && !showIntro) setShowTalkToViLabel(true);
	}, [startStream, showIntro, hydrated, setShowTalkToViLabel]);

	// listeners and timers - set up and clean up
	useEffect(() => {
		ref.current?.addEventListener('scroll', handleBodyScroll);
		addViListener(CallbackEvent.UserSpeechStart, handleStreamStart);
		addViListener(CallbackEvent.ResponseStart, handleStreamStart);
		addViListener(CallbackEvent.ViConnect, handleViConnect);
		addViListener(CallbackEvent.ViDisconnect, handleViDisconnect);
		return () => {
			ref.current?.removeEventListener('scroll', handleBodyScroll);
			removeViListener(CallbackEvent.UserSpeechStart, handleStreamStart);
			removeViListener(CallbackEvent.ResponseStart, handleStreamStart);
			removeViListener(CallbackEvent.ViConnect, handleViConnect);
			removeViListener(CallbackEvent.ViDisconnect, handleViDisconnect);
			if (timeout.current) clearTimeout(timeout.current);
		};
	}, [
		handleBodyScroll,
		addViListener,
		handleStreamStart,
		removeViListener,
		handleViConnect,
		handleViDisconnect,
	]);

	return (
		<div className={styles.body} ref={ref} style={cssVars}>
			<div className={styles.content}>
				{hydrated && <MarkdownRenderer content={showIntro ? healthy : source} />}
				<MessagesThread handleStart={handleStreamStart} handleAppend={handleStreamAppend} />
			</div>
		</div>
	);
}

export default AIPanelBody;
