import { useMDStreamBuffer } from '@apple-pie/slice';
import { useEffect, useState } from 'react';
import { useViConnected } from '@/src/stores/ai/viStore';
import type { ViResponse } from '@/src/stores/responses/_types';
import {
	useViLastResponse,
	useViResponses,
	useViResponsesActions,
} from '@/src/stores/responses/responsesStore';

const DEFAULT_MARKER = ' [[END-MARKER]]';
export function useActiveResponse(onReset?: () => void, endMarker?: string) {
	const lastResponse = useViLastResponse();
	const responses = useViResponses();
	const responsesActions = useViResponsesActions();
	const connected = useViConnected();
	const streamEnd = lastResponse?.delta === undefined && lastResponse?.active === false;
	const addMarker = endMarker || endMarker === undefined;
	const marker = addMarker ? DEFAULT_MARKER : undefined;
	const [combined, setCombined] = useState<ViResponse[]>(responses);

	const { healthy, append, reset, raw, pendingCharacters } = useMDStreamBuffer({
		healthyEndMarker: marker,
		includeLinksAndImages: true,
		paceDelayMs: 50,
		paceChunkSize: 1,
	});

	// append deltas - if disconnected don't append
	useEffect(() => {
		if (connected && lastResponse?.delta) append(lastResponse.delta);
	}, [lastResponse, append, connected]);

	// update the responses when healthy markdown updates
	useEffect(() => {
		if (!healthy || !lastResponse) return;
		const streamResponse = { ...lastResponse, value: healthy };
		setCombined(responses ? [...responses, streamResponse] : [streamResponse]);
	}, [healthy, lastResponse, responses]);

	// reset when not streaming, the buffer is fully flushed, but raw content is still present
	useEffect(() => {
		if (streamEnd && pendingCharacters === 0 && raw !== '') {
			const streamResponse = { ...lastResponse, value: raw };
			setCombined(responses ? [...responses, streamResponse] : [streamResponse]);
			reset();
			onReset?.();
		}
	}, [streamEnd, reset, pendingCharacters, onReset, raw, lastResponse, responses]);

	// clean up on disconnect
	useEffect(() => {
		if (pendingCharacters !== 0 && !connected && lastResponse) {
			const streamResponse = { ...lastResponse, value: `${raw} ...`, disconnected: true };
			setCombined(responses ? [...responses, streamResponse] : [streamResponse]);
			responsesActions.handleUpdateLastResponse(streamResponse);
			reset();
			onReset?.();
		}
	}, [
		connected,
		pendingCharacters,
		lastResponse,
		onReset,
		raw,
		reset,
		responses,
		responsesActions,
	]);

	// return health Markdown or null
	return combined;
}
