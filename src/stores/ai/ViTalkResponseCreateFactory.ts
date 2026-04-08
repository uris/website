import { getWebRTCConnections } from '@apple-pie/slice/stores';
import { CONN_NAME, EVENTS_DATA_CHANNEL } from '@/src/stores/ai/_data';

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
	const userName = localStorage.getItem('userName');

	if (firstTime) {
		if (userName) {
			return `IN ENGLISH!!! You are talking to ${userName}. Say "Hi ${userName}" and greet the user briefly, asking how you can help.`;
		}
		return 'IN ENGLISH!!! Greet the user briefly and ask how you can help.';
	} else {
		if (userName) {
			return `IN ENGLISH!!! You are talking to ${userName}. Say "Welcome back ${userName}" and ask how you can help.`;
		}
		return 'IN ENGLISH!!! Say "Welcome back" and ask how you can help.';
	}
}
