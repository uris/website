'use client';

import { ThemeProvider } from '@apple-pie/slice/providers/ThemeProvider';
import type { PropsWithChildren } from 'react';

type ProvidersProps = PropsWithChildren<{
	initialTheme: 'lightMode' | 'darkMode';
	initialSystem: boolean;
}>;

export function Providers({ children, initialTheme, initialSystem }: ProvidersProps) {
	return (
		<ThemeProvider initialTheme={initialTheme} initialSystem={initialSystem} global system>
			{children}
		</ThemeProvider>
	);
}
