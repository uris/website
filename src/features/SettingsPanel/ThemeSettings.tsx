import { useTheme } from '@apple-pie/slice';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';
import { ToggleButton } from '@/src/components/ToggleButton/ToggleButton';

export function ThemeSettings() {
	const { systemTheme, current, set: setTheme } = useTheme();

	return (
		<div className={styles.settingsBlock}>
			<SettingsSectionTitle title={'Theme'} />
			<ToggleButton
				unselect={false}
				selected={systemTheme}
				label={'System'}
				icon={'keyboard'}
				onSelect={() => setTheme('system')}
			/>
			<ToggleButton
				unselect={false}
				selected={!systemTheme && current.name === 'lightMode'}
				label={'Light'}
				icon={'circle'}
				onSelect={() => setTheme('lightMode')}
			/>
			<ToggleButton
				unselect={false}
				selected={!systemTheme && current.name === 'darkMode'}
				label={'Dark'}
				icon={'target'}
				onSelect={() => setTheme('darkMode')}
			/>
		</div>
	);
}
