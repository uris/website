'use client';

import { ToggleButton, useTheme } from '@apple-pie/slice';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsOption } from '@/src/components/SettingsOption/SettingsOption';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';

export function ThemeSettings() {
	const { systemTheme, current, set: setTheme } = useTheme();

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
