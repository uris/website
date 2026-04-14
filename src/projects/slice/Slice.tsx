import { Button, Label, Spacer } from '@apple-pie/slice';
import Highlight from 'react-highlight';
import cameraDemo from '@/assets//projects/slice/slice-camera-demo.png';
import cameraDemoLight from '@/assets//projects/slice/slice-camera-demo-light.png';
import sliceCode from '@/assets/projects/slice/slice-mic-code.png';
import sliceRollupCode from '@/assets/projects/slice/slice-rollup-code.png';
import sliceSSR from '@/assets/projects/slice/slice-ssr-provider-code.png';
import themeColors from '@/assets/projects/slice/slice-theme-colors.png';
import themeColorsLight from '@/assets/projects/slice/slice-theme-colors-light.png';
import { Wrapper } from '@/projects/_helpers/Wrapper';
import { addMic, granularExports } from '@/projects/slice/code-examples';
import { DataButton, DataButtonGrid } from '@/src/components/DataButtons/DataButtons';
import { LinkList } from '@/src/components/LinkList/LinkList';
import { Logo } from '@/src/components/Logos/Logos';
import ProjectImage, { ImageItem } from '@/src/components/ProjectImage/ProjectImage';
import { SectionTitle } from '@/src/components/SectionTitle/SectionTitle';
import { TechStack } from '@/src/components/TechStack/TechStack';
import styles from '../_helpers/Wrapper.module.css';

