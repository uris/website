import { FlexDiv, Icon, Preset } from '@apple-pie/slice';
import type React from 'react';
import { useMemo } from 'react';
import styles from './SettingsOption.module.css';

interface SettingsOptionProps {
	children?: React.ReactNode;
	icon?: string;
	gap?: number;
	disabled?: boolean;
	highlight?: boolean;
}

export function SettingsOption(props: Readonly<SettingsOptionProps>) {
	const { children, icon, gap = 0, disabled = false, highlight = false } = props;

	const pointerEvents = useMemo(() => (disabled ? 'none' : 'auto'), [disabled]);
	const opacity = useMemo(() => (disabled ? 0.5 : 1), [disabled]);

	return (
		<div className={styles.wrapper} style={{ gap }}>
			{icon && (
				<div
					className={`${styles.icon} ${highlight ? styles.highlight : ''}`}
					style={{ pointerEvents, opacity }}
				>
					<Icon name={icon} fill />
				</div>
			)}
			<FlexDiv preset={Preset.Row} gap={8} style={{ pointerEvents, opacity }}>
				{children}
			</FlexDiv>
		</div>
	);
}
