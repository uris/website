'use client';

import { Slider, ToggleButton } from '@apple-pie/slice';
import {
	useMuted,
	useStoredVolume,
	useTipActions,
	useToastActions,
	useVolume,
	useVolumeActions,
	useWebRTCActions,
} from '@apple-pie/slice/stores';
import { useCallback, useEffect, useMemo } from 'react';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsOption } from '@/src/components/SettingsOption/SettingsOption';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';
import { volumeMuteNotification } from '@/src/content/notifications/notifications';
import { CONN_NAME } from '@/src/stores/ai/_data';
import { useViActions, useViTalking } from '@/src/stores/ai/viStore';
import { CallbackEvent, type ViEventMessage } from '@/stores/ai/_types';
import { sendToolCallResultsItem } from '@/stores/ai/ViTalkCreateConvoItemFactory';

export function SoundSettings() {
	const volume = useVolume();
	const storedVolume = useStoredVolume();
	const muted = useMuted();
	const actions = useVolumeActions();
	const setRTCVolume = useWebRTCActions.setVolume;
	const setTip = useTipActions().push;
	const notify = useToastActions().push;
	const isMuted = muted || volume <= 0;
	const viTalking = useViTalking();
	const addViListener = useViActions().addViListener;

	// memo audio feedback element on mount - plays as affordance of volume level
	const feedbackElement = useMemo(() => {
		if (typeof Audio === 'undefined') return null;
		return new Audio('/audio/feedback.mp3');
	}, []);

	// memo speaker icon based on mute / volume level
	const speakerIcon = useMemo(() => {
		if (isMuted || volume <= 0) return 'speaker muted';
		if (volume <= 0.5) return 'speaker low';
		return 'speaker high';
	}, [isMuted, volume]);

	// toggle mute on / off emitting notification
	const handleMuteToggle = (state: boolean) => {
		setRTCVolume(CONN_NAME, state ? 0 : storedVolume);
		state ? actions.mute() : actions.unmute();
		notify(volumeMuteNotification(state));
	};

	// treat 0 as mute
	const handleAdjustVolume = useCallback(
		async (value: number, play: boolean) => {
			if (value <= 0 && !muted) {
				notify(volumeMuteNotification(true));
				await actions.mute();
			}
			setRTCVolume(CONN_NAME, value);
			actions.setVolume(value, { playFeedback: play && !viTalking }).then(() => null);
		},
		[actions, muted, notify, viTalking],
	);

	// handle vi requested volume change
	const handleViChangeVolume = useCallback(
		async (message?: ViEventMessage) => {
			const { action_value, id } = message ?? {};
			const volume = action_value?.volume;
			let result: any = { volumeChange: null, success: false, reason: 'invalid volume value' };
			if (volume !== undefined && volume >= 0 && volume <= 1) {
				console.log('vi request volume', message);
				await handleAdjustVolume(volume, true);
				result = { volumeChange: volume, success: true };
			}
			if (id) sendToolCallResultsItem(result, id, true);
		},
		[handleAdjustVolume],
	);

	// bind audio feedback element to store
	useEffect(() => {
		if (!feedbackElement) return;
		actions.attachFeedbackElement(feedbackElement);
		return () => {
			if (feedbackElement) actions.detachFeedbackElement(feedbackElement);
		};
	}, [actions, feedbackElement]);

	// set initial volume
	// biome-ignore lint/correctness/useExhaustiveDependencies: set once on mount
	useEffect(() => {
		actions.setVolume(0.75, { playFeedback: false }).then(() => null);
	}, []);

	// listen for volume updates requested by vi
	useEffect(() => {
		return addViListener(CallbackEvent.ViVolumeChange, handleViChangeVolume);
	}, [handleViChangeVolume, addViListener]);

	return (
		<div className={styles.settingsBlock}>
			<SettingsSectionTitle title={'Sound level'} label={muted ? 'muted' : undefined} />
			<SettingsOption gap={8} highlight={volume <= 0}>
				<ToggleButton
					unselect={true}
					selected={isMuted}
					icon={speakerIcon}
					tooltip={isMuted ? 'Unmute' : 'Mute'}
					onToolTip={setTip}
					fill
					onChange={handleMuteToggle}
				/>
				<Slider
					scaleMin={0}
					scaleMax={1}
					value={storedVolume}
					width={'100%'}
					height={4}
					trackHeadSize={16}
					onDragChange={(v, _) => handleAdjustVolume(v, true)}
					onChange={(v, _) => handleAdjustVolume(v, false)}
				/>
			</SettingsOption>
		</div>
	);
}
