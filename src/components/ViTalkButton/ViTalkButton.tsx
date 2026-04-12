'use client';

import { AnimationPreset, IconButton, ProgressIndicator } from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TalkToViLabel } from '@/src/components/TalkToViLabel/TalkToViLabel';
import { useViActions, useViConnected, useViConnecting, useViTalk } from '@/src/stores/ai/viStore';
import { useHomeLayout, useShowTalkToViLabel } from '@/stores/home-layout/homeLayoutStore';
import styles from './ViTalkButton.module.css';

interface ViTalkButtonProps {
	size?: 'xl' | 'l' | 'm' | 's';
	background?: string;
	border?: boolean;
	toggle?: boolean;
	hasLabel?: boolean;
}

export enum ViTalkState {
	Active = 'active', // connected and talk active
	Disconnected = 'disconnected', // not connected
	Connecting = 'connecting',
	NotEnabled = 'not enabled',
}

export function ViTalkButton(props: Readonly<ViTalkButtonProps>) {
	const {
		size = 'm',
		background = 'var(--core-surface-secondary)',
		border = false,
		toggle = false,
		hasLabel = false,
	} = props;
	const connecting = useViConnecting();
	const connected = useViConnected();
	const talk = useViTalk();
	const connect = useViActions().connect;
	const disconnect = useViActions().disconnect;
	const setTalk = useViActions().setTalk;
	const setTip = useTipActions().push;
	const [viState, setViState] = useState<ViTalkState>(ViTalkState.Disconnected);
	const setTextInput = useHomeLayout().toggleInputBar;
	const showTalkToViLabel = useShowTalkToViLabel();
	const showLabel = showTalkToViLabel && hasLabel;

	// helper state calculator
	const getViState = useCallback(() => {
		if (connected && talk) return ViTalkState.Active;
		if (connected && !talk) return ViTalkState.NotEnabled;
		if (connecting && talk) return ViTalkState.Connecting;
		if (connecting && !talk) return ViTalkState.NotEnabled;
		if (!connected) return ViTalkState.Disconnected;
		return ViTalkState.Disconnected;
	}, [connecting, connected, talk]);

	// memo tip based on button state
	const setToolTip = useMemo(() => {
		if (viState === ViTalkState.Connecting) return 'Connecting with Vi';
		if (viState === ViTalkState.NotEnabled) return 'Talk to Vi disabled';
		if (viState === ViTalkState.Active) return 'Disconnect';
		return 'Talk to Vi';
	}, [viState]);

	// memo stroke size based on button size
	const strokeSize = useMemo(() => {
		return size === 'xl' ? 0.5 : 0.55;
	}, [size]);

	// handle talk to vi button
	const handleClick = async () => {
		switch (viState) {
			case ViTalkState.Active:
				disconnect();
				setTextInput(false);
				break;
			case ViTalkState.NotEnabled:
				setTalk(true);
				break;
			case ViTalkState.Connecting:
				break;
			case ViTalkState.Disconnected: {
				await connect(true);
				break;
			}
		}
	};

	// set a state based on store values
	useEffect(() => setViState(getViState()), [getViState]);

	return (
		<div className={styles.wrapper}>
			<IconButton
				toggle={false}
				buttonSize={size}
				icon={toggle && connected ? 'x' : 'talk'}
				disabled={false}
				tooltip={setToolTip}
				onToolTip={(tip) => (showLabel ? null : setTip(tip))}
				isToggled={viState === ViTalkState.Active}
				bgColor={viState === ViTalkState.Connecting ? 'var(--core-outline-primary)' : background}
				bgColorOn={'var(--core-link-primary)'}
				iconColorOn={'var(--core-surface-primary)'}
				border={border}
				onClick={handleClick}
				iconFill={true}
				presetAnimations={AnimationPreset.Rotate}
			/>
			{viState === ViTalkState.Connecting && (
				<div className={styles.ring}>
					<ProgressIndicator inline show size={'100%'} stroke={strokeSize} inset={false} />
				</div>
			)}
			<AnimatePresence initial={true}>
				{showLabel && (
					<motion.div
						key={'talk-vi-label'}
						transition={{ ease: 'easeInOut', duration: 0.25 }}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className={styles.label}
					>
						<TalkToViLabel />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
