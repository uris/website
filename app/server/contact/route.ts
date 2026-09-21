import { NextResponse } from 'next/server';
import { isContactMessage } from '@/src/lib/contact-validation';
import { getPrivateApiUrl } from '@/src/lib/server-env';

function failure(status: number, message = 'Unable to send message') {
	return NextResponse.json({ success: false, data: null, message, status }, { status });
}

export async function POST(req: Request) {
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return failure(400, 'Invalid JSON body');
	}
	if (!isContactMessage(body)) {
		return failure(
			400,
			'Provide a valid email and a message of at least four characters, excluding surrounding whitespace',
		);
	}
	const message = { from: body.from, text: body.text };

	try {
		const response = await fetch(getPrivateApiUrl('/sendgrid/contact-uris'), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(message),
		});
		// The backend carries status in HTTP, not in its JSON envelope.
		if (!response.ok) return failure(response.status);
		const data = await response.json().catch(() => null);
		if (data?.success !== true) return failure(502);
		return NextResponse.json({ success: true, data: message, status: response.status }, { status: response.status });
	} catch {
		return failure(500);
	}
}
