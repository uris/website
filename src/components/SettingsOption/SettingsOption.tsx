import { FlexDiv, Icon, Preset } from '@apple-pie/slice';
import type React from 'react';
import styles from './SettingsOption.module.css';

interface SettingsOptionProps {
	children?: React.ReactNode;
	gap?: number;
	disabled?: boolean;
	highlight?: boolean;
	icon?: string;
	onIconClick?: (e: React.MouseEvent<SVGElement, MouseEvent>) => void;
}

export function SettingsOption(props: Readonly<SettingsOptionProps>) {
	const { children, icon, gap = 0, disabled = false, highlight = false, onIconClick } = props;

	const pointerEvents = disabled ? 'none' : 'auto';
	const opacity = disabled ? 0.5 : 1;

	return (
		<div className={styles.wrapper} style={{ gap }}>
			{icon && (
				<div className={`${styles.icon} ${highlight ? styles.highlight : ''}`} style={{ pointerEvents, opacity }}>
					<Icon name={icon} fill onClick={onIconClick} />
				</div>
			)}
			<FlexDiv preset={Preset.Row} gap={8} style={{ pointerEvents, opacity }}>
				{children}
			</FlexDiv>
		</div>
	);
}
