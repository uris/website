'use client';

import { FlexDiv, Preset, Spacer, useTheme } from '@apple-pie/slice';
import Image from 'next/image';
import light from '@/assets/skillsbg.png';
import dark from '@/assets/skillsbg-dark.png';
import { AppChip } from '@/src/components/AppChip/AppChip';
import { SkillSlider } from '@/src/components/SkillSlider/SkillSlider';
import styles from './Skills.module.css';

const designLeadershipSkills = [
	{ name: 'Product design (UI/UX/IX)', value: 95, level: 'principal' },
	{ name: 'Design systems', value: 95, level: 'principal' },
	{ name: 'Creative and brand leadership', value: 95, level: 'principal' },
	{ name: 'UX strategy & vision', value: 95, level: 'principal' },
	{ name: 'Team leadership / building', value: 95, level: 'principal' },
	{ name: 'User Research & Synthesis', value: 80, level: 'advanced' },
];

const frontendSkills = [
	{ name: 'HTML / CSS / JavaScript', value: 95, level: 'principal' },
	{ name: 'TypeScript', value: 95, level: 'principal' },
	{ name: 'React 18 / 19', value: 95, level: 'principal' },
	{ name: 'State (Zustand / Redux)', value: 95, level: 'principal' },
	{ name: 'Next.js', value: 80, level: 'advanced' },
	{ name: 'Interaction architecture', value: 95, level: 'principal' },
	{ name: 'Performance', value: 95, level: 'advanced' },
	{ name: 'Animation & Polish', value: 80, level: 'advanced' },
];

const backendSkills = [
	{ name: 'Node.js / Express', value: 95, level: 'advanced' },
	{ name: 'PostgreSQL', value: 80, level: 'advanced' },
	{ name: 'Redis', value: 90, level: 'principal' },
	{ name: 'REST API design', value: 80, level: 'advanced' },
	{ name: 'Data modeling', value: 80, level: 'advanced' },
	{ name: 'CI/CD, Docker', value: 80, level: 'advanced' },
];

const designMethods = [
	'Vision / North Star',
	'Design systems',
	'Interaction design',
	'Information architecture',
	'Product strategy',
	'Workshop facilitation',
	'Cross-functional leadership',
	'UX writing',
	'Rapid prototyping',
];

const engineeringTools = [
	'VS Code',
	'Cursor',
	'GitHub',
	'Storybook',
	'Chromatic',
	'Jest',
	'Playwright',
	'Docker',
];

const leadershipTools = [
	'Figma',
	'Creative direction',
	'Mentoring',
	'Roadmapping',
	'Design critique',
	'Stakeholder alignment',
	'System thinking',
	'Delivery planning',
];

export function Skills() {
	const { isDark } = useTheme();

	return (
		<div className={styles.wrapper}>
			<div className={styles.bgImage} style={{ opacity: 0.25 }}>
				<Image
					alt={'background image'}
					quality={80}
					src={isDark ? dark : light}
					fill
					style={{ objectFit: 'contain' }}
					sizes={'100vw'}
					priority
				/>
			</div>
			<FlexDiv preset={Preset.FillScroll} scrollY={true} padding={64} align={'center'}>
				<div className={styles.container}>
					<div className={styles.skills}>
						<div className={`${styles.heading} heading-s-bold`}>Design + Leadership</div>

						<div className={'body-m-regular core-text-secondary'}>
							Mature design leadership across product, systems, interaction, and brand. I can set
							direction, elevate quality, align teams, and stay close to execution without losing
							the bigger picture.
						</div>

						<div className={styles.section}>
							<div className={`${styles.heading} bold-l-bold`}>Core strengths</div>
							{designLeadershipSkills.map((skill) => (
								<SkillSlider
									key={skill.name}
									name={skill.name}
									value={skill.value}
									level={skill.level}
								/>
							))}
						</div>
						<div className={styles.section}>
							<div className={`${styles.heading} bold-l-bold`}>Methods</div>
							<div className={styles.chips}>
								{designMethods.map((method) => (
									<AppChip key={method} name={method} />
								))}
							</div>
						</div>
						<div className={styles.section}>
							<div className={`${styles.heading} bold-l-bold`}>Leadership lens</div>
							<div className={styles.chips}>
								{leadershipTools.map((item) => (
									<AppChip key={item} name={item} />
								))}
							</div>
						</div>
					</div>
					<div className={styles.skills}>
						<div className={`${styles.heading} heading-s-bold`}>Development</div>
						<div className={styles.section}>
							<div className={`${styles.heading} bold-l-bold`}>Front end</div>
							<div className={'body-m-regular core-text-secondary'}>
								Principal-level front-end craft with a strong eye for systems, performance,
								interaction detail, and turning ambitious design into shippable product.
							</div>
							<Spacer size={8} />
							{frontendSkills.map((skill) => (
								<SkillSlider
									key={skill.name}
									name={skill.name}
									value={skill.value}
									level={skill.level}
								/>
							))}
						</div>
						<div className={styles.section}>
							<div className={`${styles.heading} bold-l-bold`}>Back end</div>
							<div className={'body-m-regular core-text-secondary'}>
								Comfortable building the server side too: APIs, data models, integration layers, and
								the practical infrastructure needed to ship end-to-end experiences.
							</div>
							<Spacer size={8} />
							{backendSkills.map((skill) => (
								<SkillSlider
									key={skill.name}
									name={skill.name}
									value={skill.value}
									level={skill.level}
								/>
							))}
						</div>
						<div className={styles.section}>
							<div className={`${styles.heading} bold-l-bold`}>Stack and tools</div>
							<div className={styles.chips}>
								{engineeringTools.map((tool) => (
									<AppChip key={tool} name={tool} />
								))}
							</div>
						</div>
					</div>
				</div>
			</FlexDiv>
		</div>
	);
}
