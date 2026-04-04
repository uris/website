import { IconButton, ProgressIndicator } from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useViActions, useViConnected, useViConnecting, useViTalk } from '@/src/stores/ai/viStore';
import styles from './ViTalkButton.module.css';

interface ViTalkButtonProps {
	size?: 'xl' | 'l' | 'm' | 's';
}

export enum ViTalkState {
	Active = 'active', // connected and talk active
	Disconnected = 'disconnected', // not connected
	Connecting = 'connecting',
	NotEnabled = 'not enabled',
}

export function ViTalkButton(props: Readonly<ViTalkButtonProps>) {
	const { size = 'm' } = props;
	const connecting = useViConnecting();
	const connected = useViConnected();
	const talk = useViTalk();
	const connect = useViActions().connect;
	const disconnect = useViActions().disconnect;
	const setTalk = useViActions().setTalk;
	const setTip = useTipActions().push;
	const [viState, setViState] = useState<ViTalkState>(ViTalkState.Disconnected);

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
		if (viState === ViTalkState.NotEnabled) return 'Talk to Vi active';
		return 'Talk to Vi';
	}, [viState]);

	const progressSize = useMemo(() => {
		return size === 'xl' ? 68 : 46.5;
	}, [size]);

	const strokeSize = useMemo(() => {
		return size === 'xl' ? 0.5 : 0.55;
	}, [size]);

	const cssVars = useMemo(() => {
		return {
			'--button-size': `${progressSize}px`,
		} as React.CSSProperties;
	}, [progressSize]);

	// set state based on store values
	useEffect(() => setViState(getViState()), [getViState]);

	const handleClick = () => {
		switch (viState) {
			case ViTalkState.Active:
				console.log('talking to vi - disconnect?');
				disconnect();
				break;
			case ViTalkState.NotEnabled:
				console.log('vi not enabled - want to enable?');
				setTalk(true);
				break;
			case ViTalkState.Connecting:
				console.log('Please wait for connection');
				break;
			case ViTalkState.Disconnected:
				console.log('Connect and talk to vi');
				connect(true);
				break;
		}
	};

	return (
		<div className={styles.wrapper} style={cssVars}>
			<IconButton
				toggle={false}
				buttonSize={size}
				icon={'talk'}
				disabled={false}
				tooltip={setToolTip}
				onToolTip={setTip}
				isToggled={viState === ViTalkState.Active}
				bgColor={
					viState === ViTalkState.Connecting
						? 'var(--core-outline-primary)'
						: 'var(--core-surface-secondary)'
				}
				bgColorOn={'var(--core-link-primary)'}
				iconColorOn={'var(--core-surface-primary)'}
				onClick={handleClick}
				iconFill={true}
			/>
			{viState === ViTalkState.Connecting && (
				<div className={styles.ring}>
					<ProgressIndicator inline show size={progressSize} stroke={strokeSize} />
				</div>
			)}
		</div>
	);
}
