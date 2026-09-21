import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/server/openai/realtime/session/request/route';

const { createSession } = vi.hoisted(() => ({ createSession: vi.fn() }));
vi.mock('@/src/lib/openai/openai', () => ({ createRealtimeSessionKey: createSession }));
const request = (body: unknown) =>
	new Request('http://localhost/server/openai/realtime/session/request', {
		method: 'POST',
		body: JSON.stringify(body),
	});
beforeEach(() => {
	createSession.mockReset();
});

describe('session route', () => {
	it.each([
		['near_field', 'near_field'],
		['far_field', 'far_field'],
		[undefined, undefined],
	])('accepts noise reduction %j', async (input, expected) => {
		const result = { success: true, data: { value: 'test-token' }, status: 200 };
		createSession.mockResolvedValue(result);
		const response = await POST(request({ noiseReduction: input }));
		expect(createSession).toHaveBeenCalledExactlyOnceWith(expected);
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual(result);
	});
	it.each([null, [], 5, { noiseReduction: null }, { noiseReduction: 1 }, { noiseReduction: 'invalid' }])(
		'rejects invalid payload %j',
		async (body) => {
			const response = await POST(request(body));
			expect(response.status).toBe(400);
			expect(await response.json()).toMatchObject({ success: false, data: null, status: 400 });
			expect(createSession).not.toHaveBeenCalled();
		},
	);
	it('rejects malformed JSON', async () => {
		const response = await POST(new Request('http://localhost', { method: 'POST', body: '{' }));
		expect(response.status).toBe(400);
		expect(createSession).not.toHaveBeenCalled();
	});
	it('preserves an upstream rejection', async () => {
		const result = { success: false, data: null, status: 429, message: 'Too Many Requests' };
		createSession.mockResolvedValue(result);
		const response = await POST(request({}));
		expect(response.status).toBe(429);
		expect(await response.json()).toEqual(result);
	});
	it('returns no body for an upstream 204', async () => {
		createSession.mockResolvedValue({ success: true, data: null, status: 204 });
		const response = await POST(request({}));
		expect(response.status).toBe(204);
		expect(await response.text()).toBe('');
	});
	it('handles unexpected session creation failure', async () => {
		createSession.mockRejectedValue(new Error('private detail'));
		const response = await POST(request({}));
		expect(response.status).toBe(500);
		expect(await response.json()).toEqual({
			success: false,
			data: null,
			status: 500,
			message: 'Unable to create session',
		});
	});
});
