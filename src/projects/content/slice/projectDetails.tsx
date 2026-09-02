'use client';

import { Button, Label } from '@apple-pie/slice';
import { CodeSnippet } from '@/components/CodeSnippet/CodeSnippet';
import { FigureTitle } from '@/components/FigureTitle/FigureTitle';
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
import styles from '@/projects/_helpers/Wrapper.module.css';
import { normalizeLanguage, normalizeTarget } from '@/utils/misc';
import { themedImages } from '../slice/images';
import { snippets } from './code-snippets';
import projectJson from './project.json';

export default function SliceProjectDetails() {
	const header = projectJson.header || {};

	return (
		<Wrapper>
			<Section gradient={false}>
				<Logo name={header.brand.name} color={'var(--core-icon-primary)'} size={64} margin={'0 0 64px 0'} />
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
				<InlineTitle title={'Highlights'} />
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					alt={'Slice color tokens and theme controls used to define a consistent interface design language.'}
				>
					<TextTitle>One design language, implemented in code</TextTitle>
					<TextParagraph>
						<p>
							Slice starts with a configurable design language for color, spacing, type, motion, icons, and more. The
							same system is used by components and layout primitives, so product teams are not re-solving visual
							consistency at every layer.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					reverse
					alt={
						'Slice video component rendered inside an accessible application interface with reusable controls and layout primitives.'
					}
				>
					<TextTitle>Accessible components for application work</TextTitle>
					<TextParagraph>
						<p>
							Slice includes reusable primitives for inputs, overlays, media, uploads, panels, containers, and grids.
							Each component is designed and tested to meet accessibility expectations, so keyboard interaction,
							semantics, and assistive-technology support are part of the component work rather than a follow-up task.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					alt={
						'Slice server-rendering setup showing React client directives preserved for a Next.js or Remix application.'
					}
				>
					<TextTitle>Server-rendering compatibility without a separate path</TextTitle>
					<TextParagraph>
						<p>
							The library preserves React client directives through the build and provides the pieces needed for server
							rendering and client hydration. This lets the same package work naturally in Next.js and Remix
							applications.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					reverse
					alt={'Slice browser API hooks and stores connecting a device or browser capability to application UI state.'}
				>
					<TextTitle>Browser APIs with an interface you can compose</TextTitle>
					<TextParagraph>
						<p>
							Microphone, camera, screen sharing, WebRTC, WebSocket, SSE, IndexedDB, audio visualization, and recording
							are exposed as React hooks and Zustand stores. The API hides repetitive lifecycle work without hiding the
							controls a product needs.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					alt={'Slice realtime primitives supporting a streamed assistant response and live application state.'}
				>
					<TextTitle>Realtime and AI-ready primitives</TextTitle>
					<TextParagraph>
						<p>
							Slice provides building blocks for live audio, video, screen sharing, data channels, and streamed UI. It
							is designed to make realtime and AI product work easier to compose, not to hide the underlying system
							entirely.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					reverse
					alt={'Slice granular imports and export paths allowing an application to include only the modules it uses.'}
				>
					<TextTitle>One package does not mean one large bundle</TextTitle>
					<TextParagraph>
						<p>
							The package exposes granular import paths so applications can import the pieces they need. Its small peer
							and optional dependency surface keeps ownership with the consuming application rather than bundling every
							integration by default.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.placeholder}
					nomargin
					alt={
						'Slice performance tooling and component behavior designed to keep responsive application work off the main thread when appropriate.'
					}
				>
					<TextTitle>Designed for performance and responsive app behavior</TextTitle>
					<TextParagraph>
						<p>
							Components are built with fast mount and remount behavior in mind, and the runtime includes worker
							abstractions for moving expensive work, such as multi-file uploads, off the main thread.
						</p>
					</TextParagraph>
				</ProjectHighlight>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>The integration problem</ProjectTitle>
				<SubTitle marginSize={16}>
					Most frontend products need the same foundational capabilities: a visual system, reliable components,
					application layout, browser access, state, and increasingly realtime interaction. The usual solution is a
					collection of separate packages, followed by custom glue to make their types, state, lifecycle, and design
					rules work together.
				</SubTitle>
				<SubTitle>
					Slice is an attempt to make those seams intentional. It provides a single composable foundation where hooks,
					stores, components, and theme tokens are designed to work together from the start.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.placeholder}
					dropShadow={false}
					border={true}
					heroMargin={0}
					heroOffset={0}
					heroAltText={
						'Comparison between disconnected frontend packages and Slice as a composable foundation for UI, state, browser APIs, and realtime features.'
					}
				/>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>A single package, designed to stay composable</ProjectTitle>
				<SubTitle marginSize={16}>
					Slice is not a monolithic framework and it is not a requirement to adopt every layer. Teams can use a
					component, a hook, a store, or a provider independently, while retaining the option to compose them together
					when a feature crosses those boundaries.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Shared types:</strong> Hooks return values that components can accept without mapping or adapter code.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Shared state model:</strong> Browser and realtime capabilities can be accessed through hooks or
					Zustand stores, depending on the product need.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Shared visual language:</strong> Theme tokens, components, and layouts use the same design vocabulary.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Granular adoption:</strong> Export paths let consumers use specific modules rather than importing the
					entire library.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle nowrap>Everything composes</ProjectTitle>
				<SubTitle>
					The useful abstraction is one that removes repeated wiring without making the underlying capability impossible
					to control. Slice uses shared types so a hook can return exactly the option shape a component expects, turning
					common browser interactions into direct product code.
				</SubTitle>
				<div className={styles.codeBlock}>
					<FigureTitle>Example: Bind the selected microphone to a dropdown</FigureTitle>
					<CodeSnippet language={normalizeLanguage('JavaScript')} snippet={snippets.addMic} />
				</div>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Distribution is part of the product</ProjectTitle>
				<SubTitle marginSize={16}>
					For a public SDK, the package boundary matters as much as the API. Slice publishes granular export paths so
					consumers can import individual components, hooks, stores, and utilities without paying for unrelated
					capabilities.
				</SubTitle>
				<SubTitle>
					The build has to preserve React directives, produce matching JavaScript and TypeScript entry points, and keep
					chunk boundaries predictable across environments. That is more than build tooling; it is part of the developer
					experience the library delivers.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.placeholder}
					dropShadow={false}
					border={true}
					heroMargin={0}
					heroOffset={0}
					heroAltText={
						'Slice build pipeline producing granular JavaScript and TypeScript package entry points for consuming React applications.'
					}
				/>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Thoroughly documented</ProjectTitle>
				<SubTitle marginSize={16}>
					Thorough documentation takes time, but it is one of the highest-leverage parts of a public library. A
					component or hook is only useful when a developer can understand what it does, see how to use it, and make an
					informed decision about whether it fits their product.
				</SubTitle>
				<SubTitle>
					Slice documents the component and API surface, practical examples, and the decisions behind the system.
					Contributor documentation and architecture notes make the project easier to extend without requiring every new
					contributor to rediscover the build, export, state, and runtime model from scratch.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.placeholder}
					dropShadow={false}
					border={true}
					heroMargin={0}
					heroOffset={0}
					heroAltText={
						'Slice documentation showing component usage alongside contributor and architecture guidance for extending the library.'
					}
				/>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>What I intentionally did not build</ProjectTitle>
				<SubTitle marginSize={16}>
					<strong>Not just a component library:</strong> Components are one layer in a system that also includes theme,
					layout, hooks, stores, and browser runtime behavior.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not a monolithic framework:</strong> Consumers can adopt individual modules and keep control of their
					application architecture.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not a black-box WebRTC wrapper:</strong> The library abstracts lifecycle complexity while keeping
					product-level controls available.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not an unbounded dependency bundle:</strong> Peer and optional dependencies remain external so
					consumers decide what their application needs.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Not a finished claim of maturity:</strong> Slice is actively maintained and pre-1.0; describe only the
					features and guarantees that are documented today.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Lessons learned</ProjectTitle>
				<SubTitle marginSize={16}>
					The hard part of a public library is not only writing the code. Documentation, examples, Storybook,
					contributor guidance, architecture notes, export maps, testing, release automation, and clear API boundaries
					are all part of whether another developer can successfully use it.
				</SubTitle>
				<SubTitle margin={false}>
					WebRTC was a particularly useful example. Building a good abstraction required understanding ICE negotiation,
					data-channel lifecycle, and replacing tracks without unnecessary renegotiation. The challenge was to remove
					the repetitive complexity without taking away the controls a real product needs.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>My role</ProjectTitle>
				<SubTitle marginSize={16}>
					I am the sole author and maintainer of Slice: product direction, component and API design, theme system,
					browser and realtime abstractions, build engineering, documentation, testing, CI/CD, and npm publishing.
				</SubTitle>
				<SubTitle margin={false}>
					The library has been published through 34 releases. More importantly, it is used as a real foundation in Uris
					Design, where its theme, layout, media-device, notification, and WebRTC primitives operate together in a live
					product.
				</SubTitle>
			</Section>
		</Wrapper>
	);
}
