import { IconButton, ToggleButton, useObserveResize, useTheme } from '@apple-pie/slice';
import {
	useMicActive,
	useMicMuted,
	useMicrophoneStoreActions,
	useTipActions,
	useToastActions,
} from '@apple-pie/slice/stores';
import type { Transition, Variants } from 'motion';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useMemo, useRef } from 'react';
import { useAILayout } from '@/app/(ai)/store/layout-store';
import { ViTalkButton } from '@/src/components/ViTalkButton/ViTalkButton';
import { micMuteNotification } from '@/src/content/notifications/notifications';
import { useViConnected, useViTalk } from '@/src/stores/ai/viStore';
import { gradientCover } from '@/utils/styles/styles';
import styles from './AIPanel.module.css';

// button animation variants
const animateButton: Variants = {
	initial: { opacity: 0, width: 0, scale: 0 },
	animate: { opacity: 1, width: 'auto', scale: 1 },
	exit: { opacity: 0, width: 0, scale: 0 },
};

// button default transition
const transitionButton: Transition = { duration: 0.2, ease: 'easeInOut' };

// interface for bar in out
export type ButtonBarProps = {
	initial?: string;
	animate?: string;
	exit?: string;
	transition?: Transition;
	variants?: Variants;
};

const ButtonBarBase = (props: Readonly<ButtonBarProps>) => {
	const { initial = 'initial', animate = 'animate', exit = 'exit', transition, variants } = props;
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
	const toggleInputBar = useAILayout().toggleInputBar;
	const setFooterSize = useAILayout().setFooterSize;
	const ref = useRef<HTMLDivElement>(null);
	const { height } = useObserveResize(ref, { ignore: 'width' });

	// memo dynamic css variables
	const cssVars = useMemo(() => {
		return {
			'--footer-gradient': gradientCover(surfaceColor, 'top'),
		} as React.CSSProperties;
	}, [surfaceColor]);

	// toggle mic
	const handleMicToggle = () => {
		notify(micMuteNotification(!muted));
		toggleMute();
	};

	// set footer size based on observed height
	useEffect(() => setFooterSize(height), [height, setFooterSize]);

	return (
		<motion.div
			className={styles.footerButtonBar}
			style={cssVars}
			transition={transition}
			variants={variants}
			initial={initial}
			animate={animate}
			exit={exit}
			ref={ref}
		>
			<ViTalkButton size={'xl'} />
			<AnimatePresence initial={false} mode={'sync'}>
				{micActive && talk && connected && (
					<motion.div
						className={styles.buttonContainer}
						transition={transitionButton}
						variants={animateButton}
						initial={'initial'}
						animate={'animate'}
						exit={'exit'}
					>
						<IconButton
							round
							buttonSize={'xl'}
							icon={'keyboard'}
							tooltip={'Type to Vi'}
							onToolTip={setTip}
							onClick={() => toggleInputBar(true)}
						/>
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
		</motion.div>
	);
};

ButtonBarBase.displayName = 'ButtonBar';

export const ButtonBar = React.memo(ButtonBarBase);
