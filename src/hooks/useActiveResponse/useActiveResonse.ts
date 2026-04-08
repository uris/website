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
export function useActiveResponse(options: {
	onEnd?: () => void;
	onStart?: () => void;
	endMarker?: string;
}) {
	const { onEnd, onStart, endMarker } = options;
	const nextResponse = useViLastResponse();
	const previousResponses = useViResponses();
	const responsesActions = useViResponsesActions();
	const connected = useViConnected();
	const streamEnd = nextResponse?.delta === undefined && nextResponse?.active === false;
	const addMarker = endMarker || endMarker === undefined;
	const marker = addMarker ? DEFAULT_MARKER : undefined;
	const [combined, setCombined] = useState<ViResponse[]>(previousResponses);

	const { healthy, append, reset, raw, pendingCharacters } = useMDStreamBuffer({
		healthyEndMarker: marker,
		includeLinksAndImages: true,
		paceDelayMs: 60,
		paceChunkSize: 1,
	});

	// trigger response start callback if the response is active but has no deltas
	useEffect(() => {
		if (nextResponse?.active === true && nextResponse.delta === undefined) onStart?.();
	}, [nextResponse, onStart]);

	// append deltas - if disconnected don't append
	useEffect(() => {
		if (connected && nextResponse?.delta) append(nextResponse.delta);
	}, [nextResponse, append, connected]);

	// update the responses when healthy Markdown updates
	useEffect(() => {
		if (!healthy || !nextResponse) return;
		const streamResponse = { ...nextResponse, value: healthy };
		setCombined(previousResponses ? [...previousResponses, streamResponse] : [streamResponse]);
	}, [healthy, nextResponse, previousResponses]);

	// reset when not streaming, the buffer is fully flushed, but raw content is still present
	useEffect(() => {
		if (streamEnd && pendingCharacters === 0 && raw !== '') {
			const streamResponse = { ...nextResponse, value: raw };
			setCombined(previousResponses ? [...previousResponses, streamResponse] : [streamResponse]);
			reset();
			onEnd?.();
		}
	}, [streamEnd, reset, pendingCharacters, onEnd, raw, nextResponse, previousResponses]);

	// clean up on disconnect
	useEffect(() => {
		if (pendingCharacters !== 0 && !connected && nextResponse) {
			const streamResponse = { ...nextResponse, value: `${raw} ...`, disconnected: true };
			setCombined(previousResponses ? [...previousResponses, streamResponse] : [streamResponse]);
			responsesActions.handleUpdateLastResponse(streamResponse);
			reset();
			onEnd?.();
		}
	}, [
		connected,
		pendingCharacters,
		nextResponse,
		onEnd,
		raw,
		reset,
		previousResponses,
		responsesActions,
	]);

	// return a full response stack including then active response
	// as well as the is buffering state
	return { responses: combined, active: pendingCharacters !== 0 };
}
