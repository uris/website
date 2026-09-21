import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/server/contact/route';

const fetchMock = vi.fn<typeof fetch>();
const message = { from: 'person@example.com', text: 'Hello from the website' };
const request = (body: unknown) =>
	new Request('http://localhost/server/contact', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

beforeEach(() => {
	fetchMock.mockReset();
	vi.stubGlobal('fetch', fetchMock);
	vi.stubEnv('PRIVATE_API_BASE_URL', 'https://backend.example');
});
afterEach(() => {
	vi.unstubAllGlobals();
	vi.unstubAllEnvs();
});

describe('contact route', () => {
	it.each([
		null,
		[],
		1,
		'message',
		{},
		{ from: message.from },
		{ text: message.text },
		{ ...message, from: 42 },
		{ ...message, text: true },
		{ ...message, from: 'bad-email' },
		{ ...message, text: '   ' },
		{ ...message, text: 'abc' },
		{ ...message, from: '' },
	])('rejects invalid input without contacting the backend: %j', async (body) => {
		const response = await POST(request(body));
		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({ success: false, data: null, status: 400, message: expect.any(String) });
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('returns a JSON 400 for malformed JSON', async () => {
		const response = await POST(new Request('http://localhost/server/contact', { method: 'POST', body: '{' }));
		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ success: false, data: null, status: 400 });
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('forwards only contact fields and uses the HTTP status, not a body status', async () => {
		fetchMock.mockResolvedValue(Response.json({ success: true, status: 500 }, { status: 202 }));
		const response = await POST(request({ ...message, to: 'unexpected@example.com' }));
		expect(fetchMock).toHaveBeenCalledExactlyOnceWith('https://backend.example/sendgrid/contact-uris', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(message),
		});
		expect(response.status).toBe(202);
		expect(await response.json()).toEqual({ success: true, data: message, status: 202 });
	});
	it('accepts the backend success envelope without a body status', async () => {
		fetchMock.mockResolvedValue(Response.json({ success: true }));
		expect(await (await POST(request(message))).json()).toEqual({ success: true, data: message, status: 200 });
	});
	it.each([400, 429, 500, 503])(
		'preserves upstream HTTP failure %i without leaking backend details',
		async (status) => {
			fetchMock.mockResolvedValue(Response.json({ success: true, status: 200, error: 'private details' }, { status }));
			const response = await POST(request(message));
			expect(response.status).toBe(status);
			expect(await response.json()).toEqual({ success: false, data: null, status, message: 'Unable to send message' });
		},
	);
	it('preserves a non-JSON upstream HTTP failure', async () => {
		fetchMock.mockResolvedValue(new Response('upstream gateway error', { status: 503 }));
		const response = await POST(request(message));
		expect(response.status).toBe(503);
		expect(await response.json()).toMatchObject({ success: false, status: 503 });
	});
	it.each([null, {}, { success: false }, { success: 'true' }])(
		'rejects an invalid successful backend envelope: %j',
		async (body) => {
			fetchMock.mockResolvedValue(Response.json(body));
			const response = await POST(request(message));
			expect(response.status).toBe(502);
			expect(await response.json()).toMatchObject({ success: false, data: null, status: 502 });
		},
	);
	it.each(['not JSON', ''])('handles an invalid upstream success body: %j', async (body) => {
		fetchMock.mockResolvedValue(new Response(body));
		const response = await POST(request(message));
		expect(response.status).toBe(502);
		expect(await response.json()).toMatchObject({ success: false, status: 502 });
	});
	it('reports missing configuration without making a request', async () => {
		vi.stubEnv('PRIVATE_API_BASE_URL', undefined);
		const response = await POST(request(message));
		expect(response.status).toBe(500);
		expect(await response.json()).toEqual({
			success: false,
			data: null,
			status: 500,
			message: 'Unable to send message',
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it.each([new Error('private backend details'), 'offline'])('handles network rejection', async (error) => {
		fetchMock.mockRejectedValue(error);
		const response = await POST(request(message));
		expect(response.status).toBe(500);
		expect(await response.json()).toEqual({
			success: false,
			data: null,
			status: 500,
			message: 'Unable to send message',
		});
	});
});
