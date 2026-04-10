import { useMDStreamBuffer } from '@apple-pie/slice';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { CallbackEvent } from '@/src/stores/ai/_types';
import { useViActions, useViConnected } from '@/src/stores/ai/viStore';
import type { ViResponse } from '@/src/stores/responses/_types';
import {
	useViLastResponse,
	useViResponses,
	useViResponsesActions,
} from '@/src/stores/responses/responsesStore';

const DEFAULT_MARKER = ' [[END-MARKER]]';

// sort responses by timestamp
const sortedResponses = (responses: ViResponse[]) => {
	return responses.sort((a, b) => {
		if (a.timestamp && b.timestamp) {
			return a.timestamp - b.timestamp;
		}
		return 0;
	});
};

export function useActiveResponse(options: {
	onEnd?: () => void;
	onStart?: () => void;
	onAppend?: (delta: string | null | undefined) => void;
	endMarker?: string;
}) {
	const { onEnd, onStart, onAppend, endMarker } = options;
	const nextResponse = useViLastResponse();
	const previousResponses = useViResponses();
	const responsesActions = useViResponsesActions();
	const connected = useViConnected();
	const streamEnd = nextResponse?.delta === undefined && nextResponse?.active === false;
	const addMarker = endMarker || endMarker === undefined;
	const marker = addMarker ? DEFAULT_MARKER : undefined;
	const [combined, setCombined] = useState<ViResponse[]>(previousResponses);
	const attachViEventCallbacks = useViActions().attachCallback;
	const clearViEventCallbacks = useViActions().clearCallback;
	const setBufferStreaming = useViResponsesActions().setBufferStreaming;

	const { healthy, append, reset, raw, pendingCharacters } = useMDStreamBuffer({
		healthyEndMarker: marker,
		includeLinksAndImages: true,
		paceDelayMs: 60,
		paceChunkSize: 1,
	});

	// if disconnected or interrupted, set response stack with last response set to current healthy stream value
	// then reset the buffer, etc. to get ready for the next active response
	const handleInterrupt = useCallback(
		(type: 'interrupt' | 'disconnect') => {
			if (pendingCharacters !== 0 && nextResponse) {
				const healthyNoMarker = healthy.replace(DEFAULT_MARKER, '');
				const value = `${healthyNoMarker} ...`;
				const disconnected = type === 'disconnect';
				const interrupted = type === 'interrupt';
				const streamResponse = { ...nextResponse, value, disconnected, interrupted };
				setCombined(previousResponses ? [...previousResponses, streamResponse] : [streamResponse]);
				responsesActions.handleUpdateLastResponse(streamResponse);
				reset();
				onEnd?.();
			}
		},
		[nextResponse, onEnd, pendingCharacters, previousResponses, reset, responsesActions, healthy],
	);

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
		onAppend?.(nextResponse.delta);
	}, [healthy, nextResponse, previousResponses, onAppend]);

	// reset when not streaming, the buffer is fully flushed, but raw content is still present
	useEffect(() => {
		if (streamEnd && pendingCharacters === 0 && raw !== '') {
			const streamResponse = { ...nextResponse, value: raw };
			setCombined(previousResponses ? [...previousResponses, streamResponse] : [streamResponse]);
			reset();
			onEnd?.();
		}
	}, [streamEnd, reset, pendingCharacters, onEnd, raw, nextResponse, previousResponses]);

	// register the interrupt callbacks on mount for triggering disconnect and interrupt handling
	useEffect(() => {
		attachViEventCallbacks('stream', [
			{ event: CallbackEvent.AudioInterrupt, callback: () => handleInterrupt('interrupt') },
			{ event: CallbackEvent.ViDisconnect, callback: () => handleInterrupt('disconnect') },
		]);
		return () => {
			clearViEventCallbacks('stream');
		};
	}, [attachViEventCallbacks, clearViEventCallbacks, handleInterrupt]);

	// store global state of the current buffered stream state
	useLayoutEffect(() => {
		setBufferStreaming(pendingCharacters !== 0);
	}, [pendingCharacters, setBufferStreaming]);

	// return a full response stack including then active response
	// as well as the is buffering state
	return sortedResponses(combined);
}
