import { FlexDiv, Preset, TabBar, type TabOption } from '@apple-pie/slice';
import { sidebarTabs } from '@/features/SidebarPanel/_consts';
import { useSidebarActions, useSurface } from '@/src/stores/sidebar/sidebarStore';

export function Header() {
	const setSurface = useSidebarActions().setSurface;
	const surface = useSurface();

	const handleChangeSurface = (option: TabOption) => {
		setSurface(option.value);
	};

	return (
		<FlexDiv preset={Preset.Row} justify={'center'} style={{ minWidth: 552 }}>
			<TabBar
				options={sidebarTabs}
				selected={surface}
				onTabChange={handleChangeSurface}
				tabWidth={'compact'}
				padding={'12px 12px'}
				border={true}
				width={'100%'}
				justify={'center'}
				tabGap={8}
			/>
		</FlexDiv>
	);
}
