import { Button, DropDown, type MicOption, Slider, ToggleButton } from '@apple-pie/slice';
import { useMicrophone } from '@apple-pie/slice/hooks';
import {
	useCurrentMicDeviceId,
	useMicActive,
	useMicInputVolume,
	useMicMuted,
	useMicOptions,
	useMicRequesting,
	useMicrophoneStoreActions,
	useMicSupported,
	useSyncMicrophoneStore,
	useTipActions,
	useToastActions,
} from '@apple-pie/slice/stores';
import { useMemo } from 'react';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsOption } from '@/src/components/SettingsOption/SettingsOption';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';
import {
	micConnectNotification,
	micMuteNotification,
	micNotSupportedNotification,
} from '@/src/content/notifications/notifications';

export function MicrophoneSettings() {
	const microphone = useMicrophone(false, '', false);
	useSyncMicrophoneStore(microphone);
	const micOptions = useMicOptions();
	const mivInputVolume = useMicInputVolume();
	const selectedMicId = useCurrentMicDeviceId() ?? '';
	const setSelectedMic = useMicrophoneStoreActions().setMicrophone;
	const requestMic = useMicrophoneStoreActions().requestMicrophone;
	const mute = useMicrophoneStoreActions().muteMic;
	const unmute = useMicrophoneStoreActions().unmuteMic;
	const setInputVolume = useMicrophoneStoreActions().setInputVolume;
	const micSupported = useMicSupported();
	const isRequesting = useMicRequesting();
	const setTip = useTipActions().push;
	const muted = useMicMuted();
	const active = useMicActive();
	const isMuted = active && muted;
	const notify = useToastActions().push;
	const label = useMemo(() => {
		if (isRequesting) return undefined;
		if (!active) return 'not connected';
		return isMuted ? 'muted' : undefined;
	}, [active, isMuted, isRequesting]);

	const handleMicToggle = (state: boolean) => {
		notify(micMuteNotification(state));
		state ? mute() : unmute();
	};

	const handleAdjustMicInput = (value: number, _: number) => {
		if (value <= 0 && !muted) {
			notify(micMuteNotification(true));
			mute();
		}
		setInputVolume(value);
	};

	const handleConnectMic = async () => {
		if (active || isRequesting) return;
		await requestMic()
			.then(() => {
				notify(micConnectNotification(true));
			})
			.catch((err) => {
				notify(micNotSupportedNotification(err));
			});
	};

	return (
		<div className={styles.settingsBlock}>
			<SettingsSectionTitle title={'Microphone'} label={label} working={isRequesting} />
			{!active && !isRequesting && (
				<SettingsOption gap={8}>
					<Button variant={'solid'} width={'100%'} onClick={handleConnectMic}>
						Connect to a Microphone
					</Button>
				</SettingsOption>
			)}
			{active && (
				<SettingsOption gap={8} highlight={muted}>
					<DropDown<MicOption>
						disabled={!micSupported}
						backgroundColor={'transparent'}
						paddingBottom={8}
						iconColor={'var(--core-text-special)'}
						borderStyle={'bottom'}
						width={'100%'}
						options={micOptions}
						valueKey={'id'}
						selectedValue={{ id: selectedMicId }}
						onOption={setSelectedMic}
						placeholder={false}
					/>
				</SettingsOption>
			)}
			{active && (
				<SettingsOption gap={8} disabled={!active}>
					<ToggleButton
						unselect={true}
						selected={isMuted}
						icon={isMuted ? 'mic muted' : 'mic'}
						tooltip={isMuted ? 'Unmute' : 'Mute'}
						onToolTip={setTip}
						fill
						onChange={handleMicToggle}
					/>
					<Slider
						scaleMin={0}
						scaleMax={1}
						value={mivInputVolume}
						width={'100%'}
						height={4}
						progressColor={'var(--core-text-tertiary)'}
						trackHeadSize={16}
						onChange={handleAdjustMicInput}
					/>
				</SettingsOption>
			)}
		</div>
	);
}
