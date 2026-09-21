import {
	getCurrentMicDeviceLabel,
	getMicrophoneState,
	getVolume,
	getWebRTCConnections,
	microphoneActions,
	useToastStore,
	useWebRTCActions,
} from '@apple-pie/slice/stores';
import { create } from 'zustand';
import { viConnectionNotification } from '@/src/content/notifications/notifications';
import type { BaseResponse } from '@/src/lib/shared/types';
import { safeJsonParse } from '@/src/lib/shared/utils';
import { CONN_NAME, CONN_URL, EVENTS_DATA_CHANNEL, INITIAL_MIC_VOLUME } from '@/src/stores/ai/_data';
import {
	CallbackEvent,
	type MessageType,
	type ViEventCallback,
	type ViEventMessage,
	type ViStore,
} from '@/src/stores/ai/_types';
import { sendUserMessage } from '@/src/stores/ai/ViTalkCreateConvoItemFactory';
import { realtimeDataEventHandler } from '@/src/stores/ai/ViTalkEventHandler';
import { requestResponseStop, sendUserResponseRequest } from '@/src/stores/ai/ViTalkResponseCreateFactory';
import { useHomeLayoutStore } from '@/stores/home-layout/homeLayoutStore';
import { useViResponsesStore } from '@/stores/responses/responsesStore';
import { bestGuessNoiseReduction } from '@/utils/misc';

// Do not reuse the named transport while a cancelled microphone/RTC request is still settling.
let pendingConnection = false;
let connectionGeneration = 0;
let sessionRequest: AbortController | null = null;
const seenEvents = new Set<string>();

export const useAIStore = create<ViStore>((set, get) => ({
	connected: false,
	connecting: false,
	live: false,
	talk: false,
	viTalking: false,
	viListeners: new Map<string, Set<ViEventCallback>>(),
	actions: {
		setTalk: (state: boolean) => {
			set({ talk: state ?? !get().talk });
		},

		setViTalking: (state: boolean) => {
			set({ viTalking: state });
		},

		/**
		 * Establish a connection to the realtime session and WebRTC connection
		 */
		connect: async (talk?: boolean) => {
			if (get().connected || get().connecting || pendingConnection) return;
			const generation = ++connectionGeneration;
			const isCurrent = () => generation === connectionGeneration;
			const controller = new AbortController();
			sessionRequest = controller;
			pendingConnection = true;
			seenEvents.clear();
			set({ connecting: true, talk: talk ?? get().talk });
			viNotification('Connecting');
			try {
				if (!getMicrophoneState().micStream.current) {
					const microphone = await requestMicAccess();
					// getUserMedia cannot always be aborted; release a stream granted after cancellation.
					if (!isCurrent()) {
						stopMicrophone();
						return;
					}
					if (!microphone.success) throw new Error('Microphone unavailable');
				}
				const session = await createRealtimeSession(controller.signal);
				if (!isCurrent()) return;
				if (!session.success || typeof session.data?.value !== 'string' || !session.data.value) {
					throw new Error('Session unavailable');
				}
				const connection = await createRTCConnection(session.data.value, isCurrent);
				if (!isCurrent()) return;
				if (!connection.success) throw new Error('Connection unavailable');
				processEventCallbacks(CallbackEvent.ViConnect, { event: CallbackEvent.ViConnect });
				if (isCurrent()) useHomeLayoutStore.getState().actions.setShowTalkToViLabel(false);
			} catch {
				if (!isCurrent()) return;
				++connectionGeneration;
				set({ connected: false, connecting: false, viTalking: false, live: false });
				releaseConnection();
				finishActiveResponse();
				viNotification('Failed');
			} finally {
				pendingConnection = false;
				if (sessionRequest === controller) sessionRequest = null;
			}
		},

		/**
		 * Disconnect from the realtime session and WebRTC connection
		 */
		disconnect: () => {
			if (!get().connected && !get().connecting) return;
			++connectionGeneration;
			sessionRequest?.abort();
			seenEvents.clear();
			// Invalidate callbacks before closing channels, which can synchronously emit close events.
			set({ connected: false, connecting: false, viTalking: false, live: false });
			releaseConnection();
			processEventCallbacks(CallbackEvent.ViDisconnect, { event: CallbackEvent.ViDisconnect });
			// Let mounted UI listeners preserve their displayed transcript before settling it.
			finishActiveResponse();
			viNotification('Disconnected');
			useHomeLayoutStore.getState().actions.setShowTalkToViLabel(true);
		},

		/**
		 * First line handler for data events on the RTC connection
		 */
		handleDataEvents: async (channel, event, eventData) => {
			if (channel !== EVENTS_DATA_CHANNEL || (!get().connected && !get().connecting)) return;
			if (event === 'close' || event === 'error') {
				get().actions.disconnect();
				return;
			}
			if (event !== 'message') return;
			const generation = connectionGeneration;
			const isCurrent = () => generation === connectionGeneration;
			const payload = 'data' in eventData && typeof eventData.data === 'string' ? safeJsonParse(eventData.data) : null;
			const eventId = payload?.event_id;
			if (typeof eventId === 'string') {
				if (seenEvents.has(eventId)) return;
				seenEvents.add(eventId);
				// Keep memory bounded during long conversations.
				if (seenEvents.size > 1000) {
					const oldest = seenEvents.values().next().value;
					if (oldest !== undefined) seenEvents.delete(oldest);
				}
			}
			try {
				const updates = await realtimeDataEventHandler(eventData, isCurrent);
				if (!isCurrent()) return;
				if (updates?.state) set(updates.state);
				if (updates?.event) processEventCallbacks(updates.event, { event: updates.event, data: updates.data });
			} catch {
				if (isCurrent()) get().actions.disconnect();
			}
		},

		/**
		 * Send a user message and request a response request from the model
		 */
		handleUserMessage: (message: string) => {
			requestResponseStop(); // stop a current response
			sendUserMessage(message); // create the user conversation item
			sendUserResponseRequest(); // request a response to the user conversation item
		},

		/**
		 * Attach ui listeners to Vi talk events
		 */
		addViListener: (event: CallbackEvent, handler: ViEventCallback) => {
			const nextListeners = new Map(get().viListeners);
			const nextHandlers = new Set(nextListeners.get(event) ?? []);
			nextHandlers.add(handler);
			nextListeners.set(event, nextHandlers);
			set({ viListeners: nextListeners });

			// return the cleanup function
			return () => get().actions.removeViListener(event, handler);
		},

		/**
		 * Clean up ui listeners to Vi talk events
		 */
		removeViListener: (event: CallbackEvent, handler: ViEventCallback) => {
			const nextListeners = new Map(get().viListeners);
			const nextHandlers = new Set(nextListeners.get(event) ?? []);

			// guard for handler not being in the set
			if (!nextHandlers.has(handler)) return;

			// update the handlers and set state
			nextHandlers.delete(handler);
			if (nextHandlers.size) nextListeners.set(event, nextHandlers);
			else nextListeners.delete(event);
			set({ viListeners: nextListeners });
		},
	},
}));

