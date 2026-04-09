export type ViStoreState = {
	connected: boolean;
	connecting: boolean;
	live: boolean;
	talk: boolean;
	eventCallbacks: Map<string, ViEventCallback[]>;
};

export type ViStore = ViStoreState & {
	actions: {
		setTalk: (state: boolean) => void;
		connect: (talk?: boolean) => Promise<void>;
		disconnect: () => void;
		handleDataEvents: (
			channel: string,
			event: any,
			eventData: MessageEvent<any> | Event | RTCErrorEvent,
		) => void;
		handleUserMessage: (message: string) => void;
		attachCallback: (name: string, callback: ViEventCallback | ViEventCallback[]) => void;
		clearCallback: (name: string) => void;
	};
};

export type MessageType =
	| 'Connecting'
	| 'Connected'
	| 'Disconnecting'
	| 'Disconnected'
	| 'Already'
	| 'Failed';

/**
 * These map to the realtime event types emitted in data messages of the RTC connection
 */
export enum CallbackEvent {
	SessionCreated = 'session.created', // signals start of a voice session
	ResponseStart = 'response.output_item.added', // signals start of response providing ID for response
	AudioInterrupt = 'conversation.item.truncated', // the output audio buffer was interrupted
	TranscriptDelta = 'response.output_audio_transcript.delta', // transcript incremental update
	TranscriptEnd = 'response.output_audio_transcript.done', // transcript ended - emits full trascript
	AssistantSpeechStart = 'output_audio_buffer.started', // start of the output audio buffer
	AssistantSpeechEnd = 'output_audio_buffer.stopped', // end of the output audio buffer
	UserSpeechStart = 'input_audio_buffer.speech_started', // user started talking
	UserSpeechStop = 'input_audio_buffer.speech_stopped', // user stopped talking
	UserSpeechSent = 'input_audio_buffer.committed', // user audio sent to model
	// internal event types affecting ViTalk
	ViDisconnect = 'vi.disconnect',
	ViConnect = 'vi.connect',
}

/**
 * Callback types for ViTalk Events
 */
export type ViEventCallback = {
	event: CallbackEvent;
	callback: () => void;
};
