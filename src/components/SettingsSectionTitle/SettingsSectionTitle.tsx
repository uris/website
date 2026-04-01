import { FlexDiv, Icon, Label, Preset, ProgressIndicator } from '@apple-pie/slice';
import styles from './SettingsSectionTitle.module.css';

export interface SettingsSectionTitleProps {
	title: string;
	label?: string;
	icon?: string;
	working?: boolean;
}

export function SettingsSectionTitle(props: Readonly<SettingsSectionTitleProps>) {
	const { title, icon, label, working = false } = props;
	return (
		<FlexDiv preset={Preset.Row} gap={4}>
			{icon && (
				<div className={styles.icon}>
					<Icon name={icon} size={18} />
				</div>
			)}
			<Label borderSize={0} className={'body-l-bold'}>
				{title}
			</Label>
			{label && <Label className={'body-s-bold'}>{label}</Label>}
			{working && <ProgressIndicator inline show />}
		</FlexDiv>
	);
}
