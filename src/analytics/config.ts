// Next.js embeds public settings at build time.
export function getAnalyticsConfig() {
	const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
	const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
	const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
	const allowDevelopment = process.env.NEXT_PUBLIC_ANALYTICS_DEV_ENABLED === 'true';
	return {
		token,
		host,
		enabled: Boolean(enabled && token && host && (process.env.NODE_ENV === 'production' || allowDevelopment)),
	};
}
