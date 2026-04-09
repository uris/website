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
			sendCreateIntroMessage(responses.length === 0);

			// send the connected notification
			viNotification('Connected');

			// return state updates to be processed
			return { event: CallbackEvent.SessionCreated, state: { connected: true, connecting: false } };
		}

		// *** start of assistant response
		case 'response.output_item.added': {
			// sets the id for a response and tags all following related events with this id
			viResponsesActions.handleResponseStart(data.response_id, ResponseType.Audio);
			return { event: CallbackEvent.ResponseStart };
		}

		// *** assistant audio - transcription delta
		case 'response.output_audio_transcript.delta': {
			// provides each token of the streaming audio transcript
			viResponsesActions.handleResponseDelta(data.response_id, data.delta);
			return { event: CallbackEvent.TranscriptDelta };
		}

		// *** assistant audio - transcription done
		case 'response.output_audio_transcript.done': {
			// signals the end of the audio transcript providing the complete transcript
			viResponsesActions.handleResponseEnd(data.response_id);
			return { event: CallbackEvent.TranscriptEnd };
		}
		// *** assistant audio - interrupted
		case 'conversation.item.truncated': {
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

			return;
		}

		// *** transcription of user input audio increments
		case 'conversation.item.input_audio_transcription.delta': {
			// for now, we ignore. not a good user experience to "stream this in"
			return;
		}

		// *** transcription of user input audio done
		case 'conversation.item.input_audio_transcription.completed': {
			// get the transcript info
			const { item_id: id, transcript } = data;

			// update the user message with the transcript
			viResponsesActions.handleUpdateUserMessage({ id, transcript });

			return;
		}
		default: {
			return;
		}
	}
}
