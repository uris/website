import { realtimeSessionRequests } from '@/src/lib/openai/_settings';
import { getPrivateApiUrl } from '@/src/lib/server-env';
import type { BaseResponse } from '@/src/lib/shared/types';
import { safeJsonParse } from '@/src/lib/shared/utils';

export async function createRealtimeSessionKey(noiseReduction = 'far_field'): Promise<BaseResponse> {
	try {
		const response = await fetch(getPrivateApiUrl('/openai/realtime/session'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(realtimeSessionRequests(noiseReduction)),
		});

		const rawBody = await response.text();
		const data = rawBody ? safeJsonParse(rawBody) : null;

		if (response.ok) {
			return { success: true, data, status: response.status };
		}

		return {
			success: false,
			data: null,
			status: response.status,
			message: response.statusText,
		};
	} catch (error) {
		return {
			success: false,
			data: null,
			status: 500,
			message: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}
