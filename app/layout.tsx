import {
	getThemeHtmlAttributes,
	resolveInitialTheme,
} from '@apple-pie/slice/providers/themeServer';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { PropsWithChildren } from 'react';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
	title: 'Uris Design',
	description: 'AI workflows and project content.',
};

export default async function RootLayout({
	children,
}: Readonly<PropsWithChildren>) {
	const cookieStore = await cookies();
	const cookieTheme = cookieStore.get('slice-theme')?.value;
	const initialTheme = resolveInitialTheme({ cookieTheme });

	return (
		<html lang="en" {...getThemeHtmlAttributes(initialTheme)}>
			<body>
				<Providers initialTheme={initialTheme}>{children}</Providers>
			</body>
		</html>
	);
}
