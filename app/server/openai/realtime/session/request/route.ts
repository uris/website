import { NextResponse } from 'next/server';
import { createRealtimeSessionKey } from '@/src/lib/openai/openai';

export async function POST(req: Request) {
	const body = await req.json();
	const { noiseReduction } = body;
	const response = await createRealtimeSessionKey(noiseReduction);
	return NextResponse.json(response, { status: response.status });
}
