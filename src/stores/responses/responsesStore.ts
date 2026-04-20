import { create } from 'zustand';
import {
	ResponseType,
	Role,
	type UserMessage,
	UserMessageType,
	type ViResponse,
	type ViResponsesStore,
} from '@/src/stores/responses/_types';

export const useViResponsesStore = create<ViResponsesStore>((set, get) => ({
	responses: [],
	lastResponse: null,
	bufferStreaming: false,
	autoScrollStream: true,
	actions: {
		/**
		 * Called once per session on session start
		 */
		handleSessionStart: (id: string) => {
			const currentResponses = get().responses;
			const sessionStart = {
				id,
				type: ResponseType.SessionStart,
				role: Role.System,
				timestamp: Date.now(),
				value: '',
				delta: undefined,
				active: false,
				disconnected: undefined,
				interrupted: undefined,
			};
			const responses = [...currentResponses, sessionStart];
			set({ responses });
		},

		/**
		 * Called automatically from Vi Event Handlers when a conversation is about to start
		 */
		handleResponseStart: (id: string, type: ResponseType) => {
			// get current state
			const currentLastResponse = get().lastResponse;
			const currentResponses = get().responses;

			// the start of the new response pushes the last response to the response history
			const updatedResponses = currentLastResponse
				? [...currentResponses, currentLastResponse]
				: currentResponses;

			// creates a new last response
			const lastResponse: ViResponse = {
				id,
				type,
				role: Role.Assistant,
				timestamp: Date.now(),
				value: '',
				delta: undefined,
				active: true,
				disconnected: undefined,
				interrupted: undefined,
			};

			// updates state
			set({ responses: updatedResponses, lastResponse });
		},

		/**
		 * Called automatically from Vi Event Handlers when a transcript delta arrives
		 * Note: Transcripts deltas are streamed more quickly than the adio
		 */
		handleResponseDelta: (id: string, delta: string) => {
			// get current delta / last response
			const lastResponseCurrent = get().lastResponse;
			if (!lastResponseCurrent) return;

			// get values
			const { id: activeId, value } = lastResponseCurrent;
			if (activeId !== id) return;

			// update with new data
			const lastResponse = { ...lastResponseCurrent, delta, value: value + delta };

			// set state
			set({ lastResponse });
		},

		/**
		 * Called automatically from Vi Event Handlers when a transcript completes
		 * Note: Transcripts complete well before the audio finishes
		 */
		handleResponseEnd: (id: string) => {
			// get current delta / last response
			const lastResponseCurrent = get().lastResponse;
			if (!lastResponseCurrent || lastResponseCurrent?.id !== id) return;

			// update responses
			const lastResponse = { ...lastResponseCurrent, active: false, delta: undefined };

			// set state
			set({ lastResponse });
		},

		/**
		 * Call when the UI triggers a ViTalk disconnect to clean up pending active last responses.
		 */
		handleDisconnectCleanUp: (streamed?: string) => {
			// get current delta / last response
			const lastResponseCurrent = get().lastResponse;
			if (!lastResponseCurrent?.active) return;

			// update the last response to inactive with the optional parameter of streamed value
			const value = streamed ?? lastResponseCurrent.value;
			const lastResponse = { ...lastResponseCurrent, value, active: false, delta: undefined };

			// set state
			set({ lastResponse });
		},

		/**
		 * Updates the last response object replacing it with the new one.
		 */
		handleUpdateLastResponse: (lastResponse: ViResponse) => {
			set({ lastResponse });
		},

		/**
		 * Add a user message to the responses stack
		 * Note: for audio messages this is a placeholder that will receive updates
		 */
		handleNewUserMessage: (message: UserMessage) => {
			const { id, content_type, text, transcript } = message;
			if (!id || !content_type) return;
			const type = content_type === UserMessageType.Text ? ResponseType.Text : ResponseType.Audio;
			const value = content_type === UserMessageType.Text ? (text ?? '') : (transcript ?? '');
			const active = content_type === UserMessageType.Audio && !transcript;
			const userMessage: ViResponse = {
				id,
				timestamp: Date.now(),
				role: Role.User,
				type,
				value,
				active,
				delta: undefined,
				disconnected: undefined,
				interrupted: undefined,
			};
			const responses = get().responses;
			const updated = [...responses, userMessage];
			set({ responses: updated });
		},

		/**
		 * Update a user message with transcript information
		 */
		handleUpdateUserMessage: (message: Partial<UserMessage>) => {
			const { id, transcript } = message;
			if (!id || !transcript) return;
			const current = get().responses;
			const responses = current.map((response) => {
				if (response.id === id) return { ...response, value: transcript, active: false };
				return response;
			});
			set({ responses });
		},

		/**
		 * Handle tool calls by the model
		 */
		handleToolCallMessage: async (id: string) => {
			// update the last response as a tool call
			const lastResponseCurrent = get().lastResponse;
			
			// set the message as a system message
			if (lastResponseCurrent?.id === id) {
				// set a tool role
				const lastResponse = { ...lastResponseCurrent, role: Role.Tool };

				// update the last response state
				set({ lastResponse });
			}
		},

		/**
		 * Store global state on if the current buffer is still streaming content
		 */
		setBufferStreaming: (bufferStreaming: boolean) => {
			set({ bufferStreaming });
		},

		/**
		 * Auto scroll setter
		 */
		setAutoScrollStream: (autoScrollStream: boolean) => {
			set({ autoScrollStream });
		},
	},
}));

// atomic hook exports
export const useViResponses = () => useViResponsesStore((state) => state.responses);
export const useViLastResponse = () => useViResponsesStore((state) => state.lastResponse);
export const useViActive = () =>
	useViResponsesStore((state) => state.lastResponse?.active ?? false);
export const useViBufferStreaming = () => useViResponsesStore((state) => state.bufferStreaming);
export const useAutoScrollStream = () => useViResponsesStore((state) => state.autoScrollStream);
export const useViResponsesActions = () => useViResponsesStore((state) => state.actions);

// direct exports
export const viResponsesActions = useViResponsesStore.getState().actions;
export const viResponses = useViResponsesStore.getState().responses;
export const viLastResponse = useViResponsesStore.getState().lastResponse;
