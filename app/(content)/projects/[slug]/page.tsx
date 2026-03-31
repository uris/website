type ProjectPageProps = {
	params: Promise<{
		slug: string;
	}>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
	const { slug } = await params;

	return (
		<article style={{ padding: 32, maxWidth: 960 }}>
			<p
				style={{
					margin: 0,
					fontSize: 12,
					textTransform: 'uppercase',
					letterSpacing: '0.08em',
					opacity: 0.64,
				}}
			>
				Project Summary
			</p>
			<h1 style={{ marginBottom: 8 }}>{slug}</h1>
			<p style={{ marginTop: 0, maxWidth: 720 }}>
				This route is a server-rendered content page stub for project goals,
				scope, team, and supporting context.
			</p>
		</article>
	);
}
