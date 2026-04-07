```typescript
export function handleMessageEvent(data: any): Partial<ViStoreState> | undefined {
	if (!('type' in data) && typeof data.type !== 'string') return;
	switch (data.type) {
		case 'session.created': {
			// console.log(data.type, { sessionId: data.session.id });
			sendCreateIntroMessage();
			viNotification('Connected');
			return { connected: true, connecting: false };
		}
		case 'response.created': {
			console.log(data.type, { response: data.response.id });
			return;
		}
		case 'response.output_item.added': {
			// sets the id for a response and tags all following related events with this id
			console.log(data.type, { response_id: data.response_id });
			viResponsesActions.handleResponseStart(data.response_id, ResponseType.Audio)
			return;
		}
		case 'conversation.item.added': {
			console.log(data.type);
			return;
		}
		case 'response.content_part.added': {
			console.log(data.type);
			return;
		}
		case 'conversation.item.input_audio_transcription.delta':
		case 'response.output_audio_transcript.delta': {
			// provides each token of the streaming audio transcript
			console.log(data.type, { delta: data.delta, response_id: data.response_id });
			viResponsesActions.handleResponseDelta(data.response_id, data.delta)
			return;
		}
		case 'output_audio_buffer.started':
		case 'response.output_audio.done': {
			console.log(data.type);
			return;
		}
		case 'conversation.item.input_audio_transcription.completed':
		case 'response.output_audio_transcript.done': {
			// signals the end of the audio transcript providing the complete transcript
			console.log(data.type, { transcript: data.transcript });
			viResponsesActions.handleResponseEnd(data.response_id)
			break;
		}
		case 'response.content_part.done':
		case 'conversation.item.done':
		case 'response.output_item.done':
			// signals the end of a response item with the respective response id
			console.log(data.type);
			break;
		case 'response.done':
		case 'output_audio_buffer.stopped': {
			console.log(data.type);
			return;
		}
		default: {
			// console.log(data);
			return;
		}
	}
}
```