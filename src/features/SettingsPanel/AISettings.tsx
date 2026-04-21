'use client';

import { CheckBox, Label, TextField, useLocalStore } from '@apple-pie/slice';
import { useModalActions } from '@apple-pie/slice/stores';
import { useEffect } from 'react';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsOption } from '@/src/components/SettingsOption/SettingsOption';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';
import { ViTalkButton } from '@/src/components/ViTalkButton/ViTalkButton';
import { ViTalkModal } from '@/src/components/ViTalkModal/ViTalkModal';
import { useViActions, useViConnected, useViConnecting, useViTalk } from '@/src/stores/ai/viStore';
import { useAutoScrollStream, useViResponsesActions } from '@/src/stores/responses/responsesStore';
import { useHomeLayout, useUserName } from '@/stores/home-layout/homeLayoutStore';
import { EAction } from '@/utils/consts/consts';

export function AISettings() {
	const showModal = useModalActions().show;
	const modalResponse = useModalActions().modalResponse;
	const connected = useViConnected();
	const connecting = useViConnecting();
	const connect = useViActions().connect;
	const talk = useViTalk();
	const baseLabel = connected && talk ? 'Talk to Vi Active' : 'Talk to Vi';
	const label = connecting && talk ? 'Connecting with Vi' : baseLabel;
	const userName = useUserName();
	const setUserName = useHomeLayout().setUserName;
	const setScroll = useViResponsesActions().setAutoScrollStream;
	const autoScroll = useAutoScrollStream();
	const [_, setViTalkConfirm] = useLocalStore<boolean>('viTalkConfirm', false);
	const [autoScrollStream, setAutoScrollStream, hydrated] = useLocalStore<boolean>('autoScrollStream', true);

	// trigger info modal
	const showInfoModal = async () => {
		showModal({
			id: 'vi-intro',
			component: ViTalkModal,
			props: { connect: false },
		});
	};

	// with connect option
	const showConnectModal = async () => {
		const result = await modalResponse<boolean>({
			id: 'vi-intro',
			component: ViTalkModal,
			props: { connect: true },
		}).catch(() => false);
		if (result) {
			setViTalkConfirm(result);
			await connect(true);
		}
	};

	// handle the info click
	const handleInfo = () => {
		connected ? showInfoModal() : showConnectModal();
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
				title={'Talk to Vi Preferences'}
				info={{ action: EAction.TalkToVi, tip: 'About Vi' }}
				infoClick={handleInfo}
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
			<p className={`${styles.disclaimer} body-xs-regular core-text-disabled`} style={{ margin: '8px 0 0 0' }}>
				The conversations you have are completely private. They are not recorded, stored, saved, shared or used in any
				way by this site. They are subject, however, to OpenAI's terms and privacy policies.
			</p>
		</div>
	);
}
