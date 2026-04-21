'use client';

import { DraggablePanel, FlexDiv, ModalController, Preset, Tip, Toast, useToolTip } from '@apple-pie/slice';
import { useWindow } from '@apple-pie/slice/hooks';
import { useTip, useToast } from '@apple-pie/slice/stores';
import { useEffect, useRef } from 'react';
import { AIPanel } from '@/features/AIPanel/AIPanel';
import { SettingsPanel } from '@/features/SettingsPanel/SettingsPanel';
import { Sidebar } from '@/features/SidebarPanel/Sidebar';
import { SETTINGS_CONSTRAINTS, SIDEBAR_CONSTRAINTS } from '@/stores/home-layout/_defaults';
import { useHomeLayout, useSettingsOpen, useSidebarOpen } from '@/stores/home-layout/homeLayoutStore';

interface HomeProps {
	projects: any[];
}

export default function Home(props: Readonly<HomeProps>) {
	const { projects } = props;
	const { height } = useWindow();
	const viewRef = useRef<HTMLDivElement>(null);
	const tipRef = useRef<HTMLDivElement>(null);
	const tip = useTip();
	const coords = useToolTip(tip, tipRef);
	const sideBarOpen = useSidebarOpen();
	const settingsOpen = useSettingsOpen();
	const toast = useToast();
	const loadProjects = useHomeLayout().setProjects;
	const setDraggingSidebar = useHomeLayout().setDraggingSidebar;

	// set initial projects data
	useEffect(() => loadProjects(projects), [loadProjects, projects]);

	return (
		<FlexDiv preset={Preset.Window} height={height} justify={'start'} align={'center'} ref={viewRef}>
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
				<Toast key={toast?.notifId} {...toast} container={'parent'} />
			</FlexDiv>
			<FlexDiv preset={Preset.Draggable}>
				<DraggablePanel
					drags={'left'}
					sizeConstraints={SIDEBAR_CONSTRAINTS}
					isClosed={!sideBarOpen}
					containerRef={viewRef}
					onResizeStart={() => setDraggingSidebar(true)}
					onResizeEnd={() => setDraggingSidebar(false)}
				>
					<FlexDiv
						preset={Preset.FillStart}
						scrollBox
						background={'var(--core-surface-primary-tint)'}
						style={{ maxWidth: 'calc(100vw - 360px)' }}
					>
						<Sidebar />
					</FlexDiv>
				</DraggablePanel>
			</FlexDiv>
			<Tip tip={tip} coords={coords} ref={tipRef} />
			<ModalController dragConstraintsRef={viewRef} draggable={true} />
		</FlexDiv>
	);
}
