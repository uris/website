'use client';

import { AudioBubble, FlexDiv, Preset } from '@apple-pie/slice';
import { useMicrophone } from '@apple-pie/slice/hooks';
import {
	useMicActive,
	useMicMuted,
	useMicRequesting,
	useMicrophoneStoreActions,
	useMicStream,
	useSyncMicrophoneStore,
} from '@apple-pie/slice/stores';
import { useEffect, useRef } from 'react';

export function AIPanelBody() {
	const microphone = useMicrophone(false, '', false);
	const micActions = useMicrophoneStoreActions();
	const micStream = useMicStream();
	const micActive = useMicActive();
	const micMuted = useMicMuted();
	const micRequesting = useMicRequesting();
	const timer = useRef<NodeJS.Timeout>(null);
	useSyncMicrophoneStore(microphone);

	// note: need to wait to request the mic since chrome appears to "freeze" animation frames
	// when Macs try to connect to iPhones as an audio/video source
	useEffect(() => {
		if (micActive || micRequesting) return;
		timer.current = setTimeout(async () => {
			await micActions.requestMicrophone();
		}, 1000);
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [micActive, micRequesting, micActions]);

	return (
		<FlexDiv preset={Preset.FillCenter} padding={24} gap={16}>
			<AudioBubble audioStream={micStream.current} playing={micActive && !micMuted} />
		</FlexDiv>
	);
}
