import { getWebRTCConnections } from '@apple-pie/slice/stores';
import { CONN_NAME, EVENTS_DATA_CHANNEL } from '@/src/stores/ai/_data';

/**
 * User message sender
 */
export function sendUserMessage(message: string) {
	const connection = getWebRTCConnections(CONN_NAME);
	if (!connection) return;

	const userMessageEvent = createConversationItem(message);
	connection.connection.sendMessage(EVENTS_DATA_CHANNEL, userMessageEvent);
}

/**
 * User message builder
 */
export function createConversationItem(message: string) {
	return {
		type: 'conversation.item.create',
		item: {
			type: 'message',
			role: 'user',
			content: [
				{
					type: 'input_text',
					text: message,
				},
			],
		},
	};
}
