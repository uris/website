'use client';

import { Logo } from '@/components/Logos/Logos';
import { ProjectTitle } from '@/components/ProjectTitle/ProjectTitle';
import { Section } from '@/components/Section/Section';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { Wrapper } from '@/projects/_helpers/Wrapper';
import projectJson from './project.json';

export default function PayPalBeacon() {
	const header = projectJson.header || {};

	return (
		<Wrapper>
			<Section gradient={false}>
				<Logo name={'rc'} color={'var(--core-icon-primary)'} size={64} margin={'0 0 128px 0'} />
				<ProjectTitle>{header.title}</ProjectTitle>
				<SubTitle margin={false}>{header.subtitle}</SubTitle>
			</Section>
		</Wrapper>
	);
}
