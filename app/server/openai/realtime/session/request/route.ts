import { NextResponse } from 'next/server';
import { createRealtimeSessionKey } from '@/src/lib/openai/openai';

function failure(status: number, message: string) {
	return NextResponse.json({ success: false, data: null, message, status }, { status });
}

export async function POST(req: Request) {
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return failure(400, 'Invalid JSON body');
	}
	if (typeof body !== 'object' || body === null || Array.isArray(body)) {
		return failure(400, 'Expected a session options object');
	}
	const noiseReduction = 'noiseReduction' in body ? body.noiseReduction : undefined;
	if (noiseReduction !== undefined && noiseReduction !== 'near_field' && noiseReduction !== 'far_field') {
		return failure(400, 'Invalid noise reduction mode');
	}
	try {
		const response = await createRealtimeSessionKey(noiseReduction);
		if (response.status === 204) return new NextResponse(null, { status: 204 });
		return NextResponse.json(response, { status: response.status });
	} catch {
		return failure(500, 'Unable to create session');
	}
}
