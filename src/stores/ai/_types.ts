import type { Project } from '@/stores/sidebar/_types';

export type ViStoreState = {
	connected: boolean;
	connecting: boolean;
	live: boolean;
	talk: boolean;
	viTalking: boolean;
	viListeners: Map<string, Set<ViEventCallback>>;
};

export type ViStore = ViStoreState & {
	actions: {
		setTalk: (state: boolean) => void;
		setViTalking: (state: boolean) => void;
		connect: (talk?: boolean) => Promise<void>;
		disconnect: () => void;
		handleDataEvents: (
			channel: string,
			event: any,
			eventData: MessageEvent<any> | Event | RTCErrorEvent,
		) => Promise<void>;
		handleUserMessage: (message: string) => void;
		addViListener: (event: CallbackEvent, handler: ViEventCallback) => () => void;
		removeViListener: (event: CallbackEvent, handler: ViEventCallback) => void;
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
	// realtime api events
	SessionCreated = 'session.created', // signals start of a voice session
	ResponseCreated = 'response.created', // when a response item was created but not yet started
	ResponseStart = 'response.output_item.added', // signals start of response providing ID for response
	AudioInterrupt = 'conversation.item.truncated', // the output audio buffer was interrupted
	TranscriptDelta = 'response.output_audio_transcript.delta', // transcript incremental update
	TranscriptEnd = 'response.output_audio_transcript.done', // transcript ended - emits full trascript
	AssistantSpeechStart = 'output_audio_buffer.started', // start of the output audio buffer
	AssistantSpeechEnd = 'output_audio_buffer.stopped', // end of the output audio buffer
	UserSpeechStart = 'input_audio_buffer.speech_started', // user started talking
	UserSpeechStop = 'input_audio_buffer.speech_stopped', // user stopped talking
	UserSpeechSent = 'input_audio_buffer.committed', // user audio sent to model
	UserTextMessageAdded = 'conversation.item.added[text]', // user text message
	UserAudioMessageAdded = 'conversation.item.added[audio]', // user audio message
	UserMessageTranscriptDelta = 'conversation.item.input_audio_transcription.delta', // audio transcript incremental update
	UserMessageTranscriptDone = 'conversation.item.input_audio_transcription.completed', // user transcript done
	ResponseItemDone = 'response.output_item.done', // when a response item is done -> emits tool calls
	// app vi events
	ViDisconnect = 'vi.disconnect',
	ViConnect = 'vi.connect',
	ViThemeChange = 'vi.theme.change',
	ViVolumeChange = 'vi.volume.change',
	ViOpenProjectView = 'vi.open.project.view',
}

/**
 * Callback types for ViTalk Events
 */
export type ViEventCallback = (message?: ViEventMessage) => void;

export type ViEventMessage = {
	event: CallbackEvent;
	data?: unknown;
	action_value?: {
		theme?: string;
		volume?: number;
		slug?: Project;
	};
	id?: string;
};
