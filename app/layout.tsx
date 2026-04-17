import {
	getThemeHtmlAttributes,
	resolveInitialTheme,
} from '@apple-pie/slice/providers/themeServer';
import type { Metadata } from 'next';
import { Funnel_Sans, Google_Sans_Code } from 'next/font/google';
import { cookies } from 'next/headers';
import type { PropsWithChildren } from 'react';
import { Providers } from './providers';
import './globals.css';
import '@apple-pie/slice/styles.css';

// setup for funnel sans google font
const funnelSans = Funnel_Sans({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-funnel-sans',
});

// setup for google sans code
const googleSansCode = Google_Sans_Code({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-google-sans-code',
	adjustFontFallback: false,
});

// setup page meta
export const metadata: Metadata = {
	title: 'Uris Design',
	description: 'AI workflows and project content.',
	icons: {
		icon: '/icon.png',
		apple: '/icon.png',
	},
};

export default async function RootLayout({ children }: Readonly<PropsWithChildren>) {
	const cookieStore = await cookies();
	const activeTheme = cookieStore.get('slice-theme')?.value;
	const systemTheme = cookieStore.get('slice-system-theme')?.value === 'true';
	const { initialTheme, initialSystem } = resolveInitialTheme({ activeTheme, systemTheme });

	return (
		<html
			lang="en"
			className={`${funnelSans.variable} ${googleSansCode.variable}`}
			{...getThemeHtmlAttributes(initialTheme)}
		>
			<body>
				<Providers initialTheme={initialTheme} initialSystem={initialSystem}>
					{children}
				</Providers>
			</body>
		</html>
	);
}
