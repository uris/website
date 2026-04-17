import { FlexDiv, Preset } from '@apple-pie/slice';
import { useCallback, useEffect } from 'react';
import { Content } from '@/features/SidebarPanel/Content';
import { Header } from '@/features/SidebarPanel/Header';
import { CallbackEvent, type ViEventMessage } from '@/stores/ai/_types';
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

	// handle Vi project requests
	const handleViProjectRequest = useCallback(
		(message?: ViEventMessage) => {
			const { action_value, id } = message || {};
			let result: any = {
				projectView: null,
				success: false,
				reason: 'No valid project slug provided',
			};
			if (action_value?.slug) {
				setSidebar(true); // show the sidebar
				setSurface(SidebarSurface.Projects); // set a sidebar to projects
				setProject(action_value.slug); // set the project to the slug
				setShowProject(true); // show the project
				result = { projectView: action_value.slug, success: true };
			}
			if (id) sendToolCallResultsItem(result, id);
		},
		[setProject, setShowProject, setSidebar, setSurface],
	);

	// listen for vi project view requests
	useEffect(() => {
		return addViListener(CallbackEvent.ViOpenProjectView, handleViProjectRequest);
	}, [handleViProjectRequest, addViListener]);

	return (
		<FlexDiv preset={Preset.FillStart}>
			<Header />
			<Content />
		</FlexDiv>
	);
}
