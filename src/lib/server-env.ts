function getRequiredEnv(name: string): string {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

export function getPrivateApiUrl(path: string): string {
	const baseUrl = getRequiredEnv('PRIVATE_API_BASE_URL');
	return `${baseUrl}${path}`
}
