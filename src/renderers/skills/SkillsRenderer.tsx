'use client';

import { FlexDiv, Preset, Spacer } from '@apple-pie/slice';
import { AppChip } from '@/src/components/AppChip/AppChip';
import { SkillSlider } from '@/src/components/SkillSlider/SkillSlider';
import type { SkillsColumn, SkillsDocument, SkillsSection } from '@/src/content/skills/types';
import styles from '@/src/surfaces/skills/Skills.module.css';

function SkillsSectionRenderer({ section }: Readonly<{ section: SkillsSection }>) {
	return (
		<div className={styles.section}>
			<div className={styles.sectionHeading}>
				<div className={`${styles.heading} bold-l-bold`}>{section.title}</div>
				{section.description && <div className={'body-m-regular core-text-secondary'}>{section.description}</div>}
			</div>
			{section.description && section.type === 'sliders' && <Spacer size={8} />}
			{section.type === 'sliders' &&
				section.items.map((skill) => (
					<SkillSlider key={skill.name} name={skill.name} value={skill.value} level={skill.level} />
				))}
			{section.type === 'chips' && (
				<div className={styles.chips}>
					{section.items.map((item) => (
						<AppChip key={item} name={item} />
					))}
				</div>
			)}
		</div>
	);
}

function SkillsColumnRenderer({ column }: Readonly<{ column: SkillsColumn }>) {
	return (
		<div className={styles.skills}>
			<div className={`${styles.heading} heading-s-bold`}>{column.title}</div>
			{column.description && <div className={'body-m-regular core-text-secondary'}>{column.description}</div>}
			{column.sections.map((section) => (
				<SkillsSectionRenderer key={section.title} section={section} />
			))}
		</div>
	);
}

export function SkillsRenderer({ document }: Readonly<{ document: SkillsDocument }>) {
	return (
		<FlexDiv preset={Preset.FillScroll} scrollY={true} padding={64} align={'center'}>
			<div className={styles.container}>
				{document.columns.map((column) => (
					<SkillsColumnRenderer key={column.title} column={column} />
				))}
			</div>
		</FlexDiv>
	);
}
