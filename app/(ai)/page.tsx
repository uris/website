'use client';

import {
	DraggablePanel,
	FlexDiv,
	ModalController,
	Preset,
	Tip,
	Toast,
	useToolTip,
} from '@apple-pie/slice';
import { useWindow } from '@apple-pie/slice/hooks';
import { useTip, useToast } from '@apple-pie/slice/stores';
import { useRef } from 'react';
import { SETTINGS_CONSTRAINTS, SIDEBAR_CONSTRAINTS } from '@/app/(ai)/_defaults';
import { useSettingsOpen, useSidebarOpen } from '@/app/(ai)/store/layout-store';
import { AIPanel } from '@/features/AIPanel/AIPanel';
import { SettingsPanel } from '@/features/SettingsPanel/SettingsPanel';

export default function AiWorkspacePage() {
	const { height } = useWindow();
	const viewRef = useRef<HTMLDivElement>(null);
	const tipRef = useRef<HTMLDivElement>(null);
	const tip = useTip();
	const coords = useToolTip(tip, tipRef);
	const sideBarOpen = useSidebarOpen();
	const settingsOpen = useSettingsOpen();
	const toast = useToast();

	return (
		<FlexDiv
			preset={Preset.Window}
			height={height}
			justify={'center'}
			align={'center'}
			ref={viewRef}
		>
			<FlexDiv preset={Preset.Draggable}>
				<DraggablePanel
					drags={'right'}
					sizeConstraints={SETTINGS_CONSTRAINTS}
					isClosed={!settingsOpen}
					dragHandle={false}
				>
					<FlexDiv
						preset={Preset.FillStart}
						scrollBox
						background={'var(--core-surface-primary-tint)'}
						style={{ minWidth: 280 }}
					>
						<SettingsPanel />
					</FlexDiv>
				</DraggablePanel>
			</FlexDiv>
			<FlexDiv preset={Preset.FillCenter} scrollBox style={{ minWidth: 360 }}>
				<AIPanel />
				<Toast {...toast} container={'parent'} />
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
						background={'var(--core-surface-primary-tint)'}
						style={{ maxWidth: 'calc(100vw - 360px)' }}
					>
						Side Panel
					</FlexDiv>
				</DraggablePanel>
			</FlexDiv>
			<Tip tip={tip} coords={coords} ref={tipRef} />
			<ModalController dragConstraintsRef={viewRef} draggable={true} />
		</FlexDiv>
	);
}
