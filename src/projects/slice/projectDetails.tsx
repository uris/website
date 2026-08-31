'use client';

import { Button, Label } from '@apple-pie/slice';
import { CodeSnippet } from '@/components/CodeSnippet/CodeSnippet';
import { DataButton, DataButtonGrid } from '@/components/DataButtons/DataButtons';
import { FigureTitle } from '@/components/FigureTitle/FigureTitle';
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
import { snippets } from './code-snippets';
import { themedImages } from './images';
import projectJson from './project.json';

export default function SliceProjectDetails() {
	const header = projectJson.header || {};

	return (
		<Wrapper>
			<Section gradient={false}>
				<Logo name={header.brand.name} color={'var(--core-icon-primary)'} size={64} margin={'0 0 128px 0'} />
				<ProjectTitle>{header.title}</ProjectTitle>
				<SubTitle margin={false}>{header.subtitle}</SubTitle>
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
				<ProjectTitle>The problem</ProjectTitle>
				<SubTitle>
					Most frontend projects need the same things: a design system, a component library, and abstractions over
					complex APIs like WebRTC. The typical answer is to stitch together multiple packages, none of which really
					"speak" to each other.
				</SubTitle>
				<DataButtonGrid>
					<DataButton value={'30-50%'} label={'Amount of "glue code"'} />
					<DataButton value={'48 hrs +'} label={'Before writing business logic'} />
					<DataButton value={'1 day +'} label={'Days spent on glue code'} />
					<DataButton value={'Security'} label={'Hidden package issues'} />
					<DataButton value={'20% to 30%'} label={'Actual code usage p/pckg.'} />
					<DataButton value={'Conflicts'} label={'Time spent resolving conflicts'} />
				</DataButtonGrid>
				<SubTitle margin={false}>
					Bottom line: Significant time consumed wiring packages together, wrangling types, writing glue code, securing
					dependencies — before actually producing product logic.
				</SubTitle>
			</Section>
			<Section>
				<ProjectTitle>All-in-one SDK</ProjectTitle>
				<SubTitle>
					An all-in-one front-end UI kit that speeds up development and helps teams deliver customer value faster.
				</SubTitle>
				<ProjectHighlight themedImage={themedImages.coreColors}>
					<TextTitle>Integrated design language</TextTitle>
					<TextParagraph>
						<p>Fully customizable design language with a token system defining style and motion:</p>
						<ul>
							<li>colors</li>
							<li>spacing</li>
							<li>transitions</li>
							<li>typography</li>
							<li>icons</li>
							<li>and more.</li>
						</ul>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight themedImage={themedImages.videoComponent} reverse>
					<TextTitle>40+ accessibility-compliant UI components</TextTitle>
					<TextParagraph>
						<p>
							Performant UI components optimized for fast renders and re-renders, giving you the building blocks for a
							robust web app:
						</p>
						<ul>
							<li>Granular UI elements like buttons, inputs, dropdowns, etc.</li>
							<li>Composed components for UI elements like video, audio, etc.</li>
							<li>Layout components for application panels, containers, and grids.</li>
						</ul>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight themedImage={themedImages.ssr}>
					<TextTitle>SSR ready, zero config</TextTitle>
					<TextParagraph>
						<p>
							Full React 18/19 RSC support, with 'use client' directives preserved through the build so Next.js and
							Remix apps work without configuration.
						</p>
						<p>
							It includes SSR helpers for server-side rendering and client hydration, plus full SSR and static
							rendering support for Next.js and Remix out of the box. No wrappers, no workarounds — it just works.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight themedImage={themedImages.indexDB} reverse>
					<TextTitle>Abstracted Browser API hooks</TextTitle>
					<TextParagraph>
						<p>
							Hooks that provide easy access to the microphone, camera, screen sharing, WebRTC, SSE, WebSockets,
							IndexedDB, audio visualization, audio recording, and more.
						</p>
						<p>They are also exposed as drop-in Zustand stores for stateful access to the same APIs.</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight themedImage={themedImages.prompt}>
					<TextTitle>Realtime and AI ready out-of-the-box</TextTitle>
					<TextParagraph>
						<p>
							Production-ready abstractions over WebRTC, WebSocket, and SSE — video, audio, screen sharing, and live
							data streams without the boilerplate.
						</p>
						<p>
							It exposes hooks, stores, and components that make it easy to connect to, display, and interact with AI.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight themedImage={themedImages.bundle} reverse>
					<TextTitle>Built to be lean</TextTitle>
					<TextParagraph>
						<p>
							The package ships with 98 granular export paths, so consumers only pay for what they use, keeping bundle
							sizes lightweight through effective tree shaking.
						</p>
						<p>
							It has only 2 peer dependencies (`react`, `react-dom`) and 2 optional dependencies (`zustand`,
							`motion`), depending on what you choose to use. None of them are bundled into the library.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight themedImage={themedImages.performance} nomargin>
					<TextTitle>Performance optimized</TextTitle>
					<TextParagraph>
						<p>All components are designed for fast mount and remount times, with a target of 2 ms or less.</p>
						<p>It also includes abstracted web workers for offloading time-consuming tasks like multi-file uploads.</p>
					</TextParagraph>
				</ProjectHighlight>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Everything composes</ProjectTitle>
				<SubTitle>
					Types flow between layers so the pieces fit together. Hooks return types the components already expect — less
					wiring, less glue code, more product.
				</SubTitle>
				<div className={styles.codeBlock}>
					<FigureTitle>Example: List and change the selected microphone in 2 lines</FigureTitle>
					<CodeSnippet language={normalizeLanguage('JavaScript')} snippet={snippets.addMic} />
				</div>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Lessons learned</ProjectTitle>
				<SubTitle margin={false}>
					I underestimated how much of the work in a public package is the documentation and DX, not the code. The
					Storybook site, documentation, the contributor guides, the export map — that's a lot more than half the work.
				</SubTitle>
				<SubTitle>
					Abstracting WebRTC properly meant understanding it deeply first — ICE negotiation, track replacement without
					renegotiation, data channel lifecycle. The API surface had to hide that complexity without hiding control.
					Getting that balance right took several iterations.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>My role</ProjectTitle>
				<SubTitle margin={false}>
					Sole author and maintainer — component API design, build engineering, documentation, CI/CD, and the npm
					publishing lifecycle across 34 releases and counting.
				</SubTitle>
			</Section>
		</Wrapper>
	);
}
