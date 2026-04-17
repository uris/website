import { getWebRTCConnections } from '@apple-pie/slice/stores';
import { CONN_NAME, EVENTS_DATA_CHANNEL } from '@/src/stores/ai/_data';
import { sendResponseRequest } from '@/stores/ai/ViTalkResponseCreateFactory';
import type { ToolType } from './ai-tools/_types';

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

/**
 * Create a conversation item to send to the model with a tool's data result
 */
export function sendToolCallResultsItem(
	data: any,
	call_id: string,
	requestResponse = true,
	tool?: ToolType,
) {
	// need a call id to send the tool call results
	if (!call_id) return;

	// need a connection to send the tool call results
	const connection = getWebRTCConnections(CONN_NAME);
	if (!connection) return;

	// create the tool call results event
	const event = {
		type: 'conversation.item.create',
		item: {
			type: 'function_call_output',
			call_id,
			output: JSON.stringify(data),
		},
	};

	// send it
	connection.connection.sendMessage(EVENTS_DATA_CHANNEL, event);

	// and then immediately prompt for the model to react and respond to the data
	// if flagged for requesting a response
	if (requestResponse) sendResponseRequest(tool);
}
