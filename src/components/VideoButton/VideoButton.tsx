import { Button, Video, type VideoProps } from '@apple-pie/slice';
import { useBrowserChannelActions, useIsActiveChannel, useVideoActions } from '@apple-pie/slice/stores';
import type React from 'react';
import { FrameEvent, type WorkChannelMessage } from '@/components/ProjectFrame/ProjectFrame';

export type InlineButtonProps = {
	label?: string;
	children?: React.ReactNode;
	videoProps?: VideoProps;
	onClick?: () => void;
};

export function VideoButton(props: Readonly<InlineButtonProps>) {
	const { children, label = 'Button Label', onClick, videoProps } = props;
	const videoActions = useVideoActions();
	const isWorkActive = useIsActiveChannel('work');
	const post = useBrowserChannelActions().post;

	// tell parent to hide header buttons since the video will play as an overlay
	const handleClick = () => {
		if (!videoProps) return;
		videoActions.show({ component: Video, props: videoProps });
		const message: WorkChannelMessage = { event: FrameEvent.CHILD_EVENT, type: 'video-started' };
		if (isWorkActive) post('work', message);
		onClick?.();
	};

	return (
		<Button
			iconLeft={'play circle'}
			variant={'text'}
			size={'small'}
			paddingLeft={0}
			paddingRight={0}
			iconColor={'var(--core-link-primary)'}
			labelColor={'var(--core-link-primary)'}
			underline
			onClick={handleClick}
		>
			{children ?? label}
		</Button>
	);
}
