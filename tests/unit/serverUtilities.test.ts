import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPrivateApiUrl } from '@/src/lib/server-env';
import { safeJsonParse } from '@/src/lib/shared/utils';

afterEach(() => vi.unstubAllEnvs());

describe('private API origin', () => {
	it('reads the current server environment on each call', () => {
		vi.stubEnv('PRIVATE_API_BASE_URL', 'https://backend.example');
		expect(getPrivateApiUrl('/contact')).toBe('https://backend.example/contact');
		vi.stubEnv('PRIVATE_API_BASE_URL', 'http://localhost:3001');
		expect(getPrivateApiUrl('/skills')).toBe('http://localhost:3001/skills');
	});
	it.each([undefined, ''])('requires a configured origin: %j', (value) => {
		vi.stubEnv('PRIVATE_API_BASE_URL', value);
		expect(() => getPrivateApiUrl('/contact')).toThrow('Missing required environment variable: PRIVATE_API_BASE_URL');
	});
});

describe('safeJsonParse', () => {
	it.each([
		['{"success":true}', { success: true }],
		['[1,"two"]', [1, 'two']],
		['null', null],
		['false', false],
		['42', 42],
		['"hello"', 'hello'],
	])('parses JSON %s', (raw, expected) => expect(safeJsonParse(raw)).toEqual(expected));
	it.each(['', 'plain text', '{incomplete', '  '])('preserves non-JSON input %j', (raw) =>
		expect(safeJsonParse(raw)).toBe(raw),
	);
});
