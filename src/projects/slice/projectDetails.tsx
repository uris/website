'use client';

import { Button, Label } from '@apple-pie/slice';
import { Carousel, CarouselItem } from '@/components/Carousel/Carousel';
import { CodeSnippet } from '@/components/CodeSnippet/CodeSnippet';
import { FigureTitle } from '@/components/FigureTitle/FigureTitle';
import { LinkList } from '@/components/LinkList/LinkList';
import { Logo } from '@/components/Logos/Logos';
import { ProjectTitle } from '@/components/ProjectTitle/ProjectTitle';
import { Section } from '@/components/Section/Section';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { TechStack } from '@/components/TechStack/TechStack';
import { Wrapper } from '@/projects/_helpers/Wrapper';
import styles from '@/projects/_helpers/Wrapper.module.css';
import { normalizeLanguage, normalizeTarget } from '@/utils/misc';
import { snippets } from './code-snippets';
import { images } from './images';
import projectJson from './project.json';

export default function SliceProjectDetails() {
	const header = projectJson.header || {};

	return (
		<Wrapper>
			<Section gradient={false}>
				<Logo name={header.brand.name} color={header.brand.color} size={64} margin={32} />
				<ProjectTitle>{header.title}</ProjectTitle>
				<SubTitle>{header.subtitle}</SubTitle>
				<TechStack>
					{header.techStack.map((item) => (
						<Label key={item}>{item}</Label>
					))}
				</TechStack>
				{!!header.links?.length && (
					<LinkList direction={'row'}>
						{header.links.map((link) => (
							<Button
								key={`${link.label}_${link.href}`}
								link={link.href}
								target={normalizeTarget(link.target)}
								iconLeft={link.iconLeft}
							>
								{link.label}
							</Button>
						))}
					</LinkList>
				)}
			</Section>
			<Section gradient={true}>
				<Carousel maxImageHeight={header.carousel.maxImageHeight}>
					{header.carousel.items.map((item) => (
						<CarouselItem
							key={item.title}
							title={item.title}
							imagePos={item.imagePos as any}
							image={images[item.image as keyof typeof images]}
							imageLight={images[item.imageLight as keyof typeof images]}
						>
							<p>{item.description}</p>
						</CarouselItem>
					))}
				</Carousel>
			</Section>
			<Section gradient={true}>
				<div className={styles.codeBlock}>
					<FigureTitle>Add and Update Microphone</FigureTitle>
					<CodeSnippet language={normalizeLanguage('JavaScript')} snippet={snippets.addMic} />
				</div>
			</Section>
		</Wrapper>
	);
}
