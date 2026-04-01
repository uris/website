import { FlexDiv, Icon, Preset } from '@apple-pie/slice';
import type React from 'react';
import { useMemo } from 'react';
import styles from './SettingsOption.module.css';

interface SettingsOptionProps {
	children?: React.ReactNode;
	icon?: string;
	gap?: number;
	disabled?: boolean;
}

export function SettingsOption(props: Readonly<SettingsOptionProps>) {
	const { children, icon, gap = 8, disabled = false } = props;

	const pointerEvents = useMemo(() => (disabled ? 'none' : 'auto'), [disabled]);
	const opacity = useMemo(() => (disabled ? 0.5 : 1), [disabled]);

	return (
		<FlexDiv preset={Preset.Row} gap={gap}>
			{icon && (
				<div className={styles.icon} style={{ pointerEvents, opacity }}>
					<Icon name={icon} />
				</div>
			)}
			<FlexDiv preset={Preset.Row} gap={8} style={{ pointerEvents, opacity }}>
				{children}
			</FlexDiv>
		</FlexDiv>
	);
}
