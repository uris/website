import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRealtimeSessionKey } from '@/src/lib/openai/openai';

const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => {
	fetchMock.mockReset();
	vi.stubGlobal('fetch', fetchMock);
	vi.stubEnv('PRIVATE_API_BASE_URL', 'https://backend.example');
});
afterEach(() => {
	vi.unstubAllGlobals();
	vi.unstubAllEnvs();
});

describe('realtime session proxy', () => {
	it.each([
		['{"value":"test-token"}', { value: 'test-token' }],
		['plain-token', 'plain-token'],
		['', null],
	])('accepts a successful body %j', async (raw, data) => {
		fetchMock.mockResolvedValue(new Response(raw, { status: 201 }));
		expect(await createRealtimeSessionKey()).toEqual({ success: true, data, status: 201 });
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('https://backend.example/openai/realtime/session');
		expect(init).toMatchObject({ method: 'POST', headers: { 'Content-Type': 'application/json' } });
		expect(JSON.parse(init?.body as string)).toMatchObject({
			type: 'realtime',
			audio: { input: { noise_reduction: { type: 'far_field' } } },
		});
	});
	it('forwards the chosen noise reduction mode', async () => {
		fetchMock.mockResolvedValue(Response.json({ value: 'test-token' }));
		await createRealtimeSessionKey('near_field');
		expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string).audio.input.noise_reduction.type).toBe('near_field');
	});
	it('handles a successful no-content response', async () => {
		fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
		expect(await createRealtimeSessionKey()).toEqual({ success: true, data: null, status: 204 });
	});
	it.each([401, 429, 503])('preserves HTTP rejection %i and discards private payloads', async (status) => {
		fetchMock.mockResolvedValue(new Response('private error', { status, statusText: 'Unavailable' }));
		expect(await createRealtimeSessionKey()).toEqual({ success: false, data: null, status, message: 'Unavailable' });
	});
	it.each([
		[new Error('offline'), 'offline'],
		['offline', 'Unknown error'],
	])('handles network failure', async (error, message) => {
		fetchMock.mockRejectedValue(error);
		expect(await createRealtimeSessionKey()).toEqual({ success: false, data: null, status: 500, message });
	});
	it('reports missing origin before fetching', async () => {
		vi.stubEnv('PRIVATE_API_BASE_URL', undefined);
		expect(await createRealtimeSessionKey()).toMatchObject({
			success: false,
			status: 500,
			message: 'Missing required environment variable: PRIVATE_API_BASE_URL',
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('handles a response body read failure', async () => {
		const response = new Response('body');
		vi.spyOn(response, 'text').mockRejectedValue(new Error('body interrupted'));
		fetchMock.mockResolvedValue(response);
		expect(await createRealtimeSessionKey()).toMatchObject({
			success: false,
			status: 500,
			message: 'body interrupted',
		});
	});
});
