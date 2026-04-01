import { useTheme } from '@apple-pie/slice';
import { useState } from 'react';
import styles from '@/features/SettingsPanel/SettingsPanel.module.css';
import { SettingsSectionTitle } from '@/src/components/SettingsSectionTitle/SettingsSectionTitle';
import { ToggleButton } from '@/src/components/ToggleButton/ToggleButton';

export function ThemeSettings() {
	const [selected, setSelected] = useState<string>('system');
	const theme = useTheme();

	const handleSelect = (selection: string) => {
		setSelected(selection);
		theme.set(selection);
	};

	return (
		<div className={styles.settingsBlock}>
			<SettingsSectionTitle title={'Theme'} />
			<ToggleButton
				unselect={false}
				selected={selected === 'system'}
				label={'System'}
				icon={'keyboard'}
				onSelect={() => handleSelect('system')}
			/>
			<ToggleButton
				unselect={false}
				selected={selected === 'lightMode'}
				label={'Light'}
				icon={'circle'}
				onChange={() => handleSelect('lightMode')}
			/>
			<ToggleButton
				unselect={false}
				selected={selected === 'darkMode'}
				label={'Dark'}
				icon={'target'}
				onChange={() => handleSelect('darkMode')}
			/>
		</div>
	);
}
