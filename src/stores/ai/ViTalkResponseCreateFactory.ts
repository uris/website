import { getWebRTCConnections } from '@apple-pie/slice/stores';
import { CONN_NAME, EVENTS_DATA_CHANNEL } from '@/src/stores/ai/_data';
import { viBaseInstructions } from '@/stores/ai/viTalkSessionUpdateFactory';
import { useHomeLayoutStore } from '@/stores/home-layout/homeLayoutStore';
import { ToolType } from './ai-tools/_types';

/**
 * Stop the current response if still active
 */
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

/**
 * Generic request for a response from the model
 * Useful for requesting a response after a tool call results item has been added, for example
 */
export function sendResponseRequest(tool?: ToolType) {
	const connection = getWebRTCConnections(CONN_NAME);
	if (!connection) return;

	// generic reques for a response
	let event: any = {
		type: 'response.create',
	};

	// depending on the tool call, provide further instruction
	const instructions = createToolCallResponseInstructions(tool);
	if (instructions) {
		event = {
			...event,
			response: {
				instructions,
			},
		};
	}

	// send it
	connection.connection.sendMessage(EVENTS_DATA_CHANNEL, event);
}

/**
 * Send the initial response request to the model
 */
export function sendUserResponseRequest() {
	const connection = getWebRTCConnections(CONN_NAME);
	if (!connection) return;

	const requestResponseEvent = {
		type: 'response.create',
		response: {
			instructions: viBaseInstructions,
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
	const userName = useHomeLayoutStore.getState().userName;
	const nameString = userName ? `, ${userName}` : '';

	if (firstTime) {
		return `IN ENGLISH!!! Your name is Vi (pronounced 'Vee') - Say "Hi${nameString}, Vi here." and greet the user briefly, asking how you can help.`;
	}
	return `IN ENGLISH!!! Say "Welcome back${nameString}" and ask how you can help.`;
}

/**
 * Create instructions for the model to respond to a data tool call
 */
export function createToolCallResponseInstructions(tool?: ToolType): string | undefined {
	switch (tool) {
		case ToolType.ViewAllProjects:
			return 'Ask if there is a specific project or type of project that the user is interested in knowing more about.';
		case ToolType.RequestProjectDetails:
			return 'You response should be very brief and focus on the things to emphasize. Then simply ask the user if they would like you to open up the project details and if there are any areas they would like to know more about.';
		case ToolType.RequestSkills:
			return 'You response should be very brief and summarize the dual design/front-end developer nature of Uris skill set and background. Then ask if they would like to see the skills page (with all the skills listed), or more details about a specific skill set.';
		default:
			return undefined;
	}
}
