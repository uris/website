import { CheckBox, Label, TextField } from '@apple-pie/slice';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsOption } from '@/src/components/SettingsOption/SettingsOption';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';

export function AISettings() {
	return (
		<div className={styles.settingsBlock}>
			<SettingsSectionTitle title={'AI Preferences'} />
			<Label borderSize={0} className={'core-text-secondary'} style={{ marginTop: 8 }}>
				Interactions:
			</Label>
			<SettingsOption>
				<CheckBox checked disabled>
					Type messages
				</CheckBox>
			</SettingsOption>
			<SettingsOption>
				<CheckBox checked>Speak to AI</CheckBox>
			</SettingsOption>
			<Label borderSize={0} className={'core-text-secondary'} style={{ marginTop: 8 }}>
				Personalize (optional):
			</Label>
			<SettingsOption>
				<TextField name={'name'} placeholder={'Your first name'} />
			</SettingsOption>
			<p className={'body-xs-regular core-text-disabled'} style={{ marginTop: 8 }}>
				This site does not share, save, record, or in any way persist messages and conversations. AI
				capabilities are provided in agreement with OpenAI's terms and privacy policies.
			</p>
		</div>
	);
}
