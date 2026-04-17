'use client';

import { ToggleButton, useTheme } from '@apple-pie/slice';
import { useCallback, useEffect } from 'react';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsOption } from '@/src/components/SettingsOption/SettingsOption';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';
import { CallbackEvent, type ViEventMessage } from '@/stores/ai/_types';
import { sendToolCallResultsItem } from '@/stores/ai/ViTalkCreateConvoItemFactory';
import { useViActions } from '@/stores/ai/viStore';

export function ThemeSettings() {
	const { systemTheme, current, set: setTheme } = useTheme();
	const addViListener = useViActions().addViListener;

	// handle vi requested theme change
	const handleViChangeTheme = useCallback(
		(message?: ViEventMessage) => {
			const { action_value, id } = message ?? {};
			let result: any = { theme: null, success: false };
			if (action_value?.theme) {
				setTheme(action_value.theme);
				result = { theme: action_value.theme, success: true };
			}
			if (id) sendToolCallResultsItem(result, id, true);
		},
		[setTheme],
	);

	// listen for theme changes requested by vi
	useEffect(() => {
		return addViListener(CallbackEvent.ViThemeChange, handleViChangeTheme);
	}, [handleViChangeTheme, addViListener]);

	return (
		<div className={styles.settingsBlock}>
			<SettingsSectionTitle title={'Theme'} />
			<SettingsOption>
				<ToggleButton
					unselect={false}
					selected={systemTheme}
					label={'System'}
					icon={'laptop'}
					fill
					onSelect={() => setTheme('system')}
				/>
			</SettingsOption>
			<SettingsOption>
				<ToggleButton
					unselect={false}
					selected={!systemTheme && current.name === 'lightMode'}
					label={'Rise and shine'}
					icon={'sun'}
					fill
					onSelect={() => setTheme('lightMode')}
				/>
			</SettingsOption>
			<SettingsOption>
				<ToggleButton
					unselect={false}
					selected={!systemTheme && current.name === 'darkMode'}
					label={'Focus time'}
					icon={'moon full'}
					fill
					onSelect={() => setTheme('darkMode')}
				/>
			</SettingsOption>
		</div>
	);
}
