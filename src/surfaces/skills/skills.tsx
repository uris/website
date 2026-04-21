'use client';

import { useTheme } from '@apple-pie/slice';
import Image from 'next/image';
import light from '@/assets/skillsbg.png';
import dark from '@/assets/skillsbg-dark.png';
import skills from '@/src/content/skills/skills.json';
import type { SkillsDocument } from '@/src/content/skills/types';
import { SkillsRenderer } from '@/src/renderers/skills/SkillsRenderer';
import styles from './Skills.module.css';

export function Skills() {
	const { isDark } = useTheme();
	const document = skills as SkillsDocument;

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
			<SkillsRenderer document={document} />
		</div>
	);
}