export default function Slice() {
	return (
		<Wrapper>
			<Logo name={'slice'} color={'var(--core-text-primary)'} size={32} margin={'0 0 32px 0'} />
			<h1>React UI SDK - @apple-pie/slice</h1>
			<p className={styles.subtitle}>
				Design language, component library, and browser API layer — all in one npm package. "Because
				piecing together multiple libraries to ship one feature stopped making sense."
			</p>
			<TechStack>
				<Label>React 18/19</Label>
				<Label>TypeScript</Label>
				<Label>npm</Label>
				<Label>Storybook</Label>
				<Label>Rollup</Label>
				<Label>PostCSS</Label>
				<Label>Vitest + Playwright</Label>
				<Label>Zustand</Label>
				<Label>Motion</Label>
				<Label>Biome</Label>
				<Label>SSR + client</Label>
				<Label>WebRTC</Label>
				<Label>Open source</Label>
			</TechStack>
			<LinkList direction={'row'}>
				<Button link={'https://www.slice-uikit.com'} target={'_blank'} iconLeft={'globe location'}>
					www.slice-uikit.com
				</Button>
				<Button
					link={'https://www.npmjs.com/package/@apple-pie/slice'}
					target={'_blank'}
					iconLeft={'npm'}
				>
					npm
				</Button>
				<Button link={'https://github.com/uris/uikit'} target={'_blank'} iconLeft={'github'}>
					GitHub
				</Button>
			</LinkList>

			<Spacer size={32} />
			<ProjectImage maxImageHeight={325}>
				<ImageItem
					imagePos={'left'}
					title={'Complete design system'}
					image={themeColors}
					imageLight={themeColorsLight}
				>
					<p>
						A design language built into a single React provider. Fully customizable token system
						across colors, spacing, motion, typography, icons, and more.
					</p>
				</ImageItem>
				<ImageItem
					title={'Realtime right out-of-the box'}
					image={cameraDemo}
					imageLight={cameraDemoLight}
				>
					<p>
						Production-ready abstractions over WebRTC, WebSocket, and SSE — video, audio, screen
						sharing, and live data streams without the boilerplate.
					</p>
				</ImageItem>
				<ImageItem title={'Everything composes'} image={sliceCode}>
					<p>
						Types flow between layers so the pieces fit together. Hooks return types the components
						already expect — less wiring, less glue code, more product.
					</p>
				</ImageItem>
				<ImageItem title={'Built to be lean'} image={sliceRollupCode}>
					<p>
						98 granular export paths mean your bundle only includes what you actually use. Import
						from the root or go granular — tree-shaking handles the rest.
					</p>
				</ImageItem>
				<ImageItem title={'SSR ready, zero config'} image={sliceSSR}>
					<p>
						Full SSR and static rendering support for Next.js and Remix, out of the box. No
						wrappers, no workarounds — it just works.
					</p>
				</ImageItem>
			</ProjectImage>
			<SectionTitle icon={'moon full'}>The Problem</SectionTitle>
			<p>
				Most frontend projects need the same things: a design system, a component library, and
				abstractions over complex APIs like WebRTC, etc. The typical answer - use multiple packages,
				none of which "speak" each other.
			</p>
			<p>
				Result? Wasted time (often days) wiring them together, wrangling types, writing glue code —
				before actually producing product logic.
			</p>

			<SectionTitle icon={'moon full'}>Philosophy</SectionTitle>
			<p>
				Composability. Everything is designed to interlock. Types flow from one layer to the next,
				stores abstract boiler plate, and hooks bind elements auto-magically.
			</p>
			<p className={styles.figureTitle}>List and choose a microphone device in 2 lines</p>
			<Highlight className="typescript">{addMic}</Highlight>

			<SectionTitle icon={'moon full'}>What's in the package</SectionTitle>
			<ul>
				<li>
					<strong>Complete theme system</strong> — Design language coded into a single React
					provider, with a fully customizable token system across colors, spacing, motion, icons,
					type ...
				</li>
				<li>
					<strong>40+ components</strong> — inputs, layout, media, overlays, and upload handling
					with a shared theme token system (colors, spacing, motion, type)
				</li>
				<li>
					<strong>Real-time communication layer</strong> — production-grade abstractions over
					WebRTC, WebSocket, and SSE. ICE negotiation, reconnection logic, and typed event handlers
					handled for you
				</li>
				<li>
					<strong>Browser API hooks</strong> — microphone, camera, screen share, IndexedDB, and
					audio visualisation, audio recording, each exposing clean React interfaces with automatic
					cleanup
				</li>
				<li>
					<strong>SSR compatible</strong> — full React 18/19 RSC support, with 'use client'
					directives preserved through the build so Next.js and Remix apps work without
					configuration
				</li>
				<li>
					<strong>Performance optimized</strong> — Abstracted web workers for threading uploads and
					components designed with fast mount / re-mount times of no more than 2 ms.
				</li>
			</ul>

			<SectionTitle icon={'moon full'}>A hard problem - the build system</SectionTitle>
			<p>
				The package ships 98 granular export paths so consumers only pay for what they use. Getting
				that to work — dual CJS/ESM output, matching TypeScript definitions, and correct chunk
				splitting — required writing custom Rollup config that generates every entry point
				dynamically.
			</p>
			<p>
				Tradeoff: longer build times but dramatically smaller footprint on the consuming side. Worth
				it.
			</p>
			<p className={styles.figureTitle}>Granular imports</p>
			<Highlight className="typescript">{granularExports}</Highlight>

			<SectionTitle icon={'moon full'}>By The Numbers</SectionTitle>
			<DataButtonGrid>
				<DataButton value={'40+'} label={'Components'} />
				<DataButton value={'98'} label={'Export paths'} />
				<DataButton value={'34'} label={'npm releases'} />
				<DataButton value={'13+'} label={'Custom hooks'} />
				<DataButton value={'3'} label={'RT protocols'} />
				<DataButton value={'v0.1'} label={'Active / pre-1.0'} />
			</DataButtonGrid>

			<SectionTitle icon={'moon full'}>Lessons learned</SectionTitle>
			<p>
				Abstracting WebRTC properly meant understanding it deeply first — ICE negotiation, track
				replacement without renegotiation, data channel lifecycle. The API surface had to hide that
				complexity without hiding control. Getting that balance right took several iterations.
			</p>
			<p>
				I also underestimated how much of the work in a public package is the documentation and DX,
				not the code. The Storybook site, documentation, the contributor guides, the export map —
				that's more than half the work.
			</p>

			<SectionTitle icon={'moon full'}>My Role</SectionTitle>
			<p>
				Sole author and maintainer — component API design, build engineering, documentation, CI/CD,
				and the npm publishing lifecycle across 34 releases.
			</p>
		</Wrapper>
	);
}
