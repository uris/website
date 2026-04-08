'use client';

import { IconButton, ProgressIndicator, useLocalStore } from '@apple-pie/slice';
import { useModalActions, useTipActions } from '@apple-pie/slice/stores';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ViTalkModal } from '@/src/components/ViTalkModal/ViTalkModal';
import { useViActions, useViConnected, useViConnecting, useViTalk } from '@/src/stores/ai/viStore';
import styles from './ViTalkButton.module.css';

interface ViTalkButtonProps {
	size?: 'xl' | 'l' | 'm' | 's';
	background?: string;
	border?: boolean;
}

export enum ViTalkState {
	Active = 'active', // connected and talk active
	Disconnected = 'disconnected', // not connected
	Connecting = 'connecting',
	NotEnabled = 'not enabled',
}

export function ViTalkButton(props: Readonly<ViTalkButtonProps>) {
	const { size = 'm', background = 'var(--core-surface-secondary)', border = false } = props;
	const modalResponse = useModalActions().modalResponse;
	const connecting = useViConnecting();
	const connected = useViConnected();
	const talk = useViTalk();
	const connect = useViActions().connect;
	const disconnect = useViActions().disconnect;
	const setTalk = useViActions().setTalk;
	const setTip = useTipActions().push;
	const [viState, setViState] = useState<ViTalkState>(ViTalkState.Disconnected);
	const [viTalkConfirm, setViTalkConfirm] = useLocalStore<boolean>('viTalkConfirm', false);

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

	// memo stroke size based on button size
	const strokeSize = useMemo(() => {
		return size === 'xl' ? 0.5 : 0.55;
	}, [size]);

	// trigger initial vi talk modal to confirm continue
	const confirmViTalk = async () => {
		if (viTalkConfirm) return true;
		return await modalResponse<boolean>({
			id: 'vi-intro',
			component: ViTalkModal,
			props: { connect: true },
		}).catch(() => false);
	};

	// handle talk to vi button
	const handleClick = async () => {
		switch (viState) {
			case ViTalkState.Active:
				disconnect();
				break;
			case ViTalkState.NotEnabled:
				setTalk(true);
				break;
			case ViTalkState.Connecting:
				break;
			case ViTalkState.Disconnected: {
				const confirmation = await confirmViTalk();
				setViTalkConfirm(!!confirmation);
				if (confirmation) await connect(true);
				break;
			}
		}
	};

	// set state based on store values
	useEffect(() => setViState(getViState()), [getViState]);

	return (
		<div className={styles.wrapper}>
			<IconButton
				toggle={false}
				buttonSize={size}
				icon={'talk'}
				disabled={false}
				tooltip={setToolTip}
				onToolTip={setTip}
				isToggled={viState === ViTalkState.Active}
				bgColor={viState === ViTalkState.Connecting ? 'var(--core-outline-primary)' : background}
				bgColorOn={'var(--core-link-primary)'}
				iconColorOn={'var(--core-surface-primary)'}
				border={border}
				onClick={handleClick}
				iconFill={true}
			/>
			{viState === ViTalkState.Connecting && (
				<div className={styles.ring}>
					<ProgressIndicator inline show size={'100%'} stroke={strokeSize} inset={false} />
				</div>
			)}
		</div>
	);
}
