import { Button, Video, type VideoProps } from '@apple-pie/slice';
import { useBrowserChannelActions, useIsActiveChannel, useVideoActions } from '@apple-pie/slice/stores';
import type React from 'react';
import { useMemo } from 'react';
import { FrameEvent, type WorkChannelMessage } from '@/components/ProjectFrame/ProjectFrame';
import { setStyle } from '@/utils/styles/styles';
import styles from './VideoButton.module.css';

export type InlineButtonProps = {
	label?: string;
	children?: React.ReactNode;
	videoProps?: VideoProps;
	onClick?: () => void;
	margin?: boolean;
	marginSize?: number | string;
};

export function VideoButton(props: Readonly<InlineButtonProps>) {
	const { children, label = 'Button Label', onClick, videoProps, margin = false, marginSize = 64 } = props;
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

	// css memo
	const cssVars = useMemo(() => {
		return {
			'--video-link-margin': margin ? setStyle(marginSize) : '0',
		} as React.CSSProperties;
	}, [margin, marginSize]);

	return (
		<div className={styles.wrapper} style={cssVars}>
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
		</div>
	);
}
