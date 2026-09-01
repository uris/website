'use client';

import { Button, Label } from '@apple-pie/slice';
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
import { normalizeTarget } from '@/utils/misc';
import { images, themedImages } from './images';
import projectJson from './project.json';

export default function UrisDesignProjectDetails() {
	const header = projectJson.header || {};

	return (
		<Wrapper>
			<Section gradient={false}>
				<Logo name={header.brand.name} color={'var(--core-icon-primary)'} size={64} margin={'0 0 64px 0'} />
				<ProjectTitle>{header.title}</ProjectTitle>
				<SubTitle margin={false}>{header.subtitle}</SubTitle>
				<HeroImage heroImage={themedImages.hero} backgroundImage={themedImages.heroBG} border={false} />
				<SubTitle margin={false}>Note: The site also serves as a proving ground for the Slice React UI SDK.</SubTitle>
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
			<Section gradient={true}>
				<ProjectTitle>The opportunity</ProjectTitle>
				<SubTitle margin={false}>
					<span style={{ textDecoration: 'underline' }}>For hiring teams:</span> Imagine a recruiter, founder, or hiring
					manager saying "I want to understand your experience with design systems, AI, or realtime product work" and
					getting a direct, guided, conversational path through your work and background, with the site opening the
					relevant project or skills section as part of that exchange.
				</SubTitle>
				<SubTitle margin={false}>
					<span style={{ textDecoration: 'underline' }}>For candidates:</span> Imagine that as a candidate you can
					simply point an AI at your work (JSON, site, GitHub, npm) and have it automatically support and present your
					work to anyone interested.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Introducing Vi</ProjectTitle>
				<SubTitle margin={true}>
					Vi is a real-time, voice-enabled AI assistant you can talk to about my work, background, and skills. You can
					also ask Vi to navigate and interact directly with my portfolio site. For example: "Vi, open project..." or
					"Vi, mute sound."
				</SubTitle>
				<ProjectHighlight themedImage={themedImages.skills}>
					<TextTitle>AI-first portfolio workspace</TextTitle>
					<TextParagraph>
						<p>
							The site is structured as a workspace instead of a brochure: a central AI conversation surface, draggable
							side panels, project browsing, and settings that support live exploration and guided navigation.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight themedImage={themedImages.talk} reverse>
					<TextTitle>Realtime voice conversation</TextTitle>
					<TextParagraph>
						<p>
							WebRTC powers full-duplex voice interaction with a dedicated `oai-events` data channel for model events,
							transcript updates, and connection-aware UI behavior.
						</p>
						<p>
							Coupled with OpenAI's Realtime API, Vi can talk through work, projects, and skills, and perform navigation
							and UI actions on behalf of users.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight themedImage={themedImages.talk} nomargin>
					<TextTitle>Built on Slice™</TextTitle>
					<TextParagraph>
						<p>
							The portfolio site reuses my own UI and browser runtime library for theme, layout, media, notifications,
							and WebRTC primitives, turning the site into a real application of the system rather than a standalone
							mock.
						</p>
					</TextParagraph>
				</ProjectHighlight>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Why Next.js?</ProjectTitle>
				<SubTitle margin={false}>
					This is a showcase piece for Next.js fluency. The app uses the App Router, server-rendered layout setup,
					static generation for project detail routes, route handlers for session orchestration, and a server-side
					project content store that pre-renders each project page from structured JSON.
				</SubTitle>
				<SubTitle margin={false}>
					That matters here because the app has two very different responsibilities: render content quickly like a
					polished portfolio, and then progressively layer in realtime voice and client state where interactivity is
					needed.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Technical notes</ProjectTitle>
				<SubTitle margin={false}>A few technical details behind the portfolio are worth calling out:</SubTitle>
				<SubTitle margin={false}>
					<strong>Route generation and delivery:</strong> Project detail pages are generated from known project slugs,
					with `generateStaticParams()` producing static routes and server-side transformers shaping the same project
					JSON into page, tile, and AI-specific views.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Assistant data awareness:</strong> The assistant is seeded with project summaries on session start and
					can request structured project and skills data through explicit tools, giving it grounded content to talk
					about instead of relying on vague prompt-only context.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Client and server separation:</strong> Theme resolution and layout bootstrapping happen through the
					App Router layout, while interactive surfaces such as the AI panel, settings, and project workspace hydrate on
					the client where stateful behavior is needed.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Realtime event handling:</strong> Assistant events like `session.created`,
					`response.output_audio_transcript.delta`, and `response.output_audio_transcript.done` are routed through a
					dedicated event handler that updates store state without coupling transport logic to UI components.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>AI assisted navigation actions:</strong> The assistant can trigger browser-side view changes for
					projects, skills, contact, and selected UI settings, so conversation is tied directly to movement through the
					site instead of being isolated from the interface.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Voice and device control:</strong> Microphone access, input volume, mute state, and device selection
					are managed through Slice primitives and synchronized back into the WebRTC connection so the live assistant
					stays in step with the selected input device.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Workspace UI composition:</strong> The app is structured as a multi-panel workspace with draggable
					side surfaces, a central AI thread, settings, toast/tip systems, and project detail rendering instead of a
					single linear landing page.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Shared integration model:</strong> The Next.js route handler acts as an app-facing boundary for
					session requests, while the reusable backend API handles the external realtime session creation used by this
					project and others.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>My role</ProjectTitle>
				<SubTitle margin={false}>
					I owned the e2e design and implementation: product concept, information architecture, interaction model, UI
					system, frontend architecture, and realtime implementation along with infrastructure, backend, and API
					integration.
				</SubTitle>
			</Section>
		</Wrapper>
	);
}
