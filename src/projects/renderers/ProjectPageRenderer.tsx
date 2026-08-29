'use client';

import { Button, Label } from '@apple-pie/slice';
import type { StaticImageData } from 'next/image';
import { Carousel, CarouselItem } from '@/components/Carousel/Carousel';
import { CodeSnippet } from '@/components/CodeSnippet/CodeSnippet';
import { DataButton, DataButtonGrid } from '@/components/DataButtons/DataButtons';
import { FigureTitle } from '@/components/FigureTitle/FigureTitle';
import { LinkList } from '@/components/LinkList/LinkList';
import { ProjectTitle } from '@/components/ProjectTitle/ProjectTitle';
import { SectionTitle } from '@/components/SectionTitle/SectionTitle';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { TechStack } from '@/components/TechStack/TechStack';
import { Wrapper } from '@/projects/_helpers/Wrapper';
import type { ProjectPageData, ProjectSection } from '@/projects/_types/types';
import { Logo } from '@/src/components/Logos/Logos';
import { Section } from '@/src/components/Section/Section';
import { normalizeLanguage, normalizeTarget } from '@/utils/misc';
import styles from '../_helpers/Wrapper.module.css';

type ImageValue = string | StaticImageData | undefined;

export interface ProjectPageRendererProps {
	project: ProjectPageData;
	resolveImage?: (name?: string) => ImageValue;
	resolveSnippet?: (name?: string) => string | undefined;
}

// Generic renderer for projects details pulling info from the base project JSON
export function ProjectPageRenderer({
	project,
	resolveImage = () => undefined,
	resolveSnippet = () => undefined,
}: Readonly<ProjectPageRendererProps>) {
	const { header, sections } = project;

	return (
		<Wrapper>
			<Section gradient={false}>
				{header.brand?.type === 'logo' && header.brand.name && (
					<Logo name={header.brand.name} color={header.brand.color} size={64} margin={32} />
				)}
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

			{header.carousel && header.carousel.items.length > 0 && (
				<Section gradient={true}>
					<Carousel maxImageHeight={header.carousel.maxImageHeight}>
						{header.carousel.items.map((item) => (
							<CarouselItem
								key={item.title}
								title={item.title}
								imagePos={item.imagePos}
								image={resolveImage(item.image)}
								imageLight={resolveImage(item.imageLight)}
							>
								<p>{item.description}</p>
							</CarouselItem>
						))}
					</Carousel>
				</Section>
			)}

			{sections.map((section) => (
				<RenderedSection key={section.title} resolveSnippet={resolveSnippet} section={section} />
			))}
		</Wrapper>
	);
}

function RenderedSection({
	resolveSnippet,
	section,
}: Readonly<{ resolveSnippet: (name?: string) => string | undefined; section: ProjectSection }>) {
	return (
		<>
			<SectionTitle icon={section.icon}>{section.title}</SectionTitle>
			{section.blocks.map((block, index) => {
				const key = `${section.title}_${block.type}_${index}`;
				if (block.type === 'paragraph') return <p key={key}>{block.text}</p>;

				if (block.type === 'list')
					return (
						<ul key={key}>
							{block.items.map((item, itemIndex) => (
								<li key={`${key}_${item.label ?? itemIndex}`}>
									{item.label ? <strong>{item.label}</strong> : null}
									{item.label ? ' — ' : ''}
									{item.text}
								</li>
							))}
						</ul>
					);

				if (block.type === 'stats')
					return (
						<DataButtonGrid key={key}>
							{block.items.map((item) => (
								<DataButton key={`${item.label}_${item.value}`} value={item.value} label={item.label} />
							))}
						</DataButtonGrid>
					);

				const snippet = block.snippet ? resolveSnippet(block.snippet) : block.code;
				return (
					<div key={key} className={styles.codeBlock}>
						{block.title && <FigureTitle>{block.title}</FigureTitle>}
						<CodeSnippet language={normalizeLanguage(block.language)} snippet={snippet} />
					</div>
				);
			})}
		</>
	);
}
