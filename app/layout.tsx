import { getThemeHtmlAttributes, resolveInitialTheme } from '@apple-pie/slice/providers/themeServer';
import type { Metadata } from 'next';
import { Funnel_Sans } from 'next/font/google';
import localFont from 'next/font/local';
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

// setup for local JetBrains Mono
const jetBrainsMono = localFont({
	src: [
		{
			path: '../public/fonts/JetBrainsMono-Regular.woff2',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../public/fonts/JetBrainsMono-Italic.woff2',
			weight: '400',
			style: 'italic',
		},
	],
	display: 'swap',
	variable: '--font-jetbrains-mono',
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
			className={`${funnelSans.variable} ${jetBrainsMono.variable}`}
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
