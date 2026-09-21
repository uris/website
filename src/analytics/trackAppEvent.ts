import { type PostHog, posthog } from 'posthog-js';
import { getAnalyticsConfig } from './config';
import { AppEvent, type AppEventInfo } from './events';

type TrackAppEventOptions = {
	client?: Pick<PostHog, 'capture'>;
};

// for use by imperative handlers such as the Vi stores.
export function trackAppEvent<E extends AppEvent>(
	event: E,
	info: AppEventInfo[NoInfer<E>],
	{ client = posthog }: TrackAppEventOptions = {},
): void {
	if (typeof window === 'undefined') return;

	try {
		if (!getAnalyticsConfig().enabled) return;
		if (event === AppEvent.ViSessionEnded) {
			// Do not leave the end event in a batch when the document is unloading.
			client.capture(event, info ?? undefined, { transport: 'sendBeacon', send_instantly: true });
		} else {
			client.capture(event, info ?? undefined);
		}
	} catch {
		// analytics must never interrupt a conversation or turn a successful submission into a failure.
		// never re-throw!
	}
}
