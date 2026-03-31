'use client';

import { FlexDiv, IconButton, Preset } from '@apple-pie/slice';
import { useAIPanel, useMicMuted } from '@/features/AIPanel/store/AiPanelStore';
import { useTipActions } from '@apple-pie/slice/stores';

export function AIPanelFooter() {
	const muted = useMicMuted();
	const toggleMute = useAIPanel().toggleMicMute;
	const setTip = useTipActions().push;

	return (
		<FlexDiv preset={Preset.Column} padding={24}>
			<IconButton
				round
				buttonSize={'xl'}
				icon={muted ? 'mic muted' : 'mic'}
				onClick={toggleMute}
				tooltip={muted ? 'Unmute' : 'Mute'}
				onToolTip={setTip}
			/>
		</FlexDiv>
	);
}
