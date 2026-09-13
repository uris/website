import { Button, Icon } from '@apple-pie/slice';
import { useBrowserChannelActions, useIsActiveChannel } from '@apple-pie/slice/stores';
import { useCallback } from 'react';
import { FrameEvent, type WorkChannelMessage } from '@/components/ProjectFrame/ProjectFrame';
import { ProjectTitle } from '@/components/ProjectTitle/ProjectTitle';
import { Section } from '@/components/Section/Section';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { Wrapper } from '@/projects/_helpers/Wrapper';

export default function ComingSoon() {
	const post = useBrowserChannelActions().post;
	const isWorkActive = useIsActiveChannel('work');

	// tell parent window to navigate to contacts
	const handleNotify = useCallback(() => {
		const message: WorkChannelMessage = { event: FrameEvent.CHILD_EVENT, type: 'navigate-contact' };
		if (isWorkActive) post('work', message);
	}, [post, isWorkActive]);

	return (
		<Wrapper>
			<Section gradient={false}>
				<div style={{ margin: '0 0 128px 0' }}>
					<Icon name="clock" size={32} />
				</div>
				<ProjectTitle>Coming soon ...</ProjectTitle>
				<SubTitle margin={false}>
					This project is currently a work in progress but it'll be worth the wait - be assured I'm working as fast as I
					can.
				</SubTitle>
				<div style={{ textAlign: 'left', width: '100%', maxWidth: '600px' }}>
					<Button
						label={`Notify me when it's available`}
						size={'large'}
						variant={'text'}
						labelSize={'l'}
						underline
						labelColor={'var(--core-link-primary)'}
						iconLeft={'mail'}
						iconColor={'var(--core-link-primary)'}
						onClick={handleNotify}
					/>
				</div>
			</Section>
		</Wrapper>
	);
}
