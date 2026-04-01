'use client';

import { FlexDiv, IconButton, Preset } from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import { useAILayout } from '@/app/(ai)/store/layout-store';

export function AIPanelHeader() {
	const toggleSideBar = useAILayout().toggleSideBar;
	const toggleSettings = useAILayout().toggleSettings;
	const setTip = useTipActions().push;

	return (
		<FlexDiv preset={Preset.RowBetween} padding={24}>
			<FlexDiv preset={Preset.Row} gap={16}>
				<IconButton
					icon={'settings'}
					buttonSize={'l'}
					onClick={() => toggleSettings()}
					tooltip={'Settings'}
					onToolTip={setTip}
				/>
			</FlexDiv>
			<FlexDiv preset={Preset.Row} justify={'end'} gap={16}>
				<IconButton
					icon={'sidebar'}
					buttonSize={'l'}
					onClick={() => toggleSideBar()}
					tooltip={'Sidebar'}
					onToolTip={setTip}
				/>
			</FlexDiv>
		</FlexDiv>
	);
}
