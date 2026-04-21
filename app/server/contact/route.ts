import { NextResponse } from 'next/server';
import { getPrivateApiUrl } from '@/src/lib/server-env';

export async function POST(req: Request) {
	const message = await req.json();
	const { from, text } = message;

	// protect for valid message parts
	if (!from || !text) {
		const message = 'Message needs from and text fields';
		const status = 400;
		return NextResponse.json({ success: false, data: null, message, status }, { status });
	}

	try {
		const response = await fetch(getPrivateApiUrl('/sendgrid/contact-uris'), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(message),
		});

		// return response (note could be not successful)
		const data = await response.json();
		const { success, status } = data;
		return NextResponse.json({ success, data: message, status }, { status });
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Internal server error';
		return NextResponse.json({ success: false, data: null, error: errorMessage, status: 500 }, { status: 500 });
	}
}
