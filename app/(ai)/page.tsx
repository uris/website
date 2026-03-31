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
import { AIPanel } from '@/features/AIPanel/AIPanel';
import { useSidebarOpen } from '@/features/AIPanel/store/AiPanelStore';

export default function AiWorkspacePage() {
	const { height } = useWindow();
	const { current, isDark } = useTheme();
	const tipRef = useRef<HTMLDivElement>(null);
	const tip = useTip();
	const coords = useToolTip(tip, tipRef);
	const surface = current.colors['core-surface-primary'];
	const tinted = isDark ? tintFromColor(surface, -10) : surface;
	const sideBarOpen = useSidebarOpen();
	const toast = useToast();

	return (
		<FlexDiv preset={Preset.Window} height={height}>
			<FlexDiv preset={Preset.FillCenter} style={{ minWidth: 360 }}>
				<AIPanel />
			</FlexDiv>
			<FlexDiv preset={Preset.Draggable}>
				<DraggablePanel
					dragsRight={false}
					sizeConstraints={{ min: 360, max: 1, initial: 0.5 }}
					borderLeft={'1px solid var(--core-outline-primary)'}
					borderRight={'none'}
					dragHandleStyle={{ height: 24, width: 9 }}
					isClosed={!sideBarOpen}
					disableOnContext={false}
				>
					<FlexDiv
						preset={Preset.FillCenter}
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
