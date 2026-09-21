export type ContactMessage = { from: string; text: string };

export function isValidContactEmail(value: unknown): value is string {
	return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidContactText(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 3;
}

export function isContactMessage(value: unknown): value is ContactMessage {
	if (typeof value !== 'object' || value === null) return false;
	return 'from' in value && 'text' in value && isValidContactEmail(value.from) && isValidContactText(value.text);
}
