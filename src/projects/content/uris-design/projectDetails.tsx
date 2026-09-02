'use client';

import { Button, Label } from '@apple-pie/slice';
import { HeroImage } from '@/components/HeroImage/HeroImage';
import { InlineTitle } from '@/components/InlineTitle/InlineTitle';
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
import { normalizeTarget } from '@/utils/misc';
import { themedImages } from './images';
import projectJson from './project.json';

export default function UrisDesignProjectDetails() {
	const header = projectJson.header || {};

	return (
		<Wrapper>
			<Section gradient={false}>
				<Logo name={header.brand.name} color={'var(--core-icon-primary)'} size={64} margin={'0 0 64px 0'} />
				<ProjectTitle>{header.title}</ProjectTitle>
				<SubTitle margin={false}>{header.subtitle}</SubTitle>
				<HeroImage
					heroImage={themedImages.hero}
					backgroundImage={themedImages.heroBG}
					border={false}
					heroAltText={'Realtime portfolio workspace with an assistant conversation beside an opened project view.'}
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
				<InlineTitle title={'Highlights'} />
				<ProjectHighlight
					themedImage={themedImages.skills}
					alt={'Assistant conversation answering a portfolio question about design systems, AI, or realtime work.'}
				>
					<TextTitle>Ask better portfolio questions</TextTitle>
					<TextParagraph>
						<p>
							Visitors can ask the same focused questions that come up in a hiring conversation, then move directly to
							the work that answers them.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.skills}
					reverse
					alt={'A portfolio skills or project panel opened in response to an assistant conversation.'}
				>
					<TextTitle>Conversation helps drive the interface</TextTitle>
					<TextParagraph>
						<p>
							Vi is not a detached chat widget. It can guide people to the evidence behind its answer, tying
							conversation to navigation.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.skills}
					alt={'Voice conversation interface showing microphone controls, a transcript, and an assistant response.'}
				>
					<TextTitle>Voice is optional and interruptible</TextTitle>
					<TextParagraph>
						<p>
							Voice accelerates discovery for visitors who want it, while conventional browsing and text remain
							first-class paths.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.skills}
					reverse
					alt={
						"Diagram showing the assistant's bounded actions: portfolio retrieval, view navigation, and selected settings updates."
					}
				>
					<TextTitle>AI with clear boundaries</TextTitle>
					<TextParagraph>
						<p>
							The assistant works from structured portfolio data and a small set of defined actions, rather than being
							given broad, opaque authority.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.skills}
					nomargin
					alt={
						'Architecture diagram connecting structured content, Next.js, realtime tools, and the portfolio workspace.'
					}
				>
					<TextTitle>A real system behind the interface</TextTitle>
					<TextParagraph>
						<p>
							The experience combines static delivery, realtime WebRTC events, stateful UI, and reusable design-system
							primitives in one application.
						</p>
					</TextParagraph>
				</ProjectHighlight>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>From brochure to conversation</ProjectTitle>
				<SubTitle marginSize={16}>
					Hiring managers rarely review a portfolio in a linear order. They arrive with questions: Can this person
					design systems? Have they built with AI? Can they ship complex frontend work? Standard portfolios make
					reviewers hunt for answers across disconnected pages.
				</SubTitle>
				<SubTitle>
					I treated the portfolio as a product problem. The goal was not to replace browsing with a chatbot, but to give
					visitors a faster way to discover the relevant evidence when they already know what they want to learn.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.hero}
					dropShadow={false}
					border={true}
					heroMargin={0}
					heroOffset={0}
					heroAltText={
						'Flow from a visitor question to an assistant response and the relevant case study opened in the workspace.'
					}
				/>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>A workspace, not a chat overlay</ProjectTitle>
				<SubTitle marginSize={16}>
					The site supports two complementary modes. A visitor can explore projects, skills, and contact information
					directly, or ask Vi for a shortcut. Conversation is an optional discovery layer, not a gatekeeper.
				</SubTitle>
				<SubTitle marginSize={16}>
					When a question becomes specific, the assistant can retrieve relevant context and open the matching project,
					skills area, or contact surface. The interface follows the conversation, so the answer is always connected to
					something the visitor can inspect for themselves.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Browse directly:</strong> Project and skill content remains visible and usable without AI or
					microphone access.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Ask a focused question:</strong> The assistant helps visitors find the right work or implementation
					detail without forcing a fixed reading order.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Inspect the evidence:</strong> Navigation opens the relevant view so claims stay connected to the
					underlying project material and visible content.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Stay in control:</strong> Voice can be muted, interrupted, or avoided in favor of text and standard
					navigation.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Useful AI needs visible limits</ProjectTitle>
				<SubTitle marginSize={16}>
					The difficult part was not connecting a model to a microphone. It was defining what the assistant should know
					and what it should be allowed to do.
				</SubTitle>
				<SubTitle marginSize={16}>
					Vi begins with structured summaries of the portfolio and can request more complete project or skills data
					through explicit tools. Its actions are deliberately narrow: retrieve portfolio information, guide visitors to
					a known view, and adjust selected interface settings. It cannot take arbitrary actions.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Grounded answers:</strong> Project and skills content comes from structured server data rather than a
					prompt-only approximation.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Explicit contracts:</strong> Tool definitions constrain the accepted input and available actions.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Predictable navigation:</strong> The assistant can open known portfolio views, not manipulate the
					browser freely.
				</SubTitle>
				<SubTitle>
					<strong>Auditable interaction:</strong> Typed events and bounded callbacks keep realtime behavior easier to
					reason about and extend.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.hero}
					dropShadow={false}
					border={true}
					heroMargin={0}
					heroOffset={0}
					heroAltText={
						"Diagram showing the assistant's bounded actions: portfolio retrieval, view navigation, and selected settings updates."
					}
				/>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Architecture shaped around the experience</ProjectTitle>
				<SubTitle marginSize={16}>
					The application has two different jobs: deliver a fast, well-structured portfolio by default, then support a
					live conversation only when a visitor chooses to engage. The architecture reflects that split.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Fast content delivery:</strong> Known project routes and their structured content are generated ahead
					of time, keeping the portfolio useful before any interactive layer loads.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Realtime conversation:</strong> WebRTC carries the live audio stream, while a dedicated data channel
					carries model events, transcripts, and tool activity.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>State ownership:</strong> Separate stores own connection lifecycle, assistant speech state, response
					history, and streaming output.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Clear application boundary:</strong> A Next.js route handler represents the app-facing session
					boundary while a shared API layer owns the external realtime integration.
				</SubTitle>
				<SubTitle>
					<strong>Progressive interactivity:</strong> Stateful workspace, settings, and AI surfaces run on the client
					without making the entire content experience client-only.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.hero}
					dropShadow={false}
					border={true}
					heroMargin={0}
					heroOffset={0}
					heroAltText={
						'Architecture diagram showing structured content, Next.js delivery, realtime tools, and workspace UI state.'
					}
				/>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Slice UI Kit as the foundation</ProjectTitle>
				<SubTitle marginSize={16}>
					This project is a real-world proving ground for Slice, my UI and browser runtime library. Shared primitives
					for theme, layout, notifications, media devices, and WebRTC keep the interface cohesive while exercising the
					system in a live application.
				</SubTitle>
				<SubTitle>
					The portfolio and the library strengthen each other: the product tests Slice under responsive layout, device
					selection, connection state, streaming content, and changing interface surfaces.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.hero}
					dropShadow={false}
					border={true}
					heroMargin={0}
					heroOffset={0}
					heroAltText={
						'Portfolio workspace UI paired with the Slice primitives that support its layout, media, and realtime behavior.'
					}
				/>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>What I intentionally did not build</ProjectTitle>
				<SubTitle marginSize={16}>
					<strong>Not a voice-only portfolio:</strong> Conventional browsing remains the reliable baseline and supports
					different preferences and environments.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not an autonomous agent:</strong> The assistant has a small, defined tool surface because
					predictability matters more than novelty.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not a generic chat widget:</strong> Conversation can change the relevant view; it is connected to the
					product instead of layered over it.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not a fully client-rendered app:</strong> Static project delivery protects the fast content
					experience, while client state is used where it provides real value.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Not a one-off visual prototype:</strong> The experience is built on reusable architecture and Slice
					primitives that is both extensible and supports other products.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>My role</ProjectTitle>
				<SubTitle marginSize={16}>
					I owned the product concept, information architecture, interaction model, UI system, Next.js application
					architecture, realtime integration, state model, and the shared API boundary. I also built the underlying
					Slice primitives the workspace relies on.
				</SubTitle>
				<SubTitle margin={false}>
					The result is a compact example of how I work on product teams: start with a human interaction and a clear
					product constraint, then carry it through interface design, frontend systems, and the implementation details
					that make it dependable.
				</SubTitle>
			</Section>
		</Wrapper>
	);
}
