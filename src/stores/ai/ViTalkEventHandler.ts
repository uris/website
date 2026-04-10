import { safeJsonParse } from '@/src/lib/shared/utils';
import { CallbackEvent, type ViStoreState } from '@/src/stores/ai/_types';
import { sendCreateIntroMessage } from '@/src/stores/ai/ViTalkResponseCreateFactory';
import { viNotification } from '@/src/stores/ai/viStore';
import { ResponseType } from '@/src/stores/responses/_types';
import { useViResponsesStore, viResponsesActions } from '@/src/stores/responses/responsesStore';

export function realtimeDataEventHandler(
	event: MessageEvent<any> | Event | RTCErrorEvent,
): { event?: CallbackEvent; state?: Partial<ViStoreState> } | undefined {
	const eventType = event.type;
	switch (eventType) {
		case 'open': {
			return;
		}
		case 'message': {
			if ('data' in event && typeof event.data === 'string' && event.data !== '') {
				return handleMessageEvent(safeJsonParse(event.data));
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

export function handleMessageEvent(
	data: any,
): { event?: CallbackEvent; state?: Partial<ViStoreState> } | undefined {
	if (!('type' in data) && typeof data.type !== 'string') return;
	switch (data.type) {
		// *** signals the start of a new voice session
		case CallbackEvent.SessionCreated: {
			// add session start response to the response stack
			viResponsesActions.handleSessionStart(data.session.id);

			// create a response trigger for an initial welcome message
			const responses = useViResponsesStore.getState().responses;
			sendCreateIntroMessage(responses.length === 1);

			// send the connected notification
			viNotification('Connected');

			// return state updates to be processed
			return { event: CallbackEvent.SessionCreated, state: { connected: true, connecting: false } };
		}

		// *** start of assistant response
		case CallbackEvent.ResponseStart: {
			// sets the id for a response and tags all following related events with this id
			viResponsesActions.handleResponseStart(data.response_id, ResponseType.Audio);
			return { event: CallbackEvent.ResponseStart };
		}

		// *** start of assistant audio buffer
		case CallbackEvent.AssistantSpeechStart: {
			// set state of vi talking
			return { event: CallbackEvent.AssistantSpeechStart, state: { viTalking: true } };
		}

		// *** end of assistant audio buffer
		case CallbackEvent.AssistantSpeechEnd: {
			// set state of vi talking
			return { event: CallbackEvent.AssistantSpeechEnd, state: { viTalking: false } };
		}

		// *** assistant audio - transcription delta
		case CallbackEvent.TranscriptDelta: {
			// provides each token of the streaming audio transcript
			viResponsesActions.handleResponseDelta(data.response_id, data.delta);
			return { event: CallbackEvent.TranscriptDelta };
		}

		// *** assistant audio - transcription done
		case CallbackEvent.TranscriptEnd: {
			// signals the end of the audio transcript providing the complete transcript
			viResponsesActions.handleResponseEnd(data.response_id);
			return { event: CallbackEvent.TranscriptEnd };
		}
		// *** assistant audio - interrupted
		case CallbackEvent.AudioInterrupt: {
			// signals conversation items truncated due to some type of interruption
			return { event: CallbackEvent.AudioInterrupt };
		}

		// *** conversation items added by the user via text or via audio
		case 'conversation.item.added': {
			// get base message info - protect for user messages
			const { id, role, type, content } = data.item ?? {};

			// handle only user messages that are created
			if (type !== 'message' || role !== 'user') return;
			const { type: content_type, text, transcript } = content[0];

			// trigger new message creation in stack with the new conversation item
			viResponsesActions.handleNewUserMessage({ id, text, transcript, content_type });

			// return event type in case listeners set
			if (content_type === 'input_audio') return { event: CallbackEvent.UserAudioMessageAdded };
			if (content_type === 'input_text') return { event: CallbackEvent.UserTextMessageAdded };

			return;
		}

		// *** transcription of user input audio increments
		case CallbackEvent.UserMessageTranscriptDelta: {
			// for now, we ignore. not a good user experience to "stream this in"
			return { event: CallbackEvent.UserMessageTranscriptDelta };
		}

		// *** transcription of user input audio done
		case CallbackEvent.UserMessageTranscriptDone: {
			// get the transcript info
			const { item_id: id, transcript } = data;

			// update the user message with the transcript
			viResponsesActions.handleUpdateUserMessage({ id, transcript });

			return { event: CallbackEvent.UserMessageTranscriptDone };
		}
		default: {
			return;
		}
	}
}
