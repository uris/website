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
import { TextParagraph } from '@/components/TextParagraph/TextParagraph';
import { TextTitle } from '@/components/TextTitle/TextTitle';
import { Wrapper } from '@/projects/_helpers/Wrapper';
import { themedImages } from '@/projects/content/rc-video/images';
import { normalizeTarget } from '@/utils/misc';
import projectJson from './project.json';

export default function RcVideo() {
	const header = projectJson.header || {};

	return (
		<Wrapper>
			<Section gradient={false}>
				<Logo name={'rc'} color={'var(--core-icon-primary)'} size={64} margin={'0 0 64px 0'} />
				<ProjectTitle>{header.title}</ProjectTitle>
				<SubTitle margin={false}>{header.subtitle}</SubTitle>
				<HeroImage
					heroImage={themedImages.placeholder}
					backgroundImage={themedImages.heroBG}
					border={false}
					heroAltText={
						'Slice UI Kit interface, component code, and browser runtime capabilities shown as one composable React system.'
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
				<SubTitle marginSize={16}>"Huston, we have a problem."</SubTitle>
				<SubTitle marginSize={16}>
					Post-pandemic video-meeting engagement was declining while phone usage trended in the opposite direction.
					Video and meetings were still key to strategic positioning and growth beyond phone.
				</SubTitle>
				<SubTitle>
					Research suggested that the problem extended beyond the meeting window. The team needed to understand what
					made a meeting worth joining, not just what might increase attendance.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.placeholder}
					dropShadow={false}
					border={true}
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
					themedImage={themedImages.placeholder}
					alt={'Chart showing the decline in video meetings post-pandemic.'}
				>
					<TextTitle>Return To Office</TextTitle>
					<TextParagraph>
						<p>
							The return to office changed the role of digital meetings. In-person work brought back the value of quick,
							informal, face-to-face conversations and made every interaction less likely to begin as a scheduled video
							call.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight themedImage={themedImages.placeholder} reverse alt={'User research insights.'}>
					<TextTitle>Self Inflicted - Poor Usability</TextTitle>
					<TextParagraph>
						<p>
							Video quality, reliability, and awkward interaction patterns can make digital communication feel like an
							effort rather than a useful way to work together.
						</p>
						<p>Availability and connection quality were the most important "features."</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					nomargin
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
				>
					<TextTitle>Competitive Landscape</TextTitle>
					<TextParagraph>
						<p>
							Through the pandemic, the availability of alternative platforms for conducting digital meetings
							mushroomed. Some with very relevant value props.
						</p>
					</TextParagraph>
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
				<SubTitle>Because sometimes the best meetings are no meetings. More focus and time to get s*#!t done.</SubTitle>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
				>
					<TextTitle>It's ok to say "no"</TextTitle>
					<TextParagraph>
						<p>
							Declining a meeting should not mean falling out of the conversation. A person can send a virtual assistant
							in their place, specify what matters to them, and receive a useful follow-up.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					reverse
					nomargin
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
				>
					<TextTitle>Async Meetings</TextTitle>
					<TextParagraph>
						<p>Send out recordings of materials and presentations.</p>
						<p>
							Meet async allowing people to scrub through to the points of interest, providing comments, feedback,
							questions and marking follow up items.
						</p>
					</TextParagraph>
				</ProjectHighlight>
			</Section>
			<Section>
				<ProjectTitle>Pre-meeting</ProjectTitle>
				<SubTitle>Because success is often the flip side of preparation and setup.</SubTitle>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
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
					themedImage={themedImages.placeholder}
					reverse
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
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
					themedImage={themedImages.placeholder}
					nomargin
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
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
				<SubTitle>Making the meeting experience more human, focused and more effective.</SubTitle>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
				>
					<TextTitle>Portrait video.</TextTitle>
					<TextParagraph>
						<p>
							Show up with the information that helps people communicate effectively, not everything in the background.
							Portrait video creates a more intentional, personal meeting presence.
						</p>
						<p>For most of our SMB customers, work happens outside the office, making portrait video a natural fit.</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					reverse
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
				>
					<TextTitle>Float mode.</TextTitle>
					<TextParagraph>
						<p>
							People often need to follow a meeting while working in another application. A floating view helps them
							stay connected without forcing the meeting to take over the entire screen.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
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
					themedImage={themedImages.placeholder}
					reverse
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
				>
					<TextTitle>A meeting that responds to its environment</TextTitle>
					<TextParagraph>
						<p>
							Light and dark modes let the product feel appropriate in different work conditions rather than assuming
							that every meeting happens in a dark interface.
						</p>
						<p>
							And they can automatically follow the time of day to provide cues to others that you might be working
							overtime.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
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
					themedImage={themedImages.placeholder}
					reverse
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
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
					This could be the beginning of a beautiful conversation … meeting should leave behind clear context, useful
					follow-up, and a path for people who could not attend to catch up quickly.
				</SubTitle>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					nomargin
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
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
