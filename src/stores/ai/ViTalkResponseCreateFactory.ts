import { getWebRTCConnections } from '@apple-pie/slice/stores';
import { useAILayoutStore } from '@/app/(ai)/store/layout-store';
import { viVoiceInstructions } from '@/src/lib/openai/_settings';
import { CONN_NAME, EVENTS_DATA_CHANNEL } from '@/src/stores/ai/_data';

export function requestResponseStop() {
	const connection = getWebRTCConnections(CONN_NAME);
	if (!connection) return;

	// cancel the current response if it exists
	const requestResponseCancel = {
		type: 'response.cancel',
	};

	// clear the current audio buffer if it's still playing
	const clearAudioBuffer = {
		type: 'output_audio_buffer.clear',
	};

	connection.connection.sendMessage(EVENTS_DATA_CHANNEL, requestResponseCancel);
	connection.connection.sendMessage(EVENTS_DATA_CHANNEL, clearAudioBuffer);
}

export function sendResponseRequest() {
	const connection = getWebRTCConnections(CONN_NAME);
	if (!connection) return;

	const requestResponseEvent = {
		type: 'response.create',
		response: {
			instructions: viVoiceInstructions,
			output_modalities: ['audio'],
		},
	};

	connection.connection.sendMessage(EVENTS_DATA_CHANNEL, requestResponseEvent);
}

/**
 * Helper to create the first introduction message to the user
 */
export function sendCreateIntroMessage(firstTime = true) {
	const connection = getWebRTCConnections(CONN_NAME);
	if (!connection) return;

	const createIntroResponse = {
		type: 'response.create',
		response: {
			instructions: pickInitialMessage(firstTime),
			output_modalities: ['audio'],
		},
	};

	connection.connection.sendMessage(EVENTS_DATA_CHANNEL, createIntroResponse);
}

/**
 * Define greeting based on first time connecting or already has message history
 */
export function pickInitialMessage(firstTime = true) {
	const userName = useAILayoutStore.getState().userName;
	const nameString = userName ? `, ${userName}` : '';

	if (firstTime) {
		return `IN ENGLISH!!! Your name is Vi (pronounced 'Vee') - Say "Hi${nameString}, Vi here." and greet the user briefly, asking how you can help.`;
	}
	return `IN ENGLISH!!! Say "Welcome back${nameString}" and ask how you can help.`;
}
