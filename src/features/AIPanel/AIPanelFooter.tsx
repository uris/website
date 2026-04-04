'use client';

import { IconButton, ToggleButton, useTheme } from '@apple-pie/slice';
import {
	useMicActive,
	useMicMuted,
	useMicrophoneStoreActions,
	useTipActions,
	useToastActions,
} from '@apple-pie/slice/stores';
import { AnimatePresence, motion } from 'framer-motion';
import type { Transition, Variants } from 'motion';
import type React from 'react';
import { useMemo } from 'react';
import { ViTalkButton } from '@/src/components/ViTalkButton/ViTalkButton';
import { micMuteNotification } from '@/src/content/notifications/notifications';
import { useViConnected, useViTalk } from '@/src/stores/ai/viStore';
import { gradientCover } from '@/utils/styles/styles';
import styles from './AIPanel.module.css';

// animation variants
const animateButton: Variants = {
	initial: { opacity: 0, width: 0, scale: 0 },
	animate: { opacity: 1, width: 'auto', scale: 1 },
	exit: { opacity: 0, width: 0, scale: 0 },
};

// default button transition
const transition: Transition = { duration: 0.2, ease: 'easeInOut' };

export function AIPanelFooter() {
	const { current } = useTheme();
	const surfaceColor = current.colors['core-surface-primary'];
	const talk = useViTalk();
	const connected = useViConnected();
	const muted = useMicMuted();
	const micActive = useMicActive();
	const micIcon = muted ? 'mic muted' : 'mic';
	const mutedToolTip = muted ? 'Unmute' : 'Mute';
	const micTooltip = micActive ? mutedToolTip : 'Mic Unavailable';
	const toggleMute = useMicrophoneStoreActions().toggleMute;
	const setTip = useTipActions().push;
	const notify = useToastActions().push;

	// memo dynamic css variables
	const cssVars = useMemo(() => {
		return {
			'--footer-gradient': gradientCover(surfaceColor, 'top'),
		} as React.CSSProperties;
	}, [surfaceColor]);

	const handleMicToggle = () => {
		notify(micMuteNotification(!muted));
		toggleMute();
	};

	return (
		<div className={styles.footer} style={cssVars}>
			<IconButton
				round
				buttonSize={'xl'}
				icon={'keyboard'}
				tooltip={'Type to Vi'}
				onToolTip={setTip}
			/>
			<ViTalkButton size={'xl'} />
			<AnimatePresence initial={false} mode={'sync'}>
				{micActive && talk && connected && (
					<motion.div
						transition={transition}
						variants={animateButton}
						initial={'initial'}
						animate={'animate'}
						exit={'exit'}
					>
						<ToggleButton
							buttonSize={'xl'}
							icon={micIcon}
							disabled={!micActive}
							onChange={handleMicToggle}
							tooltip={micTooltip}
							onToolTip={setTip}
							selected={muted}
							fill
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
