import { getWebRTCConnections } from '@apple-pie/slice/stores';
import { CONN_NAME, EVENTS_DATA_CHANNEL } from '@/src/stores/ai/_data';

/**
 * Helper to create the first introduction message to the user
 */
export function sendCreateIntroMessage() {
	const connection = getWebRTCConnections(CONN_NAME);
	if (!connection) return;

	const userName = localStorage.getItem('userName');
	console.log('userName', userName);

	const instructions = () => {
		if (userName) {
			return `IN ENGLISH!!! You are talking to ${userName}. Say "Hi ${userName}" and greet the user briefly, asking how you can help.`;
		}
		return 'IN ENGLISH!!! Greet the user briefly and ask how you can help.';
	};

	const createIntroResponse = {
		type: 'response.create',
		response: {
			instructions: instructions(),
			output_modalities: ['audio'],
		},
	};

	connection.connection.sendMessage(EVENTS_DATA_CHANNEL, createIntroResponse);
}
