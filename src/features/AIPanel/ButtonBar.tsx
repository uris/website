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
import { useViConnected } from '@/src/stores/ai/viStore';
import { gradientCover } from '@/utils/styles/styles';
import styles from './AIPanel.module.css';

// button animation variants
const animateButton = (side: 'left' | 'right') => {
	const xValue = side === 'left' ? -64 : 64;
	return {
		initial: { opacity: 0, x: 0 },
		animate: { opacity: 1, x: xValue },
		exit: { opacity: 0, x: 0 },
	} as Variants;
};

// button default transition
const transitionButton: Transition = { duration: 1, type: 'spring', bounce: 0.3 };

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
	const viConnected = useViConnected();
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
			<AnimatePresence initial={false} mode={'sync'}>
				{viConnected && micActive && (
					<motion.div
						className={styles.keyboard}
						transition={transitionButton}
						variants={animateButton('left')}
						initial={'initial'}
						animate={'animate'}
						exit={'exit'}
					>
						<IconButton
							round
							buttonSize={'l'}
							icon={'character beam'}
							tooltip={'Type messages'}
							onToolTip={setTip}
							onClick={() => toggleInputBar(true)}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			<ViTalkButton size={'xl'} hasLabel toggle />
			<AnimatePresence initial={false} mode={'sync'}>
				{micActive && viConnected && (
					<motion.div
						className={styles.microphone}
						transition={transitionButton}
						variants={animateButton('right')}
						initial={'initial'}
						animate={'animate'}
						exit={'exit'}
					>
						<ToggleButton
							buttonSize={'l'}
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
