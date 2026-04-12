'use client';

import { FlexDiv, Preset } from '@apple-pie/slice';
import { projectMap } from '@/app/(content)/projects/[slug]/_projectsMap';
import NotFound from '@/projects/_helpers/NotFound';

export function ProjectDetails({ slug }: Readonly<{ slug: string }>) {
	const Project = projectMap[slug as keyof typeof projectMap];

	// not found
	if (!Project)
		return (
			<FlexDiv preset={Preset.Window} justify="center" align="center">
				<NotFound />
			</FlexDiv>
		);

	return (
		<FlexDiv preset={Preset.Window} justify="center" align="center">
			<Project />
		</FlexDiv>
	);
}
