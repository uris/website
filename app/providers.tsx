'use client';

import { ThemeProvider } from '@apple-pie/slice/providers/ThemeProvider';
import type { PropsWithChildren } from 'react';
import { PostHogProvider } from '@/src/analytics/PostHogProvider';

/**
 * SLICE theme provider wrapping analytics provider
 */

type ProvidersProps = PropsWithChildren<{
	initialTheme: 'lightMode' | 'darkMode';
	initialSystem: boolean;
}>;

export function Providers({ children, initialTheme, initialSystem }: ProvidersProps) {
	return (
		<ThemeProvider initialTheme={initialTheme} initialSystem={initialSystem} global>
			<PostHogProvider>{children}</PostHogProvider>
		</ThemeProvider>
	);
}
