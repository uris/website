import Link from 'next/link';
import type { PropsWithChildren } from 'react';

export default function ContentLayout({ children }: PropsWithChildren) {
	return (
		<div>
			<header
				style={{
					padding: '24px 32px',
					borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
				}}
			>
				<Link href="/">Back to Workspace</Link>
			</header>
			{children}
		</div>
	);
}
