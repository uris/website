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
import { useAILayoutStore } from '@/app/(ai)/store/layout-store';
import { viConnectionNotification } from '@/src/content/notifications/notifications';
import type { BaseResponse } from '@/src/lib/shared/types';
import {
	CONN_NAME,
	CONN_URL,
	EVENTS_DATA_CHANNEL,
	INITIAL_MIC_VOLUME,
} from '@/src/stores/ai/_data';
import {
	CallbackEvent,
	type MessageType,
	type ViEventCallback,
	type ViStore,
} from '@/src/stores/ai/_types';
import { sendUserMessage } from '@/src/stores/ai/ViTalkCreateConvoItemFactory';
import { realtimeDataEventHandler } from '@/src/stores/ai/ViTalkEventHandler';
import {
	requestResponseStop,
	sendResponseRequest,
} from '@/src/stores/ai/ViTalkResponseCreateFactory';
import { bestGuessNoiseReduction } from '@/utils/misc';

export const useAIStore = create<ViStore>((set, get) => ({
	connected: false,
	connecting: false,
	live: false,
	talk: false,
	viTalking: false,
	eventCallbacks: new Map<string, ViEventCallback[]>(),
	actions: {
		setTalk: (state: boolean) => {
			set({ talk: state ?? !get().talk });
		},
		setViTalking: (state: boolean) => {
			set({ viTalking: state });
		},
		connect: async (talk?: boolean) => {
			// if already connected or connecting return
			if (get().connected || get().connecting) return;

			// set connecting true, disconnecting false, and talk based on param
			set({ connecting: true, talk: talk ?? get().talk });
			viNotification('Connecting');

			// check for microphone
			const microphoneActive = await micIsConnected();

			// request mic access if not already active
			if (!microphoneActive) {
				const requestMic = await requestMicAccess();
				if (requestMic.error) {
					set({ connected: false, connecting: false });
					viNotification('Failed');
					return;
				}
			}

			// create the realtime session
			const session = await createRealtimeSession();

			// if unable to create the session, notify the user
			if (!session.success) {
				set({ connected: false, connecting: false });
				viNotification('Failed');
				return;
			}

			// extract token to use for RTC connection creation
			const token = session.data.value;

			// create the RTC connection with the token
			const connection = await createRTCConnection(token);

			// check for connection errors
			if (connection.error) {
				console.log({ connection, token });
				set({ connected: false, connecting: false });
				viNotification('Failed');
			}

			// IMPORTANT
			// don't mutate the response store responses directly - let active stream logic do that
			// by handling the callbacks
			processEventCallbacks(CallbackEvent.ViConnect);

			// set vi label display to false as already connected
			useAILayoutStore.getState().actions.setShowTalkToViLabel(false);
		},
		disconnect: () => {
			// if already disconnecting or not connected, return
			if (!get().connected) return;

			// disconnect the RTC connectio
			disconnectRTC();
			stopMicrophone();

			// IMPORTANT
			// don't mutate the response store responses directly - let active stream logic do that
			// by handling the callbacks
			processEventCallbacks(CallbackEvent.ViDisconnect);

			// set connecting false, connected false
			set({ connected: false, connecting: false });
			viNotification('Disconnected');
		},
		handleDataEvents: (channel, event, eventData) => {
			// filter out non data events
			if (!channel.includes(EVENTS_DATA_CHANNEL)) return;

			// handle message events
			// use return value to updated state and process relevant event callbacks
			if (event === 'message') {
				const updates = realtimeDataEventHandler(eventData);
				const { event, state } = updates ?? {};
				if (state) set(state);
				if (event) processEventCallbacks(event);
				return;
			}

			// console log other events
			console.log({ event, eventData });
		},
		/**
		 * Send a user message and request a response request from the model
		 */
		handleUserMessage: (message: string) => {
			requestResponseStop(); // stop a current response
			sendUserMessage(message); // create the user conversation item
			sendResponseRequest(); // request a response to the user conversation item
		},
		/**
		 * Attach event callbacks
		 */
		attachCallback: (name: string, callback: ViEventCallback | ViEventCallback[]) => {
			const newCallbacks = Array.isArray(callback) ? callback : [callback];
			const eventCallbacks = get().eventCallbacks;
			eventCallbacks.set(name, newCallbacks);
			set({ eventCallbacks });
		},
		/**
		 * Clean up event callbacks
		 */
		clearCallback: (name: string) => {
			const eventCallbacks = get().eventCallbacks;
			eventCallbacks.delete(name);
			set({ eventCallbacks });
		},
	},
}));

export const useViTalk = () => useAIStore((state) => state.talk);
export const useViLive = () => useAIStore((state) => state.live);
export const useViTalking = () => useAIStore((state) => state.viTalking);
export const useViConnected = () => useAIStore((state) => state.connected);
export const useViConnecting = () => useAIStore((state) => state.connecting);
export const useViActions = () => useAIStore((state) => state.actions);
export const useViEventCallbacks = () => useAIStore((state) => state.eventCallbacks);

/**
 * gets a realtime session client secret key
 */
async function createRealtimeSession() {
	// best guess noise reduction
	const micLabel = getCurrentMicDeviceLabel() ?? 'Unknown';
	const noiseReduction = bestGuessNoiseReduction(micLabel);

	// get a client secret key for realtime api
	const response = await fetch('/api/openai/realtime/session/request', {
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
async function createRTCConnection(bearerToken: string, connectionName = CONN_NAME) {
	try {
		// access mic and volume stores for mic stream and current volume level to add to the connection
		const micStream = getMicrophoneState().micStream;
		let volume = getVolume();

		// protect for mic and volume
		if (!micStream.current) throw new Error('No mic stream');
		if (!volume) volume = 1;

		// add a new connection directly to the WebRTC store
		useWebRTCActions.addConnection(connectionName, {
			connectionUrl: CONN_URL,
			micStream: micStream.current,
			volume,
			dataChannels: [EVENTS_DATA_CHANNEL],
			onDataChannelEvent: (channel, event, eventData) => {
				useAIStore.getState().actions.handleDataEvents(channel, event, eventData);
			},
		});

		// initialize the connection
		await useWebRTCActions.initializeConnection(connectionName, undefined, bearerToken);

		// initialize the connection
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
function disconnectRTC(connectionName = CONN_NAME) {
	useWebRTCActions.removeConnection(connectionName);
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
 * Helper function to check for current microphone
 */
async function micIsConnected() {
	return getMicrophoneState().micStream.current !== null;
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
 * Process all callbacks registered against a specific event
 */
function processEventCallbacks(event: CallbackEvent) {
	const callbackMap = useAIStore.getState().eventCallbacks;
	const callbacks = Array.from(callbackMap.values()).flat();
	const call = callbacks.filter((item) => item.event === event);
	for (const item of call) {
		item.callback();
	}
}
