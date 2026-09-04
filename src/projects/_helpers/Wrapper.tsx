import { FlexDiv, VideoController } from '@apple-pie/slice';
import type React from 'react';
import { FrameEvent } from '@/components/ProjectFrame/ProjectFrame';
import styles from './Wrapper.module.css';

interface WrapperProps {
	children: React.ReactNode;
}
export function Wrapper(props: Readonly<WrapperProps>) {
	const { children } = props;

	// tell parent window it's ok to show the close project button now
	const handleQuitVideo = () => {
		window.parent.postMessage({ event: FrameEvent.CHILD_EVENT, type: 'video-ended' }, globalThis.location.origin);
	};

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
