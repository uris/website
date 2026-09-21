'use client';

import { Label } from '@apple-pie/slice';
import { useState } from 'react';
import { DataButton, DataButtonGrid } from '@/components/DataButtons/DataButtons';
import { HeroImage } from '@/components/HeroImage/HeroImage';
import { Logo } from '@/components/Logos/Logos';
import { ProjectHighlight } from '@/components/ProjectHighlight/ProjectHighlight';
import { ProjectTitle } from '@/components/ProjectTitle/ProjectTitle';
import { Section } from '@/components/Section/Section';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { Table } from '@/components/Table/Table';
import { TechStack } from '@/components/TechStack/TechStack';
import { TextParagraph } from '@/components/TextParagraph/TextParagraph';
import { TextTitle } from '@/components/TextTitle/TextTitle';
import { UserGrid } from '@/components/UserCard/UserCard';
import { VideoButton } from '@/components/VideoButton/VideoButton';
import { Wrapper } from '@/projects/_helpers/Wrapper';
import {
	performanceData,
	performanceDefinitions,
	preferenceData,
	preferenceDefinitions,
} from '@/projects/content/rc-phone/data';
import { themedImages } from '@/projects/content/rc-phone/images';
import projectJson from '@/projects/content/rc-phone/project.json';
import { userCards } from '@/projects/content/rc-phone/users';
import { videos } from '@/projects/content/rc-phone/videos';

