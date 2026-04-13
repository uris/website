import { Button, Label, Spacer } from '@apple-pie/slice';
import cameraDemo from '@/assets//projects/slice/slice-camera-demo.png';
import cameraDocs from '@/assets//projects/slice/slice-camera-docs.png';
import { Wrapper } from '@/projects/_helpers/Wrapper';
import { LinkList } from '@/src/components/LinkList/LinkList';
import { Logo } from '@/src/components/Logos/Logos';
import ProjectImage, { ImageItem } from '@/src/components/ProjectImage/ProjectImage';
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
			<ProjectImage minHeight={200}>
				<ImageItem imagePos={'left'} title={'Full Demos'} image={cameraDemo}>
					<p>
						Each component, hook and store has a demo page that showcases the component in action
						allowing you to interact with the element and see how it works in different scenarios
						using different prop. and see how it works in different scenarios using different prop.
					</p>
				</ImageItem>
				<ImageItem title={'Documentation'} image={cameraDocs}>
					<p>
						Each component, hook sand store has a demo page that showcases the component in action
						allowing you to interact with the element and see how it works in different scenarios
						using different props.
					</p>
				</ImageItem>
			</ProjectImage>
		</Wrapper>
	);
}
