'use client';

import {
	IconButton,
	PromptInput,
	ToggleButton,
	useObserveResize,
	useTheme,
} from '@apple-pie/slice';
import type { FileItem } from '@apple-pie/slice/components/FileList';
import {
	useMicActive,
	useMicMuted,
	useMicrophoneStoreActions,
	useTipActions,
	useToastActions,
} from '@apple-pie/slice/stores';
import type { Transition, Variants } from 'motion';
import { motion } from 'motion/react';
import React, { useEffect, useMemo, useRef } from 'react';
import styles from '@/features/AIPanel/AIPanel.module.css';
import { micMuteNotification } from '@/src/content/notifications/notifications';
import { useViActions, useViTalking } from '@/src/stores/ai/viStore';
import { useViBufferStreaming } from '@/src/stores/responses/responsesStore';
import { useHomeLayout, useUserName } from '@/stores/home-layout/homeLayoutStore';
import { gradientCover } from '@/utils/styles/styles';

// interface for text area input bar
export type TextAreaBarProps = {
	initial?: string;
	animate?: string;
	exit?: string;
	transition?: Transition;
	variants?: Variants;
};

const TextAreaBarBase = (props: Readonly<TextAreaBarProps>) => {
	const { initial = 'initial', animate = 'animate', exit = 'exit', transition, variants } = props;
	const { current } = useTheme();
	const surfaceColor = current.colors['core-surface-primary'];
	const setFooterSize = useHomeLayout().setFooterSize;
	const ref = useRef<HTMLDivElement>(null);
	const { height } = useObserveResize(ref, { ignore: 'width' });
	const toggleInputBar = useHomeLayout().toggleInputBar;
	const setTip = useTipActions().push;
	const muted = useMicMuted();
	const active = useMicActive();
	const isMuted = active && muted;
	const notify = useToastActions().push;
	const mute = useMicrophoneStoreActions().muteMic;
	const unmute = useMicrophoneStoreActions().unmuteMic;
	const sendMessage = useViActions().handleUserMessage;
	const streamActive = useViBufferStreaming();
	const viTalking = useViTalking();
	const userName = useUserName();

	// memo dynamic css variables
	const cssVars = useMemo(() => {
		return {
			'--footer-gradient': gradientCover(surfaceColor, 'top'),
		} as React.CSSProperties;
	}, [surfaceColor]);

	// handle muting/unmuting mic
	const handleMicToggle = (state: boolean) => {
		state ? mute() : unmute();
		notify(micMuteNotification(state));
	};

	// handle sending the user message to model
	const handleUserMessage = (message: string | undefined, _: FileItem[] | undefined) => {
		if (message) sendMessage(message);
	};

	// personalize placeholder
	const placeHolder = useMemo(() => {
		const nameString = userName ? ` ${userName}` : '';
		return `Hi${nameString}, ask me anything about Uris`;
	}, [userName]);

	// set footer size based on observed height
	useEffect(() => setFooterSize(height), [height, setFooterSize]);

	return (
		<motion.div
			ref={ref}
			className={styles.footerTextArea}
			style={cssVars}
			transition={transition}
			variants={variants}
			initial={initial}
			animate={animate}
			exit={exit}
		>
			<PromptInput
				borderRadius={16}
				attachButton={false}
				maxWidth={520}
				onSubmit={handleUserMessage}
				working={streamActive || viTalking}
				placeholderWorking={'Vi is talking ...'}
				placeholder={placeHolder}
				focused={true}
			>
				<div className={styles.textInputButtonsLeft}>
					<IconButton
						round
						buttonSize={'m'}
						icon={'chevron down'}
						tooltip={'Hide Text Field'}
						onToolTip={setTip}
						bgColor={'var(--core-surface-primary)'}
						border={true}
						onClick={() => toggleInputBar(false)}
					/>
				</div>
				<div className={styles.textInputButtonsRight}>
					{active && (
						<ToggleButton
							unselect={true}
							selected={isMuted}
							icon={isMuted ? 'mic muted' : 'mic'}
							tooltip={isMuted ? 'Unmute' : 'Mute'}
							onToolTip={setTip}
							fill
							onChange={handleMicToggle}
							bgColor={'var(--core-surface-primary)'}
							border={true}
						/>
					)}
				</div>
			</PromptInput>
		</motion.div>
	);
};

TextAreaBarBase.displayName = 'TextAreaBar';

export const TextAreaBar = React.memo(TextAreaBarBase);
