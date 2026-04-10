import { FlexDiv, Preset } from '@apple-pie/slice';
import { ProjectGrid } from '@/src/components/GridList/ProjectGrid';

export function Content() {
	return (
		<FlexDiv preset={Preset.FillCenter} style={{ minWidth: 'calc(200px * 2 + 24px)' }}>
			<ProjectGrid />
		</FlexDiv>
	);
}
