'use client';

import {
	DraggablePanel,
	FlexDiv,
	Preset,
	Tip,
	Toast,
	useTheme,
	useToolTip,
} from '@apple-pie/slice';
import { useWindow } from '@apple-pie/slice/hooks';
import { useTip, useToast } from '@apple-pie/slice/stores';
import { tintFromColor } from '@apple-pie/slice/utils';
import { useRef } from 'react';
import { SETTINGS_CONSTRAINTS, SIDEBAR_CONSTRAINTS } from '@/app/(ai)/_defaults';
import { useSettingsOpen, useSidebarOpen } from '@/app/(ai)/store/layout-store';
import { AIPanel } from '@/features/AIPanel/AIPanel';
import { SettingsPanel } from '@/features/SettingsPanel/SettingsPanel';

export default function AiWorkspacePage() {
	const { height } = useWindow();
	const { current, isDark } = useTheme();
	const tipRef = useRef<HTMLDivElement>(null);
	const tip = useTip();
	const coords = useToolTip(tip, tipRef);
	const surface = current.colors['core-surface-primary'];
	const tinted = tintFromColor(surface, isDark ? -20 : -1.1);
	const sideBarOpen = useSidebarOpen();
	const settingsOpen = useSettingsOpen();
	const toast = useToast();

	return (
		<FlexDiv preset={Preset.Window} height={height}>
			<FlexDiv preset={Preset.Draggable}>
				<DraggablePanel
					drags={'right'}
					sizeConstraints={SETTINGS_CONSTRAINTS}
					isClosed={!settingsOpen}
					dragHandle={false}
				>
					<FlexDiv preset={Preset.FillStart} scrollBox background={tinted}>
						<SettingsPanel />
					</FlexDiv>
				</DraggablePanel>
			</FlexDiv>
			<FlexDiv preset={Preset.FillCenter} style={{ minWidth: 360 }}>
				<AIPanel />
			</FlexDiv>
			<FlexDiv preset={Preset.Draggable}>
				<DraggablePanel
					drags={'left'}
					sizeConstraints={SIDEBAR_CONSTRAINTS}
					isClosed={!sideBarOpen}
				>
					<FlexDiv
						preset={Preset.FillStart}
						scrollBox
						background={tinted}
						style={{ maxWidth: 'calc(100vw - 360px)' }}
					>
						Side Panel
					</FlexDiv>
				</DraggablePanel>
			</FlexDiv>
			<Tip tip={tip} coords={coords} ref={tipRef} />
			<Toast {...toast} />
		</FlexDiv>
	);
}
