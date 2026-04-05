'use client';

import { FlexDiv, Icon, IconButton, Preset } from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import { useAILayout } from '@/app/(ai)/store/layout-store';
import styles from './SettingsPanel.module.css';

export function SettingsHeader() {
	const toggleSettings = useAILayout().toggleSettings;
	const toolTip = useTipActions().push;

	return (
		<FlexDiv preset={Preset.RowBetween} padding={'16px 0'}>
			<div className={`${styles.header} heading-m-bold core-text-special`}>
				<Icon name={'settings'} strokeColor={'var(--core-text-special)'} />
				Settings
			</div>
			<div className={styles.close}>
				<IconButton
					icon={'x'}
					buttonSize={'l'}
					tooltip={'Close'}
					onToolTip={toolTip}
					toggle={false}
					onClick={() => toggleSettings()}
				/>
			</div>
		</FlexDiv>
	);
}
