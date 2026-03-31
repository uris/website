'use client';

import { AudioBubble, FlexDiv, Preset } from '@apple-pie/slice';
import { useMicrophone } from '@apple-pie/slice/hooks';
import { useMicMuted } from '@/features/AIPanel/store/AiPanelStore';

export function AIPanelBody() {
	const { micStream } = useMicrophone(false);
	const muted = useMicMuted();

	return (
		<FlexDiv preset={Preset.FillCenter} padding={24} gap={16}>
			<AudioBubble audioStream={micStream.current} playing={!muted} />
		</FlexDiv>
	);
}
