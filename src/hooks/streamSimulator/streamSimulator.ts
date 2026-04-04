import { useMDStreamBuffer } from '@apple-pie/slice';
import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_MARKER = ' [[END-MARKER]]';
export const useStreamSimulator = (
	raw: string,
	didEndCallback: (finalMd: string | null) => void,
	options?: {
		chunkSize?: number;
		chunkGap?: number;
		didEndDelay?: number;
		endMarker: boolean | undefined;
	},
) => {
	// tidy up raw mark-down string before parsing
	const addMarker = options?.endMarker || options?.endMarker === undefined;
	const marker = addMarker ? DEFAULT_MARKER : undefined;
	const {
		healthy,
		append,
		reset: resetBuffer,
	} = useMDStreamBuffer({
		healthyEndMarker: marker,
		includeLinksAndImages: true,
	});
	// stream settings
	const buffer = useRef<string>(raw);
	const chunkSize = useRef<number>(3);
	const chunkGap = useRef<number>(50);
	const endDelay = useRef<number | null>(null);
	const didEndRef = useRef(didEndCallback);
	const currentIndex = useRef<number>(0);
	const interval = useRef<ReturnType<typeof setInterval> | null>(null);
	const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [chunk, setChunk] = useState<string | null>(null);
	const [cummulative, setCummulative] = useState<string | null>(null);
	const cummulativeRef = useRef<string | null>(null);
	const [streaming, setStreaming] = useState<boolean>(false);
	const [complete, setComplete] = useState<boolean>(false);

	// pauses the stream state - clears intervals and timeouts
	const pauseStream = useCallback(() => {
		if (interval.current) {
			clearInterval(interval.current);
			interval.current = null;
		}
		if (timeout.current) {
			clearTimeout(timeout.current);
			timeout.current = null;
		}
		setStreaming(false);
	}, []);

	// emit did end callback after optional delay
	const emitDidEnd = useCallback(() => {
		if (timeout.current) clearTimeout(timeout.current);
		if (!endDelay.current) {
			setComplete(true);
			didEndRef.current(cummulativeRef.current);
			return;
		}
		timeout.current = setTimeout(() => {
			setComplete(true);
			didEndRef.current(cummulativeRef.current);
		}, endDelay.current);
	}, []);

	// reset the stream state calling pause (rest intervals/timeouts)
	const resetStream = () => {
		// stops and resets the stream
		pauseStream();
		currentIndex.current = 0;
		resetBuffer();
		setChunk(null);
		setCummulative(null);
		setComplete(false);
	};

	// core handler of incremntal chunks off raw
	const processNextChunk = () => {
		// get next chunk
		const nextChunk = buffer.current.slice(
			currentIndex.current,
			currentIndex.current + chunkSize.current,
		);

		// stop if nothing is left
		if (!nextChunk) {
			pauseStream();
			emitDidEnd();
			return;
		}

		// set chunk and cummulative
		append(nextChunk);
		setChunk(nextChunk);
		setCummulative((prev) => {
			const nextCummulative = prev ? prev + nextChunk : nextChunk;
			cummulativeRef.current = nextCummulative;
			return nextCummulative;
		});

		// increment index
		currentIndex.current += chunkSize.current;

		// emit didEnd and stop the interval
		if (currentIndex.current >= buffer.current.length) {
			pauseStream();
			emitDidEnd();
		}
	};

	// trigger start of stream
	const startStream = () => {
		// starts the stream
		if (interval.current || currentIndex.current >= buffer.current.length) return;
		interval.current = setInterval(processNextChunk, chunkGap.current);
		setStreaming(true);
		setComplete(false);
	};

	// update refs on input change
	useEffect(() => {
		didEndRef.current = didEndCallback;
	}, [didEndCallback]);

	// update refs on input change
	useEffect(() => {
		pauseStream();
		resetBuffer();
		setChunk(null);
		setCummulative(null);
		cummulativeRef.current = null;
		setComplete(false);
		buffer.current = raw;
		const { chunkSize: cs, chunkGap: cg, didEndDelay: ed } = options ?? {};
		if (cs) chunkSize.current = cs;
		if (cg) chunkGap.current = cg;
		if (ed) endDelay.current = ed;
		currentIndex.current = 0;
	}, [raw, options, pauseStream, resetBuffer]);

	// stop interval on component unmount
	useEffect(() => {
		return () => {
			if (interval.current) clearInterval(interval.current);
			if (timeout.current) clearTimeout(timeout.current);
		};
	}, []);

	// if complete return the raw cummulative
	return {
		chunk,
		cummulative,
		healthy: complete ? cummulative : healthy,
		streaming,
		startStream,
		pauseStream,
		resetStream,
	};
};
