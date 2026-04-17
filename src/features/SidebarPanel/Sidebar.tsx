import { FlexDiv, Preset } from '@apple-pie/slice';
import { useCallback, useEffect } from 'react';
import { Content } from '@/features/SidebarPanel/Content';
import { Header } from '@/features/SidebarPanel/Header';
import { CallbackEvent, type ViEventMessage } from '@/stores/ai/_types';
import { ToolType } from '@/stores/ai/ai-tools/_types';
import { sendToolCallResultsItem } from '@/stores/ai/ViTalkCreateConvoItemFactory';
import { useViActions } from '@/stores/ai/viStore';
import { useHomeLayout } from '@/stores/home-layout/homeLayoutStore';
import { SidebarSurface } from '@/stores/sidebar/_types';
import { useSidebarActions } from '@/stores/sidebar/sidebarStore';

export function Sidebar() {
	const addViListener = useViActions().addViListener;
	const setSurface = useSidebarActions().setSurface;
	const setSidebar = useHomeLayout().toggleSideBar;
	const setProject = useSidebarActions().setProject;
	const setShowProject = useSidebarActions().setShowProject;

	// handle Vi view requests
	const handleViViewRequest = useCallback(
		(message?: ViEventMessage) => {
			console.log('event listener', { message });
			const { action_value, id } = message || {};
			const { view, slug } = action_value || {};
			let result: any = {
				view: null,
				project: null,
				success: false,
				reason: 'No valid view or project slug provided',
			};
			if (view !== undefined) {
				setSidebar(true); // show the sidebar
				setSurface(SidebarSurface[view]); // set a sidebar to projects
				if (slug) setProject(slug as any); // set the project to the slug
				if (slug) setShowProject(true); // show the project
				result = { view, project: slug, success: true };
			}
			if (id) sendToolCallResultsItem(result, id, true, ToolType.OpenView);
		},
		[setProject, setShowProject, setSidebar, setSurface],
	);

	// listen for vi view requests
	useEffect(() => {
		return addViListener(CallbackEvent.ViOpenView, handleViViewRequest);
	}, [handleViViewRequest, addViListener]);

	return (
		<FlexDiv preset={Preset.FillStart}>
			<Header />
			<Content />
		</FlexDiv>
	);
}
