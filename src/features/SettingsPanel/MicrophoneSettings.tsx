import { DropDown, Slider } from '@apple-pie/slice';
import {
	useMicMuted,
	useMicOptions,
	useMicRequesting,
	useMicrophoneStoreActions,
	useMicSupported,
} from '@apple-pie/slice/stores';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsOption } from '@/src/components/SettingsOption/SettingsOption';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';

export function MicrophoneSettings() {
	const micOptions = useMicOptions();
	const setSelectedMic = useMicrophoneStoreActions().setMicrophone;
	const micSupported = useMicSupported();
	const isRequesting = useMicRequesting();
	const muted = useMicMuted();
	const label = muted ? 'muted' : undefined;

	return (
		<div className={styles.settingsBlock}>
			<SettingsSectionTitle title={'Microphone'} label={label} working={isRequesting} />
			<SettingsOption icon={'mic'} gap={12}>
				<DropDown
					disabled={!micSupported}
					backgroundColor={'transparent'}
					paddingBottom={0}
					iconColor={'var(--core-text-special)'}
					borderStyle={'none'}
					width={'auto'}
					options={micOptions}
					selectedIndex={0}
					onOption={setSelectedMic}
					placeholder={false}
				/>
			</SettingsOption>
			<SettingsOption icon={'mic'} disabled={muted}>
				<Slider scaleMin={0} scaleMax={1} value={0.75} width={'100%'} trackHeadSize={12} />
			</SettingsOption>
		</div>
	);
}
