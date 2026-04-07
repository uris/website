'use client';

import { FlexDiv, Icon, IconButton, Label, Preset, ProgressIndicator } from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import { MicLevel } from '@/src/components/MicLevel/MicLevel';
import type { EAction } from '@/utils/consts/consts';
import styles from './SettingsSectionTitle.module.css';

export interface SettingsSectionTitleProps {
	title: string;
	label?: string;
	icon?: string;
	working?: boolean;
	info?: { tip: string; action: EAction };
	infoClick?: (action: EAction | undefined) => void;
}

export function SettingsSectionTitle(props: Readonly<SettingsSectionTitleProps>) {
	const { title, icon, label, working = false, info, infoClick } = props;
	const toolTip = useTipActions().push;
	const isMicrophone = title.toLowerCase().includes('microphone');

	const handleInfoClick = () => {
		infoClick?.(info?.action);
	};

	return (
		<FlexDiv preset={Preset.RowBetween} gap={4} margin={'0 0 8px 0'} style={{ minHeight: 26 }}>
			{icon && (
				<div className={styles.icon}>
					<Icon name={icon} size={18} />
				</div>
			)}
			<Label borderSize={0} className={'body-m-bold'}>
				{title}
			</Label>
			{label && (
				<Label borderSize={0} className={'body-s-bold feedback-attention'}>
					{label}
				</Label>
			)}
			{working && <ProgressIndicator inline show />}
			{info && (
				<IconButton
					toggle={false}
					icon={'help'}
					bgColor={'none'}
					bgColorHover={'none'}
					bgColorOn={'none'}
					iconColor={'var(--core-text-disabled)'}
					iconColorHover={'var(--core-text-special)'}
					tooltip={info.tip}
					onToolTip={toolTip}
					onClick={handleInfoClick}
				/>
			)}
			{isMicrophone && <MicLevel />}
		</FlexDiv>
	);
}