export default function RcPhone() {
	const header = projectJson.header || {};
	const [workChannel, setWorkChannel] = useState<string>('');

	return (
		<Wrapper getChannelName={setWorkChannel}>
			<Section gradient={false}>
				<Logo name={'rc'} color={'var(--core-icon-primary)'} size={64} margin={'0 0 64px 0'} />
				<ProjectTitle>{header.title}</ProjectTitle>
				<SubTitle margin={false}>
					At RingCentral I led the redesign of the core communications and productivity app we call MVP (message, video,
					phone). The first release focused on a responsive, phone-first desktop experience, offered to eligible
					customers on an opt-in basis.
				</SubTitle>
				<HeroImage
					videoURL={videos.heroVideo.src}
					videoControls={'simple'}
					videoLoop={true}
					videoPlaying={true}
					backgroundImage={themedImages.heroBG}
					border={false}
					heroAltText={'RingCentral phone app redesign showing the responsive communications workspace.'}
				/>
				<TechStack>
					{header.techStack.map((item) => {
						return <Label key={item}>{item}</Label>;
					})}
				</TechStack>
			</Section>
			<Section>
				<ProjectTitle>Foundational insights.</ProjectTitle>
				<SubTitle>
					Our work was rooted in customer needs and pain points. Through direct observation and one-on-one
					conversations, we got insight into the blockers and inhibitors of getting work done with RingCentral. We also
					discovered work accelerators.
				</SubTitle>
				<UserGrid cards={userCards} showVideo={false} cardHeight={300} marginSize={32} />
				<VideoButton
					label={`Preview Dale's story [2:41]`}
					videoProps={videos.dale}
					channelName={workChannel}
					margin={true}
				/>
				<SubTitle>
					The team also reviewed and synthesized customer feedback and analytics in the form of NPS feedback, usage
					analytics and behavior as well as user testing.
				</SubTitle>
				<DataButtonGrid maxButtons={2} margin={false}>
					<DataButton value={'1000+'} label={'NPS/review feedback comments'} />
					<DataButton value={'400+'} label={'users and customers engaged'} />
					<DataButton value={'100+'} label={'user testing and usability sessions'} />
					<DataButton value={'100+'} label={'hrs. of customer conversations'} />
				</DataButtonGrid>
			</Section>
			<Section>
				<ProjectTitle>Emerging themes</ProjectTitle>
				<SubTitle>
					While there was a wealth of information, data surprisingly coalesced around a few things indicating a clear
					signal from customers on what needed to improve.
				</SubTitle>
				<SubTitle marginSize={24}>
					<h5 style={{ margin: 0, color: 'var(--core-text-special)' }}>1. Make work less work.</h5>
					Navigation is complex, not well organized, and requires too many clicks. It takes too much time to learn and
					to move around. The app takes too much space for what I use it for.
				</SubTitle>
				<SubTitle marginSize={24}>
					<h5 style={{ margin: 0, color: 'var(--core-text-special)' }}>2. One size doesn't fit ... well.</h5>
					Most customers used a fraction of all our capabilities. Everything else was just in the way of getting things
					done efficiently and effectively and learning to use RingCentral.
				</SubTitle>
				<SubTitle marginSize={24}>
					<h5 style={{ margin: 0, color: 'var(--core-text-special)' }}>3. Reduce the noise.</h5>
					Confusing options, duplication, and irrelevant features packed into every screen create complexity and can
					feel overwhelming, reducing discoverability and usability.
				</SubTitle>
				<SubTitle marginSize={24}>
					<h5 style={{ margin: 0, color: 'var(--core-text-special)' }}>4. Don't interrupt! Pixels are precious.</h5>
					In meetings, on the phone, or even heads down, customers are always multitasking, often using multiple screens
					to lay out work. Our current app demands real estate and interrupts flow.
				</SubTitle>
				<SubTitle marginSize={64}>
					<h5 style={{ margin: 0, color: 'var(--core-text-special)' }}>5. Old and quirky ...</h5>
					The look and feel, patterns, and general aesthetics make the app feel clunky and dated. Familiar mobile
					patterns are ignored.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.old}
					dropShadow={false}
					border={false}
					heroMargin={0}
					standAlone={true}
					heroAltText={'RingCentral desktop app before the redesign.'}
				/>
			</Section>
			<Section>
				<ProjectTitle>Adaptive. Modular.</ProjectTitle>
				<TextParagraph>
					<p>
						These examples show the broader design effort, not just the first release. Video, internal team messaging,
						tasks, fax, and the switchboard-style phone experience were deferred from that release.
					</p>
				</TextParagraph>
				<SubTitle marginSize={24}>
					A workspace set up to focus on what you need and to lay it all out just the way you need it.
				</SubTitle>
				<SubTitle>
					Everyone has their own way of organizing and setting up their workflow. And most of the time, when you do the
					same things 100s of times a day, it's the small things that can block or accelerate productivity and mark the
					difference between delight and frustration.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.adaptive}
					imgBackgroundColor={'transparent'}
					dropShadow={false}
					border={false}
					heroMargin={0}
					standAlone={true}
					heroAltText={'Modular RingCentral phone workspace arranged in compact windows.'}
				/>
			</Section>
			<Section>
				<ProjectTitle>Familiar and uncluttered</ProjectTitle>
				<SubTitle marginSize={24}>
					Reduction of complexity with intuitive organization and progressive discovery of features and options as you
					need them in the context of the task at hand.
				</SubTitle>
				<SubTitle>
					The new experience removes irrelevant options from view and progressively discloses what you need when and
					where you need them. Overflow and context menus bring buried options into context without increasing overall
					complexity.
				</SubTitle>
				<ProjectHighlight
					themedImage={themedImages.effortless}
					noborder
					alt={'Uncluttered RingCentral phone interface with frequent tasks in focus.'}
				>
					<TextTitle>Effortless.</TextTitle>
					<TextParagraph>
						<p>
							Work flows naturally and effortlessly with a UI that is immediately recognizable, uncluttered and clear.
						</p>
						<p>
							For a customer base focused on phone, making phone the primary focus seemed obvious. Sometimes a spade is
							just a spade.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					reverse
					videoURL={videos.natural.src}
					imageBackground={'#ffffff'}
					videoControls={'simple'}
					videoLoop={true}
					videoPlaying={true}
					padding={'0 16px 16px 16px'}
					coverUpLeft={13}
					nomargin
					alt={'Prototype demonstrating drag-and-drop call interactions.'}
				>
					<TextTitle>Natural and physical.</TextTitle>
					<TextParagraph>
						<p>
							Objects and spaces of the app have a familiar sense of physicality. They can be dragged together and react
							to each other in intuitive ways. Like drag-and-drop to start a call, adding callers or meeting
							participants, merging calls and even forwarding calls.
						</p>
					</TextParagraph>
				</ProjectHighlight>
			</Section>
			<Section>
				<ProjectTitle>Created for the multi-tasker.</ProjectTitle>
				<SubTitle marginSize={24}>
					The new RingCentral embraces the fact it is simply one of the many tools people use to get stuff done, and
					that dynamic switching of focus from one app to another is a constant.
				</SubTitle>
				<ProjectHighlight
					videoURL={videos.resize.src}
					imageBackground={'#ffffff'}
					videoControls={'simple'}
					videoLoop={true}
					videoPlaying={true}
					padding={12}
					coverUpTop={10}
					coverUpLeft={10}
					nomargin
					alt={'RingCentral phone layout resizing to fit the available workspace.'}
				>
					<TextTitle>Responsive to fit any workspace.</TextTitle>
					<TextParagraph>
						<p>
							We created an interactive framework that can shrink and grow, helping manage limited screen real estate
							for maximum efficiency.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					videoURL={videos.popout.src}
					imageBackground={'#ffffff'}
					videoControls={'simple'}
					videoLoop={true}
					videoPlaying={true}
					padding={'0 8px 16px 16px'}
					coverUpLeft={14}
					coverUpTop={-2}
					alt={'Phone tools arranged in separate pop-out windows.'}
					nomargin
				>
					<TextTitle>Pop-out framework to help focus and simplify choices.</TextTitle>
					<TextParagraph>
						<p>
							By creating modules that disassemble, we hit both simplicity and the ability to remove the clutter of
							those features you don't need.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					videoURL={videos.hud.src}
					imageBackground={'#ffffff'}
					videoControls={'simple'}
					videoLoop={true}
					videoPlaying={true}
					padding={14}
					coverUpLeft={14}
					nomargin
					alt={'Expanded phone workspace concept for handling more information.'}
				>
					<TextTitle>Scaling up for maximum space and efficiency.</TextTitle>
					<TextParagraph>
						<p>
							The experience scales down, but it also scales up for the situation where more information and data boost
							speed of work.
						</p>
					</TextParagraph>
				</ProjectHighlight>
			</Section>
			<Section>
				<ProjectTitle>Cohesive and portable.</ProjectTitle>
				<SubTitle marginSize={24}>
					Enhanced usability and learnability by porting interactions across form factors and apps.
				</SubTitle>
				<ProjectHighlight
					nomargin
					themedImage={themedImages.portable}
					noborder
					alt={'Phone interface concepts across devices and third-party apps.'}
				>
					<TextTitle>On mobile, desktop, web and 3rd party, it all works the same way.</TextTitle>
					<TextParagraph>
						<p>
							Whether you're making calls from Microsoft Teams, or viewing customer information on Salesforce, dialing
							from your browser, or using a RingCentral app, the aim is a familiar experience.
						</p>
					</TextParagraph>
				</ProjectHighlight>
			</Section>
			<Section>
				<ProjectTitle>Modern and progressive.</ProjectTitle>
				<SubTitle>
					A design language that brings the familiar and intuitive design elements of consumer experiences to the
					workplace.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.modern}
					dropShadow={false}
					heroMargin={0}
					standAlone={true}
					heroAltText={'RingCentral phone app redesign showing the responsive communications workspace.'}
				/>
			</Section>
			<Section>
				<ProjectTitle>Outcomes</ProjectTitle>
				<SubTitle>
					We measured usability and preference for the existing app and the proposed experience. Most tasks improved,
					though sending a message took slightly longer and calling by name averaged more errors.
				</SubTitle>
				<Table
					caption={'User Performance (N = 56)'}
					tableData={performanceData}
					columnDefinitions={performanceDefinitions}
				/>
				<Table
					caption={'User Preference (N = 102)'}
					tableData={preferenceData}
					columnDefinitions={preferenceDefinitions}
				/>
				<h6>Direct Feedback</h6>
				<HeroImage
					videoURL={videos.outcomes.src}
					dropShadow={false}
					border={false}
					heroMargin={0}
					standAlone={true}
					videoPlaying={false}
					heroAltText={'Customer feedback on the redesigned RingCentral phone experience.'}
				/>
			</Section>
		</Wrapper>
	);
}
