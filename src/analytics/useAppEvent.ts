'use client';

import { usePostHog } from '@posthog/react';
import { useCallback } from 'react';
import type { AppEvent, AppEventInfo } from './events';
import { trackAppEvent } from './trackAppEvent';

export function useAppEvent() {
	const posthog = usePostHog();

	const postAppEvent = useCallback(
		<E extends AppEvent>(event: E, info: AppEventInfo[NoInfer<E>]) => {
			trackAppEvent(event, info, { client: posthog });
		},
		[posthog],
	);

	return { postAppEvent };
}
