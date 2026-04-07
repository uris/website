/**
 * Safe parse string to JSON, returning original value on failure
 */
export function safeJsonParse(value: string) {
	try {
		return JSON.parse(value);
	} catch {
		return value;
	}
}
