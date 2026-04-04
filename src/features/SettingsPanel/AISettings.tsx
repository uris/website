import { Label, TextField } from '@apple-pie/slice';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsOption } from '@/src/components/SettingsOption/SettingsOption';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';
import { ViTalkButton } from '@/src/components/ViTalkButton/ViTalkButton';
import { EAction } from '@/utils/consts/consts';

export function AISettings() {
	return (
		<div className={styles.settingsBlock}>
			<SettingsSectionTitle
				title={'Vi Preferences'}
				info={{ action: EAction.TalkToVi, tip: 'About Vi' }}
			/>
			<SettingsOption>
				<ViTalkButton />
				Talk to Vi
			</SettingsOption>
			<Label borderSize={0} className={'core-text-secondary'} style={{ marginTop: 8 }}>
				Tell Vi your name (optional)
			</Label>
			<SettingsOption>
				<TextField name={'name'} placeholder={'Your first name'} />
			</SettingsOption>
			<p
				className={`${styles.disclaimer} body-xs-regular core-text-disabled`}
				style={{ margin: '8px 0 0 0' }}
			>
				The conversations you have are completely private. They are not recorded, stored, saved,
				shared or used in any way by this site. They are subject, however, to OpenAI's terms and
				privacy policies.
			</p>
		</div>
	);
}
