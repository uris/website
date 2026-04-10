import { FlexDiv, Preset } from '@apple-pie/slice';
import { Content } from '@/features/SidebarPanel/Content';
import { Header } from '@/features/SidebarPanel/Header';

export function Sidebar() {
	return (
		<FlexDiv preset={Preset.FillStart}>
			<Header />
			<Content />
		</FlexDiv>
	);
}
