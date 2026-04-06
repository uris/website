import { Label, TextField } from '@apple-pie/slice';
import { useModalActions } from '@apple-pie/slice/stores';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsOption } from '@/src/components/SettingsOption/SettingsOption';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';
import { ViTalkButton } from '@/src/components/ViTalkButton/ViTalkButton';
import { ViTalkModal } from '@/src/components/ViTalkModal/ViTalkModal';
import { EAction } from '@/utils/consts/consts';
import {useViConnected, useViConnecting, useViTalk} from "@/src/stores/ai/viStore";

export function AISettings() {
	const showModal = useModalActions().show;
	const connected = useViConnected();
	const connecting = useViConnecting();
	const talk = useViTalk();
	const baseLabel = connected && talk ? 'Vi Talk Active' : 'Connect with Vi';
	const label = connecting && talk ? 'Connecting with Vi' : baseLabel

	// trigger info modal
	const handleInfoClick = async () => {
		showModal({
			id: 'vi-intro',
			component: ViTalkModal,
			props: { connect: false },
		});
	};

	return (
		<div className={styles.settingsBlock}>
			<SettingsSectionTitle
				title={'Vi Talk Preferences'}
				info={{ action: EAction.TalkToVi, tip: 'About Vi' }}
				infoClick={handleInfoClick}
			/>
			<SettingsOption>
				<ViTalkButton />
				{label}
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
