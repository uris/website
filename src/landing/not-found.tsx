'use client';

import { Button, FlexDiv, Preset } from '@apple-pie/slice';
import { useWindow } from '@apple-pie/slice/hooks';
import { ProjectTitle } from '@/components/ProjectTitle/ProjectTitle';
import { SubTitle } from '@/components/SubTitle/SubTitle';

export default function NotFound() {
	const { height } = useWindow();
	return (
		<FlexDiv preset={Preset.Window} height={height} justify={'center'} align={'center'} direction={'column'}>
			<SubTitle maxWidth={640} marginSize={16}>
				404 old jedi mind trick ...
			</SubTitle>
			<ProjectTitle maxWidth={640}>This is not the page I'm looking for ...</ProjectTitle>
			<div style={{ textAlign: 'left', width: '100%', maxWidth: 640 }}>
				<Button
					label={`Move along ...`}
					size={'large'}
					variant={'text'}
					labelSize={'l'}
					underline
					labelColor={'var(--core-link-primary)'}
					iconLeft={'home'}
					iconColor={'var(--core-link-primary)'}
					onClick={() => (window.location.href = '/')}
				/>
			</div>
		</FlexDiv>
	);
}
