import { FlexDiv, VideoController } from '@apple-pie/slice';
import { useBrowserChannelActions, useIsActiveChannel } from '@apple-pie/slice/stores';
import type React from 'react';
import { useEffect } from 'react';
import { FrameEvent, type WorkChannelMessage } from '@/components/ProjectFrame/ProjectFrame';
import styles from './Wrapper.module.css';

interface WrapperProps {
	children: React.ReactNode;
}
export function Wrapper(props: Readonly<WrapperProps>) {
	const { children } = props;
	const { addChannel, removeChannel, post } = useBrowserChannelActions();
	const isWorkActive = useIsActiveChannel('work');

	// tell parent window it's ok to show the close project button now
	const handleQuitVideo = () => {
		const message: WorkChannelMessage = { event: FrameEvent.CHILD_EVENT, type: 'video-ended' };
		if (isWorkActive) post('work', message);
	};

	// set up work channel to send/receive messages and post project-loaded message to parent
	useEffect(() => {
		addChannel({ name: 'work', origin: 'project-frame' });
		post('work', { event: FrameEvent.CHILD_EVENT, type: 'project-loaded' });
		return () => void removeChannel('work');
	}, [addChannel, removeChannel, post]);

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
