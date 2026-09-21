import { posthog } from 'posthog-js';

import { getAnalyticsConfig } from './config';

export function initializeAnalytics() {
	// get env variables
	const { enabled, token, host } = getAnalyticsConfig();

	// Next.js runs this before hydration => means component effects can capture events immediately.
	if (enabled && token) {
		// Embedded project pages can emit custom events, but only the outer window tracks page events.
		const isTopLevel = window.self === window.top;

		posthog.init(token, {
			api_host: host,
			autocapture: false,
			capture_dead_clicks: false,
			disable_session_recording: true,
			defaults: '2026-05-30',
			capture_pageview: isTopLevel ? 'history_change' : false,
			capture_pageleave: isTopLevel,
		});
	}
}
