'use client';

import { PostHogProvider as Provider } from '@posthog/react';
import { posthog } from 'posthog-js';
import type { PropsWithChildren } from 'react';

export function PostHogProvider({ children }: Readonly<PropsWithChildren>) {
	return <Provider client={posthog}>{children}</Provider>;
}
