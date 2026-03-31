'use client';

import { FlexDiv, IconButton, Preset } from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import { useAIPanel } from '@/features/AIPanel/store/AiPanelStore';

export function AIPanelHeader() {
	const toggleSideBar = useAIPanel().toggleSideBar;
	const setTip = useTipActions().push;

	return (
		<FlexDiv preset={Preset.RowBetween} padding={24}>
			<FlexDiv preset={Preset.Row} gap={16}></FlexDiv>
			<FlexDiv preset={Preset.Row} justify={'end'} gap={16}>
				<IconButton
					icon={'sidebar'}
					buttonSize={'l'}
					onClick={toggleSideBar}
					tooltip={'Sidebar'}
					onToolTip={setTip}
				/>
			</FlexDiv>
		</FlexDiv>
	);
}
