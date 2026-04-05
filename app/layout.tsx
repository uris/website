import {
	getThemeHtmlAttributes,
	resolveInitialTheme,
} from '@apple-pie/slice/providers/themeServer';
import type { Metadata } from 'next';
import { Funnel_Sans } from 'next/font/google';
import { cookies } from 'next/headers';
import type { PropsWithChildren } from 'react';
import { Providers } from './providers';
import './globals.css';
import '@apple-pie/slice/styles.css';

const funnelSans = Funnel_Sans({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-funnel-sans',
});

export const metadata: Metadata = {
	title: 'Uris Design',
	description: 'AI workflows and project content.',
};

export default async function RootLayout({ children }: Readonly<PropsWithChildren>) {
	const cookieStore = await cookies();
	const cookieTheme = cookieStore.get('slice-theme')?.value;
	const systemTheme = cookieStore.get('slice-system-theme')?.value === 'true';
	const initialTheme = resolveInitialTheme({ cookieTheme });

	return (
		<html
			lang="en"
			className={funnelSans.variable}
			{...getThemeHtmlAttributes(initialTheme)}
		>
			<body>
				<Providers initialTheme={initialTheme} systemTheme={systemTheme}>
					{children}
				</Providers>
			</body>
		</html>
	);
}
