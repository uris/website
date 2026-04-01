import { Slider } from '@apple-pie/slice';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsOption } from '@/src/components/SettingsOption/SettingsOption';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';

export function SoundSettings() {
	return (
		<div className={styles.settingsBlock}>
			<SettingsSectionTitle title={'Sound'} />
			<SettingsOption icon={'mic'}>
				<Slider scaleMin={0} scaleMax={1} value={0.75} width={'100%'} trackHeadSize={12} />
			</SettingsOption>
		</div>
	);
}
