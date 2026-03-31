'use client';

import { ThemeProvider } from '@apple-pie/slice/providers/ThemeProvider';
import type { PropsWithChildren } from 'react';

type ProvidersProps = PropsWithChildren<{
	initialTheme: 'lightMode' | 'darkMode';
}>;

export function Providers({ children, initialTheme }: ProvidersProps) {
	return (
		<ThemeProvider initialTheme={initialTheme} global system>
			{children}
		</ThemeProvider>
	);
}
