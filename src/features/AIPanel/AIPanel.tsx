import { FlexDiv, Preset } from '@apple-pie/slice';
import { AIPanelBody } from '@/features/AIPanel/AIPanelBody';
import { AIPanelFooter } from '@/features/AIPanel/AIPanelFooter';
import { AIPanelHeader } from '@/features/AIPanel/AIPanelHeader';

export function AIPanel() {
	return (
		<FlexDiv preset={Preset.FillCenter}>
			<AIPanelHeader />
			<AIPanelBody />
			<AIPanelFooter />
		</FlexDiv>
	);
}