export const useViTalk = () => useAIStore((state) => state.talk);
export const useViTalking = () => useAIStore((state) => state.viTalking);
export const useViConnected = () => useAIStore((state) => state.connected);
export const useViConnecting = () => useAIStore((state) => state.connecting);
export const useViActions = () => useAIStore((state) => state.actions);

/**
 * gets a realtime session client secret key
 */
async function createRealtimeSession(signal: AbortSignal) {
	// best guess noise reduction
	const micLabel = getCurrentMicDeviceLabel() ?? 'Unknown';
	const noiseReduction = bestGuessNoiseReduction(micLabel);

	// get a client secret key for realtime api
	const response = await fetch('/server/openai/realtime/session/request', {
		signal,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ noiseReduction }),
	});

	// if unable to connect, return error
	if (!response.ok) {
		return { success: false, data: null, status: response.status, message: response.statusText };
	}

	// extract info from JSON response and return it
	return (await response.json()) as BaseResponse;
}

/**
 * create RTC connection and add to RTC store using realtime client secret
 */
async function createRTCConnection(bearerToken: string, isCurrent: () => boolean, connectionName = CONN_NAME) {
	try {
		// access mic and volume stores for mic stream and current volume level to add to the connection
		const micStream = getMicrophoneState().micStream;
		let volume = getVolume();

		// protect for mic and set default volume to 1 if not defined
		if (!micStream.current) throw new Error('No mic stream');
		volume ??= INITIAL_MIC_VOLUME;

		// add a new connection directly to the WebRTC store
		useWebRTCActions.addConnection(connectionName, {
			connectionUrl: CONN_URL,
			micStream: micStream.current,
			volume,
			dataChannels: [EVENTS_DATA_CHANNEL],
			onDataChannelEvent: (channel, event, eventData) => {
				if (isCurrent()) return useAIStore.getState().actions.handleDataEvents(channel, event, eventData);
			},
		});

		// initialize the connection
		await useWebRTCActions.initializeConnection(connectionName, undefined, bearerToken);

		// return the connection
		return {
			success: true,
			data: { connection: getWebRTCConnections(connectionName) },
			error: undefined,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return { success: false, data: { connection: null }, error: message };
	}
}

/**
 * Helper to disconnect from the WebRTC store
 */
function releaseConnection() {
	try {
		useWebRTCActions.removeConnection(CONN_NAME);
	} catch {
		// Microphone cleanup must still run if transport teardown fails.
	} finally {
		stopMicrophone();
	}
}

function finishActiveResponse() {
	const actions = useViResponsesStore.getState().actions;
	actions.handleDisconnectCleanUp();
	actions.setBufferStreaming(false);
}

/**
 * Helper function to request mic access
 */
async function requestMicAccess() {
	try {
		const microphone = await microphoneActions.requestMicrophone();
		microphoneActions.setInputVolume(INITIAL_MIC_VOLUME);
		if (!microphone) throw new Error('Failed to access microphone');
		return { success: true, data: { microphone }, error: undefined };
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return { success: false, data: { microphone: null }, error: message };
	}
}

/**
 * Helper function to release microphone access
 */
function stopMicrophone() {
	try {
		microphoneActions.stopMicrophone();
		return { success: true, data: undefined, error: undefined };
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return { success: false, data: undefined, error: message };
	}
}

/**
 * Notification helper
 */
export function viNotification(type: MessageType) {
	// notify helpers
	const push = useToastStore.getState().actions.push;
	const message = viConnectionNotification;
	push(message(type));
}

/**
 * Process all callbacks registered to a specified event
 */
export function processEventCallbacks(event: CallbackEvent, message?: ViEventMessage) {
	// get handlers for the event
	const handlers = useAIStore.getState().viListeners.get(event);
	if (!handlers) return;

	// iterate handlers and call them
	const handlerArray = Array.from(handlers);
	for (const handler of handlerArray) {
		try {
			handler(message);
		} catch (error) {
			console.error('Vi event listener failed', error);
		}
	}
}
