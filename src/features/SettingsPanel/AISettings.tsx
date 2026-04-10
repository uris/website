import { CheckBox, Label, TextField, useLocalStore } from '@apple-pie/slice';
import { useModalActions } from '@apple-pie/slice/stores';
import { useEffect } from 'react';
import { useAILayout, useUserName } from '@/app/(ai)/store/layout-store';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsOption } from '@/src/components/SettingsOption/SettingsOption';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';
import { ViTalkButton } from '@/src/components/ViTalkButton/ViTalkButton';
import { ViTalkModal } from '@/src/components/ViTalkModal/ViTalkModal';
import { useViConnected, useViConnecting, useViTalk } from '@/src/stores/ai/viStore';
import { useAutoScrollStream, useViResponsesActions } from '@/src/stores/responses/responsesStore';
import { EAction } from '@/utils/consts/consts';

export function AISettings() {
	const showModal = useModalActions().show;
	const connected = useViConnected();
	const connecting = useViConnecting();
	const talk = useViTalk();
	const baseLabel = connected && talk ? 'Vi Talk Active' : 'Connect with Vi';
	const label = connecting && talk ? 'Connecting with Vi' : baseLabel;
	const userName = useUserName();
	const setUserName = useAILayout().setUserName;
	const setScroll = useViResponsesActions().setAutoScrollStream;
	const autoScroll = useAutoScrollStream();
	const [autoScrollStream, setAutoScrollStream, hydrated] = useLocalStore<boolean>(
		'autoScrollStream',
		true,
	);

	// trigger info modal
	const handleInfoClick = async () => {
		showModal({
			id: 'vi-intro',
			component: ViTalkModal,
			props: { connect: false },
		});
	};

	// handle user name updates
	const handleUserNameChange = (value: string) => {
		setUserName(value);
	};

	// handle auto scroll updates
	const handleAutoScrollChange = (value: boolean) => {
		setAutoScrollStream(value);
		setScroll(value);
	};

	// initialize local store values
	useEffect(() => {
		if (hydrated) setScroll(autoScrollStream);
	}, [hydrated, setScroll, autoScrollStream]);

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
				What can Vi call you? (optional)
			</Label>
			<SettingsOption>
				<TextField
					name={'first_name'}
					value={userName ?? ''}
					placeholder={'Your name / nickname'}
					onChange={handleUserNameChange}
				/>
			</SettingsOption>
			<Label borderSize={0} className={'core-text-secondary'} style={{ marginTop: 8 }}>
				Message thread
			</Label>
			<SettingsOption>
				<CheckBox checked={autoScroll} onChange={handleAutoScrollChange}>
					Auto scroll text
				</CheckBox>
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
