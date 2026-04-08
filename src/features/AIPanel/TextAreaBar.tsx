import { PromptInput, ToggleButton, useObserveResize, useTheme } from '@apple-pie/slice';
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
import { useAILayout } from '@/app/(ai)/store/layout-store';
import styles from '@/features/AIPanel/AIPanel.module.css';
import { ViTalkButton } from '@/src/components/ViTalkButton/ViTalkButton';
import { micMuteNotification } from '@/src/content/notifications/notifications';
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
	const setFooterSize = useAILayout().setFooterSize;
	const ref = useRef<HTMLDivElement>(null);
	const { height } = useObserveResize(ref, { ignore: 'width' });
	const toggleInputBar = useAILayout().toggleInputBar;
	const setTip = useTipActions().push;
	const muted = useMicMuted();
	const active = useMicActive();
	const isMuted = active && muted;
	const notify = useToastActions().push;
	const mute = useMicrophoneStoreActions().muteMic;
	const unmute = useMicrophoneStoreActions().unmuteMic;

	// memo dynamic css variables
	const cssVars = useMemo(() => {
		return {
			'--footer-gradient': gradientCover(surfaceColor, 'top'),
		} as React.CSSProperties;
	}, [surfaceColor]);

	const handleMicToggle = (state: boolean) => {
		notify(micMuteNotification(state));
		state ? mute() : unmute();
	};

	// set footer size based on observed height
	useEffect(() => {
		console.log('hi');
		setFooterSize(height);
	}, [height, setFooterSize]);

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
			<PromptInput borderRadius={16} attachButton={false} maxWidth={520}>
				<ViTalkButton background={'var(--core-surface-primary)'} border={true} />
				<ToggleButton
					unselect={true}
					selected={true}
					icon={'keyboard'}
					tooltip={'Hide keyboard'}
					onChange={() => toggleInputBar(false)}
					bgColor={'var(--core-surface-primary)'}
					border={true}
				/>
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
			</PromptInput>
		</motion.div>
	);
};

TextAreaBarBase.displayName = 'TextAreaBar';

export const TextAreaBar = React.memo(TextAreaBarBase);
