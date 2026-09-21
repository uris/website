import { FlexDiv, VideoController } from '@apple-pie/slice';
import { useBrowserChannelActions, useIsActiveChannel } from '@apple-pie/slice/stores';
import type React from 'react';
import { useEffect, useMemo } from 'react';
import { FrameEvent, type WorkChannelMessage } from '@/components/ProjectFrame/ProjectFrame';
import styles from './Wrapper.module.css';

interface WrapperProps {
	children: React.ReactNode;
	getChannelName?: (name: string) => void;
}
export function Wrapper(props: Readonly<WrapperProps>) {
	const { children, getChannelName } = props;
	const { addChannel, removeChannel, post } = useBrowserChannelActions();

	// memoize parent window from search params
	const parentWindowId = useMemo(() => {
		if (typeof window === 'undefined') return undefined;
		return new URLSearchParams(window.location.search).get('windowId');
	}, []);

	const channelName = parentWindowId ? `work.${parentWindowId}` : '';
	const isWorkActive = useIsActiveChannel(channelName);

	// tell parent window it's ok to show the close project button now
	const handleQuitVideo = () => {
		const message: WorkChannelMessage = { event: FrameEvent.CHILD_EVENT, type: 'video-ended' };
		if (isWorkActive) post(channelName, message);
	};

	// set up work channel to send/receive messages and post project-loaded message to parent
	useEffect(() => {
		if (!channelName) return;
		addChannel({ name: channelName, origin: `${parentWindowId}.project-frame` });
		post(channelName, { event: FrameEvent.CHILD_EVENT, type: 'project-loaded' });
		return () => void removeChannel(channelName);
	}, [addChannel, removeChannel, post, parentWindowId, channelName]);

	// Expose the channel after rendering, so callers can safely store it in state.
	useEffect(() => {
		getChannelName?.(channelName);
	}, [channelName, getChannelName]);

	return (
		<FlexDiv
			width={'fill'}
			height={'fill'}
			justify={'start'}
			align={'center'}
			direction={'column'}
			scrollY={true}
			scrollX={false}
			background={'var(--core-surface-primary-tint)'}
			className={styles.wrapper}
		>
			<div className={styles.content}>{children}</div>
			<VideoController draggable={false} quit={'outside'} onQuit={handleQuitVideo} />
		</FlexDiv>
	);
}
