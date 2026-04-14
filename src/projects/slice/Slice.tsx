import { Button, Label, Spacer } from '@apple-pie/slice';
import Highlight from 'react-highlight';
import cameraDemo from '@/assets//projects/slice/slice-camera-demo.png';
import cameraDocs from '@/assets//projects/slice/slice-camera-docs.png';
import { Wrapper } from '@/projects/_helpers/Wrapper';
import { addMic, granularExports } from '@/projects/slice/code-examples';
import { LinkList } from '@/src/components/LinkList/LinkList';
import { Logo } from '@/src/components/Logos/Logos';
import ProjectImage, { ImageItem } from '@/src/components/ProjectImage/ProjectImage';
import { TechStack } from '@/src/components/TechStack/TechStack';
import styles from '../_helpers/Wrapper.module.css';
import '../_helpers/github-dark.css';
import { DataButton, DataButtonGrid } from '@/src/components/DataButtons/DataButtons';

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
				<Label>React</Label>
				<Label>TypeScript</Label>
				<Label>npm</Label>
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
			<ProjectImage maxImageHeight={313}>
				<ImageItem imagePos={'left'} title={'Complete design system'} image={cameraDemo}>
					<p>
						A design language built into a single React provider. Fully customizable token system
						across colors, spacing, motion, typography, icons, and more.
					</p>
				</ImageItem>
				<ImageItem title={'Realtime right out-of-the box'} image={cameraDemo}>
					<p>
						Production-ready abstractions over WebRTC, WebSocket, and SSE — video, audio, screen
						sharing, and live data streams without the boilerplate.
					</p>
				</ImageItem>
				<ImageItem imagePos={'left'} title={'Everything composes'} image={cameraDocs}>
					<p>
						Types flow between layers so the pieces fit together. Hooks return types the components
						already expect — less wiring, less glue code, more product.
					</p>
				</ImageItem>
				<ImageItem title={'Built to be lean'} image={cameraDemo}>
					<p>
						98 granular export paths mean your bundle only includes what you actually use. Import
						from the root or go granular — tree-shaking handles the rest.
					</p>
				</ImageItem>
				<ImageItem imagePos={'left'} title={'SSR ready, zero config'} image={cameraDemo}>
					<p>
						Full SSR and static rendering support for Next.js and Remix, out of the box. No
						wrappers, no workarounds — it just works.
					</p>
				</ImageItem>
			</ProjectImage>
			<h4>The Problem</h4>
			<p>
				Most frontend projects need the same things: a design system, a component library, and
				abstractions over complex APIs like WebRTC, etc. The typical answer - use multiple packages,
				none of which "speak" each other.
			</p>
			<p>
				Result? Wasted time (often days) wiring them together, wrangling types, writing glue code —
				before actually producing product logic.
			</p>
			<h4>Philosophy</h4>
			<p>
				Composability. Everything is designed to interlock. Types flow from one layer to the next,
				stores abstract boiler plate, and hooks bind elements auto-magically.
			</p>
			<p className={styles.figureTitle}>
				Example: Access, list and select a microphone in 2 lines.
			</p>
			<Highlight className="typescript">{addMic}</Highlight>
			<h4>What's in the package</h4>
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
			<h4>A hard problem - the build system</h4>
			<p>
				The package ships 98 granular export paths so consumers only pay for what they use. Getting
				that to work — dual CJS/ESM output, matching TypeScript definitions, and correct chunk
				splitting — required writing custom Rollup config that generates every entry point
				dynamically.
			</p>
			<p>
				The tradeoff was longer build times for a dramatically smaller footprint on the consuming
				side. Worth it.
			</p>
			<Highlight className="typescript">{granularExports}</Highlight>

			<h4>By The Numbers</h4>
			<DataButtonGrid>
				<DataButton value={'40+'} label={'Components'} />
				<DataButton value={'98'} label={'Export paths'} />
				<DataButton value={'34'} label={'npm releases'} />
				<DataButton value={'13+'} label={'Custom hooks'} />
				<DataButton value={'3'} label={'RT protocols'} />
				<DataButton value={'v0.1'} label={'Active / pre-1.0'} />
			</DataButtonGrid>

			<h4>Lessons learned</h4>
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
			<h4>My Role</h4>
			<p>
				Sole author and maintainer — component API design, build engineering, documentation, CI/CD,
				and the npm publishing lifecycle across 34 releases.
			</p>
		</Wrapper>
	);
}
