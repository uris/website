import { FlexDiv, Preset } from '@apple-pie/slice';
import RouteLoader from '@/projects/renderers/Loading';

export default function Loading() {
	return (
		<FlexDiv preset={Preset.Window} justify="center" align="center">
			<RouteLoader />
		</FlexDiv>
	);
}
