'use client';

import { Button, Label } from '@apple-pie/slice';
import { DataButton, DataButtonGrid } from '@/components/DataButtons/DataButtons';
import { HeroImage } from '@/components/HeroImage/HeroImage';
import { LinkList } from '@/components/LinkList/LinkList';
import { Logo } from '@/components/Logos/Logos';
import { ProjectHighlight } from '@/components/ProjectHighlight/ProjectHighlight';
import { ProjectTitle } from '@/components/ProjectTitle/ProjectTitle';
import { Section } from '@/components/Section/Section';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { TechStack } from '@/components/TechStack/TechStack';
import { TextLinkList } from '@/components/TextLinkList/TextLinkList';
import { TextParagraph } from '@/components/TextParagraph/TextParagraph';
import { TextTitle } from '@/components/TextTitle/TextTitle';
import { VideoButton } from '@/components/VideoButton/VideoButton';
import { Wrapper } from '@/projects/_helpers/Wrapper';
import { themedImages } from '@/projects/content/rc-video/images';
import { normalizeTarget } from '@/utils/misc';
import projectJson from './project.json';
import { videos } from './videos';

export default function RcVideo() {
	const header = projectJson.header || {};

	return (
		<Wrapper>
			<Section gradient={false}>
				<Logo name={'rc'} color={'var(--core-icon-primary)'} size={64} margin={'0 0 64px 0'} />
				<ProjectTitle>{header.title}</ProjectTitle>
				<SubTitle margin={false}>{header.subtitle}</SubTitle>
				<HeroImage
					heroImage={themedImages.hero}
					backgroundImage={themedImages.heroBG}
					border={false}
					heroAltText={
						'RingCentral Video meeting view with three portrait-oriented participants, emphasizing a more personal and human meeting experience.'
					}
				/>
				<TechStack>
					{header.techStack.map((item) => {
						return <Label key={item}>{item}</Label>;
					})}
				</TechStack>
				<LinkList direction={'row'}>
					{header.links.map((link) => {
						return (
							<Button
								key={`${link.label}_${link.href}`}
								link={link.href}
								target={normalizeTarget(link.target)}
								iconLeft={link.iconLeft}
							>
								{link.label}
							</Button>
						);
					})}
				</LinkList>
			</Section>
			<Section>
				<ProjectTitle>The challenge</ProjectTitle>
				<SubTitle marginSize={16}>"Houston, we have a problem."</SubTitle>
				<SubTitle marginSize={16}>
					Post-pandemic video-meeting engagement was declining while phone usage trended in the opposite direction.
					Video and meetings were still key to strategic positioning and growth beyond phone.
				</SubTitle>
				<SubTitle>
					Research suggested that the problem extended beyond the meeting window. The team needed to understand what
					made a meeting worth joining, not just what might increase attendance.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.charts}
					dropShadow={false}
					border={false}
					heroMargin={0}
					standAlone={true}
					heroAltText={
						'Four trend charts showing changes in calls, calls per active user, meetings joined, and meetings per active user.'
					}
				/>
			</Section>
			<Section>
				<ProjectTitle>Root Causes</ProjectTitle>
				<SubTitle>
					Research showed there was no single factor driving meeting-usage trends. Solving the problem for customers
					required looking well beyond the meeting window.
				</SubTitle>
				<ProjectHighlight
					themedImage={themedImages.covid}
					alt={'Chart showing the decline in video meetings post-pandemic.'}
				>
					<TextTitle>Return to Office</TextTitle>
					<TextParagraph>
						<p>
							The return to office changed the role of digital meetings. In-person work brought back the value of quick,
							informal, face-to-face conversations and made every interaction less likely to begin as a scheduled video
							call.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.users}
					reverse
					alt={
						'Meeting interface with participant tiles, live notes, reactions, and attendance details showing the complexity of in-meeting coordination.'
					}
					imageBackground={'var(--core-surface-primary)'}
				>
					<TextTitle>Self-inflicted: poor usability</TextTitle>
					<TextParagraph marginSize={16}>
						<p>
							Video quality, reliability, and awkward interaction patterns can make digital communication feel like an
							effort rather than a useful way to work together.
						</p>
					</TextParagraph>
					<TextLinkList>
						<VideoButton videoProps={videos.aiSummaries}>AI Summaries [00:35]</VideoButton>
						<VideoButton videoProps={videos.aiAccuracy}>AI Accuracy [00:24]</VideoButton>
					</TextLinkList>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.competition}
					imageBackground={'var(--core-surface-primary)'}
					nomargin
					alt={'Logos for several video-meeting competitors, including Zoom, Teams, Meet, and Around.'}
				>
					<TextTitle>Competitive Landscape</TextTitle>
					<TextParagraph marginSize={16}>
						<p>
							Through the pandemic, alternative platforms for digital meetings mushroomed, many with highly relevant
							value propositions.
						</p>
					</TextParagraph>
					<TextLinkList>
						<VideoButton videoProps={videos.about}>About (Miro) [00:35]</VideoButton>
						<VideoButton videoProps={videos.sessions}>Sessions [00:52]</VideoButton>
					</TextLinkList>
				</ProjectHighlight>
			</Section>
			<Section>
				<ProjectTitle>Time wasted in meetings</ProjectTitle>
				<SubTitle>
					The more persistent concern, extending beyond the pandemic, was time wasted in meetings that lacked a clear
					purpose or meaningful business outcome.
				</SubTitle>
				<DataButtonGrid marginSize={0}>
					<DataButton value={'24 billion hrs.'} label={'wasted time in meetings'} />
					<DataButton value={'65% Employees'} label={'meetings prevent work'} />
					<DataButton value={'55% Employees'} label={'could have been an email'} />
					<DataButton value={'75% Remote'} label={`unable to collaborate effectively`} />
					<DataButton value={'42% Employees'} label={'experiencing meeting fatigue'} />
				</DataButtonGrid>
			</Section>
			<Section>
				<ProjectTitle>Anti-Meeting</ProjectTitle>
				<SubTitle>
					Because sometimes the best meetings are no meetings. More focus and time to get meaningful work done.
				</SubTitle>
				<ProjectHighlight
					themedImage={themedImages.sayno}
					alt={
						'Meeting details flow for declining attendance while sending an assistant to track selected topics and provide follow-up.'
					}
				>
					<TextTitle>It&apos;s okay to say "no"</TextTitle>
					<TextParagraph>
						<p>
							Declining a meeting should not mean falling out of the conversation. A person can send a virtual assistant
							in their place, specify what matters to them, and receive a useful follow-up.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.record}
					reverse
					nomargin
					alt={
						'Recording setup that lets someone share a desktop, messages, whiteboard, or part of the screen for async collaboration.'
					}
				>
					<TextTitle>Async Meetings</TextTitle>
					<TextParagraph>
						<p>Send out recordings of materials and presentations.</p>
						<p>
							Meet async, allowing people to move directly to the moments that matter, leave comments, ask questions,
							and mark follow-up work.
						</p>
					</TextParagraph>
				</ProjectHighlight>
			</Section>
			<Section>
				<ProjectTitle>Pre-meeting</ProjectTitle>
				<SubTitle>Because success is often the flip side of preparation and setup.</SubTitle>
				<ProjectHighlight
					themedImage={themedImages.templates}
					alt={
						'Meeting calendar beside a gallery of meeting templates for standups, collaboration sessions, presentations, and team socials.'
					}
				>
					<TextTitle>Set up the meeting for the work</TextTitle>
					<TextParagraph>
						<p>
							Use meeting templates for common situations such as stand-ups, one-on-ones, and social sessions. The
							structure of the meeting should help the work rather than starting from a blank, generic call. People can
							also create templates that fit their own team rituals.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.prep}
					reverse
					alt={
						'Pre-join screen with portrait video, location, local time, weather, and appearance filters for how someone shows up in a meeting.'
					}
				>
					<TextTitle>Total control over how you show up</TextTitle>
					<TextParagraph>
						<p>
							Personal details, visual treatments, location, time zone, and local weather can provide useful context
							before someone speaks. The goal is to help people feel professional and recognizable without asking them
							to perform for the camera.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.novideo}
					nomargin
					alt={
						'Video meeting with a custom no-video status card showing that a participant is following along without being on camera.'
					}
				>
					<TextTitle>No Video? No problem.</TextTitle>
					<TextParagraph>
						<p>
							People sometimes need to turn off video. The experience makes that choice clearer to others, reducing the
							ambiguity and anxiety that can come from a blank tile.
						</p>
					</TextParagraph>
				</ProjectHighlight>
			</Section>
			<Section>
				<ProjectTitle>In Meeting</ProjectTitle>
				<SubTitle>Making the meeting experience more human, focused, and effective.</SubTitle>
				<ProjectHighlight
					themedImage={themedImages.portrait}
					alt={
						'Three-person meeting displayed in portrait-oriented video tiles that keep attention on faces rather than backgrounds.'
					}
				>
					<TextTitle>Portrait video</TextTitle>
					<TextParagraph>
						<p>
							Show up with the information that helps people communicate effectively, not everything in the background.
							Portrait video creates a more intentional, personal meeting presence.
						</p>
						<p>For most of our SMB customers, work happens outside the office, making portrait video a natural fit.</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.floating}
					reverse
					alt={
						'Compact floating meeting window staying visible over a presentation so someone can work while following the call.'
					}
				>
					<TextTitle>Float mode</TextTitle>
					<TextParagraph>
						<p>
							People often need to follow a meeting while working in another application. A floating view helps them
							stay connected without forcing the meeting to take over the entire screen.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.express}
					imageHeight={400}
					alt={'Meeting interface showing participants reacting expressively even while muted.'}
				>
					<TextTitle>Express yourself, even when muted</TextTitle>
					<TextParagraph>
						<p>
							Animated reactions make lightweight responses more expressive. Smart reactions can detect signals such as
							laughter or clapping while someone is muted, allowing them to respond without interrupting the
							conversation.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.nightandday}
					reverse
					noborder
					alt={'The same meeting shown in dark and light modes to suit different work environments and times of day.'}
				>
					<TextTitle>A meeting that responds to its environment</TextTitle>
					<TextParagraph>
						<p>
							Light and dark modes let the product feel appropriate in different work conditions rather than assuming
							that every meeting happens in a dark interface.
						</p>
						<p>
							They can also automatically follow the time of day to provide cues to others that you might be working
							overtime.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.summaries}
					alt={
						'Meeting interface with auto-generated notes, attachments, mentions, and reactions organized alongside the call.'
					}
				>
					<TextTitle>Notes and summaries without the burden</TextTitle>
					<TextParagraph>
						<p>
							Auto-note suggestions using voice recognition reduce the pressure to capture every detail while trying to
							participate in the conversation.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.hybrid}
					reverse
					alt={
						'Hybrid meeting setup that identifies several in-room participants from a shared conference-room camera.'
					}
				>
					<TextTitle>Hybrid-friendly participation</TextTitle>
					<TextParagraph>
						<p>
							Multiple people sharing one camera can be difficult to follow. The experience explores ways to make
							in-room participants more visible and understandable to remote attendees.
						</p>
					</TextParagraph>
				</ProjectHighlight>
			</Section>
			<Section>
				<ProjectTitle>Post meeting</ProjectTitle>
				<SubTitle>
					This could be the beginning of a beautiful conversation. A meeting should leave behind clear context, useful
					follow-up, and a path for people who could not attend to catch up quickly.
				</SubTitle>
				<ProjectHighlight
					themedImage={themedImages.meetingsummary}
					nomargin
					alt={
						'Meeting summary view with shared notes, transcript details, hashtags, mentions, and a linked team message thread.'
					}
				>
					<TextTitle>Carry the conversation forward</TextTitle>
					<TextParagraph>
						<p>
							After a meeting, a summary makes it easier to revisit what happened or catch up after declining.
							Decisions, notes, and follow-ups can be shared into the team's messages so the meeting remains part of the
							larger conversation instead of an isolated event.
						</p>
					</TextParagraph>
				</ProjectHighlight>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>What we intentionally did not optimize for</ProjectTitle>
				<SubTitle marginSize={16}>
					<strong>Not more meetings:</strong> Attendance or call volume is not a proxy for productive communication.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not video at all costs:</strong> People need legitimate, visible ways to join without video or decide
					not to join at all.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not remote-only work:</strong> The experience accounts for in-person and hybrid dynamics as
					first-class meeting contexts.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not meeting notes as an afterthought:</strong> Catch-up, context, and follow-up are part of the core
					experience.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Not etiquette as a policy document:</strong> The product can make considerate meeting behavior easier
					through its interaction model and controls.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>My role</ProjectTitle>
				<SubTitle marginSize={16}>
					At RingCentral, I helped reframe and design the meetings experience across the full lifecycle: research and
					problem framing, product and interaction design, visual design, motion and sound explorations, and early
					implementation work.
				</SubTitle>
				<SubTitle margin={false}>
					The work demonstrates how I approach collaboration products: question the metric behind the brief, understand
					the human and social friction around the workflow, and design an experience that respects attention as much as
					it enables connection.
				</SubTitle>
			</Section>
		</Wrapper>
	);
}
