'use client';

import { FlexDiv, IconButton, Preset, ToastType } from '@apple-pie/slice';
import {
	useMicActive,
	useMicMuted,
	useMicrophoneStoreActions,
	useTipActions,
	useToastActions,
} from '@apple-pie/slice/stores';

export function AIPanelFooter() {
	const muted = useMicMuted();
	const micActive = useMicActive();
	const micIcon = muted ? 'mic muted' : 'mic';
	const mutedToolTip = muted ? 'Unmute' : 'Mute';
	const micTooltip = micActive ? mutedToolTip : 'Mic Unavailable';
	const toggleMute = useMicrophoneStoreActions().toggleMute;
	const setTip = useTipActions().push;
	const notify = useToastActions().push;

	const handleMicToggle = () => {
		notify({
			message: muted ? 'Unmuted' : 'Muted',
			close: false,
			duration: 1500,
			type: muted ? ToastType.Success : ToastType.Warning,
		});
		toggleMute();
	};

	return (
		<FlexDiv preset={Preset.Row} padding={24} gap={16} justify={'center'}>
			<IconButton round buttonSize={'xl'} icon={'keyboard'} tooltip={'Type'} onToolTip={setTip} />
			<IconButton
				round
				buttonSize={'xl'}
				icon={micIcon}
				disabled={!micActive}
				onClick={handleMicToggle}
				tooltip={micTooltip}
				onToolTip={setTip}
			/>
		</FlexDiv>
	);
}
