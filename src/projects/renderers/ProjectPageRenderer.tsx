'use client';

import { Button, Label } from '@apple-pie/slice';
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
import { resolveProjectImage, resolveProjectSnippet } from '@/projects/registry';
import type { ProjectPageData, ProjectSection } from '@/projects/server/types';
import { Logo } from '@/src/components/Logos/Logos';
import styles from '../_helpers/Wrapper.module.css';

export function ProjectPageRenderer({ project }: Readonly<{ project: ProjectPageData }>) {
	const { slug, header, sections } = project;

	return (
		<Wrapper>
			{header.brand?.type === 'logo' && header.brand.name && (
				<div
					style={{
						borderRadius: 12,
						border: '1px solid var(--core-outline-secondary)',
						padding: '12px',
						background: 'var(--core-surface-primary)',
					}}
				>
					<Logo
						name={header.brand.name}
						color={header.brand.color}
						size={header.brand.size}
						margin={0}
					/>
				</div>
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

			{header.carousel && header.carousel.items.length > 0 && (
				<Carousel maxImageHeight={header.carousel.maxImageHeight}>
					{header.carousel.items.map((item) => (
						<CarouselItem
							key={item.title}
							title={item.title}
							imagePos={item.imagePos}
							image={resolveProjectImage(slug, item.image)}
							imageLight={resolveProjectImage(slug, item.imageLight)}
						>
							<p>{item.description}</p>
						</CarouselItem>
					))}
				</Carousel>
			)}

			{sections.map((section) => (
				<RenderedSection key={section.title} slug={slug} section={section} />
			))}
		</Wrapper>
	);
}

function RenderedSection({
	slug,
	section,
}: Readonly<{ slug: ProjectPageData['slug']; section: ProjectSection }>) {
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
								<DataButton
									key={`${item.label}_${item.value}`}
									value={item.value}
									label={item.label}
								/>
							))}
						</DataButtonGrid>
					);

				const snippet = block.snippet ? resolveProjectSnippet(slug, block.snippet) : block.code;
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

function normalizeLanguage(
	language?: string,
): 'typescript' | 'javascript' | 'css' | 'html' | 'json' {
	if (language === 'javascript' || language === 'css' || language === 'html' || language === 'json')
		return language;
	return 'typescript';
}

function normalizeTarget(target?: string): '_blank' | '_self' | '_parent' | '_top' | undefined {
	if (target === '_blank' || target === '_self' || target === '_parent' || target === '_top')
		return target;
	return undefined;
}
