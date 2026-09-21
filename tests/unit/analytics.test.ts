import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { getAnalyticsConfig } from '@/src/analytics/config';
import { AppEvent } from '@/src/analytics/events';
import { trackAppEvent } from '@/src/analytics/trackAppEvent';

const { init, capture } = vi.hoisted(() => ({ init: vi.fn(), capture: vi.fn() }));
vi.mock('posthog-js', () => ({ posthog: { init, capture } }));

beforeEach(() => {
	vi.stubEnv('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN', 'test-token');
	vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', 'https://analytics.example.com');
	vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENABLED', 'true');
	vi.stubEnv('NEXT_PUBLIC_ANALYTICS_DEV_ENABLED', 'false');
	vi.stubEnv('NODE_ENV', 'production');
});
afterEach(() => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
});

it.each([
	['NEXT_PUBLIC_ANALYTICS_ENABLED', 'false'],
	['NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN', ''],
	['NEXT_PUBLIC_POSTHOG_HOST', ''],
	['NODE_ENV', 'development'],
])('disables initialization and custom capture when %s is %s', async (key, value) => {
	vi.stubEnv(key, value);
	vi.stubGlobal('window', {});
	expect(getAnalyticsConfig().enabled).toBe(false);
	vi.resetModules();
	await import('../../instrumentation-client');
	trackAppEvent(AppEvent.ContactSubmitted, null);
	expect(init).not.toHaveBeenCalled();
	expect(capture).not.toHaveBeenCalled();
});

it('requires explicit development opt-in and uses it for custom capture too', () => {
	vi.stubEnv('NODE_ENV', 'development');
	vi.stubEnv('NEXT_PUBLIC_ANALYTICS_DEV_ENABLED', 'true');
	vi.stubGlobal('window', {});
	expect(getAnalyticsConfig().enabled).toBe(true);
	trackAppEvent(AppEvent.ContactSubmitted, null);
	expect(capture).toHaveBeenCalledWith('contact_submitted', undefined);
});

it.each([true, false])('initializes automatic page events only at top level: %s', async (isTopLevel) => {
	const self = {};
	vi.stubGlobal('window', { self, top: isTopLevel ? self : {} });
	vi.resetModules();
	await import('../../instrumentation-client');
	expect(init).toHaveBeenCalledWith(
		'test-token',
		expect.objectContaining({
			capture_pageview: isTopLevel ? 'history_change' : false,
			capture_pageleave: isTopLevel,
			autocapture: false,
			disable_session_recording: true,
		}),
	);
});

it('does not capture on the server and does not propagate SDK failures', () => {
	trackAppEvent(AppEvent.ContactSubmitted, null);
	expect(capture).not.toHaveBeenCalled();
	vi.stubGlobal('window', {});
	capture.mockImplementationOnce(() => {
		throw new Error('SDK failed');
	});
	expect(() => trackAppEvent(AppEvent.ContactSubmitted, null)).not.toThrow();
});
