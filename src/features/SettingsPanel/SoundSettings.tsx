'use client';

import { Slider, ToggleButton } from '@apple-pie/slice';
import {
	useMuted,
	useStoredVolume,
	useTipActions,
	useToastActions,
	useVolume,
	useVolumeActions,
} from '@apple-pie/slice/stores';
import { useEffect, useMemo } from 'react';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsOption } from '@/src/components/SettingsOption/SettingsOption';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';
import { volumeMuteNotification } from '@/src/content/notifications/notifications';

export function SoundSettings() {
	const volume = useVolume();
	const storedVolume = useStoredVolume();
	const muted = useMuted();
	const actions = useVolumeActions();
	const playFeedback = actions.playFeedback;
	const setTip = useTipActions().push;
	const notify = useToastActions().push;
	const isMuted = muted || volume <= 0;

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

	// toggle mute on / off emiting notification
	const handleMuteToggle = (state: boolean) => {
		notify(volumeMuteNotification(state));
		state ? actions.mute() : actions.unmute();
	};

	// treat 0 as mute
	const handleAdjustVolume = (value: number, _: number) => {
		if (value <= 0 && !muted) {
			notify(volumeMuteNotification(true));
			void actions.mute();
		}
		actions.setVolume(value);
	};

	// bind audio feedback element to store
	useEffect(() => {
		if (!feedbackElement) return;
		actions.attachFeedbackElement(feedbackElement);
		return () => {
			if (feedbackElement) actions.detachFeedbackElement(feedbackElement);
		};
	}, [actions, feedbackElement]);

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
					onChange={handleAdjustVolume}
					onDragChange={(v, _p) => playFeedback(v)}
				/>
			</SettingsOption>
		</div>
	);
}
