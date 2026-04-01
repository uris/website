import { CheckBox, FlexDiv, Label, Preset, TextField } from '@apple-pie/slice';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';

export function AISettings() {
	return (
		<div className={styles.settingsBlock}>
			<SettingsSectionTitle title={'AI'} icon={'sparkle'} />
			<FlexDiv preset={Preset.Column} gap={8}>
				<Label borderSize={0} className={'core-text-secondary'}>
					Interaction style:
				</Label>
				<CheckBox checked disabled>
					Type messages
				</CheckBox>
				<CheckBox checked>Speak to AI</CheckBox>
			</FlexDiv>
			<FlexDiv preset={Preset.Column} gap={8}>
				<Label borderSize={0} className={'core-text-secondary'}>
					Personal touch (optional):
				</Label>
				<TextField name={'name'} placeholder={'Your first name'} />
			</FlexDiv>
			<p className={'body-xs-regular core-text-disabled'} style={{ margin: 0 }}>
				This site does not share, save, record, or in any way persist messages and conversations. AI
				capabilities are provided in agreement with OpenAI's terms and privacy policies.
			</p>
		</div>
	);
}
