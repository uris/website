import { FlexDiv, Preset } from '@apple-pie/slice';
import { ProjectGrid } from '@/src/components/ProjectGrid/ProjectGrid';

export function Content() {
	return (
		<FlexDiv preset={Preset.FillCenter}>
			<ProjectGrid staggerSeed={0.2} />
		</FlexDiv>
	);
}
