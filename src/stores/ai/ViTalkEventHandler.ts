import { safeJsonParse } from '@/src/lib/shared/utils';
import { CallbackEvent, type ViStoreState } from '@/src/stores/ai/_types';
import { sendCreateIntroMessage } from '@/src/stores/ai/ViTalkResponseCreateFactory';
import { viNotification } from '@/src/stores/ai/viStore';
import { ResponseType } from '@/src/stores/responses/_types';
import { useViResponsesStore, viResponsesActions } from '@/src/stores/responses/responsesStore';
import {
	updateSessionInstructions,
	updateSessionTools,
} from '@/stores/ai/viTalkSessionUpdateFactory';

export async function realtimeDataEventHandler(
	event: MessageEvent<any> | Event | RTCErrorEvent,
): Promise<{ event?: CallbackEvent; state?: Partial<ViStoreState>; data?: unknown } | undefined> {
	const eventType = event.type;
	switch (eventType) {
		case 'open': {
			return;
		}
		case 'message': {
			if ('data' in event && typeof event.data === 'string' && event.data !== '') {
				return await handleMessageEvent(safeJsonParse(event.data));
			}
			return;
		}
		case 'error': {
			console.log('error', event);
			return;
		}
		case 'close': {
			return;
		}
	}
}

export async function handleMessageEvent(
	data: any,
): Promise<{ event?: CallbackEvent; state?: Partial<ViStoreState>; data?: unknown } | undefined> {
	if (!data || typeof data !== 'object' || !('type' in data) || typeof data.type !== 'string')
		return;
	console.log(data.type, { data });
	switch (data.type) {
		// *** signals the start of a new voice session
		case CallbackEvent.SessionCreated: {
			// update the session with the instructions
			await updateSessionInstructions();

			// and tools the model can utilize
			updateSessionTools();

			// add session start response to the response stack
			viResponsesActions.handleSessionStart(data.session.id);

			// create a response trigger for an initial welcome message
			const responses = useViResponsesStore.getState().responses;
			sendCreateIntroMessage(responses.length === 1);

			// send the connected notification
			viNotification('Connected');

			// return state updates to be processed
			return {
				event: CallbackEvent.SessionCreated,
				state: { connected: true, connecting: false },
				data,
			};
		}

		// *** model generated a response yet to be piped
		case CallbackEvent.ResponseCreated: {
			const id = data.response.id;
			viResponsesActions.handleResponseStart(id, ResponseType.Audio);
			return { event: CallbackEvent.ResponseCreated, data };
		}

		// *** model added the response item
		case CallbackEvent.ResponseStart: {
			return { event: CallbackEvent.ResponseStart };
		}

		// *** start of assistant audio buffer
		case CallbackEvent.AssistantSpeechStart: {
			// set state of vi talking
			return { event: CallbackEvent.AssistantSpeechStart, state: { viTalking: true }, data };
		}

		// *** end of assistant audio buffer
		case CallbackEvent.AssistantSpeechEnd: {
			// set state of vi talking
			return { event: CallbackEvent.AssistantSpeechEnd, state: { viTalking: false }, data };
		}

		// *** assistant audio - transcription delta
		case CallbackEvent.TranscriptDelta: {
			// provides each token of the streaming audio transcript
			viResponsesActions.handleResponseDelta(data.response_id, data.delta);
			return { event: CallbackEvent.TranscriptDelta, data };
		}

		// *** assistant audio - transcription done
		case CallbackEvent.TranscriptEnd: {
			// signals the end of the audio transcript providing the complete transcript
			viResponsesActions.handleResponseEnd(data.response_id);
			return { event: CallbackEvent.TranscriptEnd, data };
		}

		// *** assistant audio - interrupted
		case CallbackEvent.AudioInterrupt: {
			// signals conversation items truncated due to some type of interruption
			return { event: CallbackEvent.AudioInterrupt, data };
		}

		// *** conversation items added by the user via text or via audio
		case 'conversation.item.added': {
			// get base message info - protect for user messages
			const { id, role, type, content } = data.item ?? {};

			// handle only user messages that are created
			if (type !== 'message' || role !== 'user') return;
			const contentArray = Array.isArray(content) ? content : [];

			// extract content information if it exists
			const { type: content_type, text, transcript } = contentArray[0] ?? {};
			console.log({ content_type, text, transcript });

			// process transcript data if it exists (we know that will also have the rest of the info we need)
			if (content_type) {
				// trigger new message creation in stack with the new conversation item
				viResponsesActions.handleNewUserMessage({ id, text, transcript, content_type });

				// return event type in case listeners set
				if (content_type === 'input_audio')
					return { event: CallbackEvent.UserAudioMessageAdded, data };
				if (content_type === 'input_text')
					return { event: CallbackEvent.UserTextMessageAdded, data };
			}

			// return void if no relevant content type
			return;
		}

		// *** transcription of user input audio increments
		case CallbackEvent.UserMessageTranscriptDelta: {
			// for now, we ignore. not a good user experience to "stream this in"
			return { event: CallbackEvent.UserMessageTranscriptDelta, data };
		}

		// *** transcription of user input audio done
		case CallbackEvent.UserMessageTranscriptDone: {
			// get the transcript info
			const { item_id: id, transcript } = data;

			// update the user message with the transcript
			viResponsesActions.handleUpdateUserMessage({ id, transcript });

			return { event: CallbackEvent.UserMessageTranscriptDone, data };
		}

		// repose item is done responds with any tool calls
		// if there are tools calls process them
		case CallbackEvent.ResponseItemDone: {
			const type = data.item.type;
			const isToolCall = type && type === 'function_call';
			if (isToolCall) {
				// extract tool call info
				const args = data.item.arguments;
				const name = data.item.name;
				const id = data.response_id; // response id, not the item id
				const call_id = data.item.call_id;
				const argsObject = typeof args === 'string' ? JSON.parse(args) : undefined;

				// call tool handler with at least the tool name and the call id
				if (name && id) {
					viResponsesActions.handleToolCall(id, { id, name, args: argsObject, call_id });
				}
			}
			return { event: CallbackEvent.ResponseItemDone, data };
		}
		default: {
			return;
		}
	}
}
