'use client';

import { ThemeProvider } from '@apple-pie/slice/providers/ThemeProvider';
import type { PropsWithChildren } from 'react';

type ProvidersProps = PropsWithChildren<{
	initialTheme: 'lightMode' | 'darkMode';
	systemTheme: boolean;
}>;

export function Providers({ children, initialTheme, systemTheme }: ProvidersProps) {
	return (
		<ThemeProvider initialTheme={initialTheme} global system={systemTheme}>
			{children}
		</ThemeProvider>
	);
}
