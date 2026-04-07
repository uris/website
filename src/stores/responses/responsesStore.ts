import { create } from 'zustand';
import {
	type ResponseType,
	Role,
	type ViResponse,
	type ViResponsesStore,
} from '@/src/stores/responses/_types';

export const useViResponsesStore = create<ViResponsesStore>((set, get) => ({
	responses: [],
	lastResponse: null,
	actions: {
		handleResponseStart: (id: string, type: ResponseType) => {
			// get current state
			const currentLastResponse = get().lastResponse;
			const currentResponses = get().responses;

			// start of the new response pushes last response to the response history
			const updatedResposnes = currentLastResponse
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
			};

			// updates state
			set({ responses: updatedResposnes, lastResponse });
		},
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
		handleResponseEnd: (id: string) => {
			// get current delta / last response
			const lastResponseCurrent = get().lastResponse;
			if (!lastResponseCurrent || lastResponseCurrent?.id !== id) return;

			// update responses
			const lastResponse = { ...lastResponseCurrent, active: false, delta: undefined };

			// set state
			set({ lastResponse });
		},
		handleDisconnectCleanUp: () => {
			// get current delta / last response
			const lastResponseCurrent = get().lastResponse;
			if (!lastResponseCurrent?.active) return;

			// update last response to inactive
			const lastResponse = { ...lastResponseCurrent, active: false, delta: undefined };

			// set state
			set({ lastResponse });
		},
		handleUpdateLastResponse: (lastResponse: ViResponse) => {
			set({ lastResponse });
		},
	},
}));

// atomic hook exports
export const useViResponses = () => useViResponsesStore((state) => state.responses);
export const useViLastResponse = () => useViResponsesStore((state) => state.lastResponse);
export const useViActive = () =>
	useViResponsesStore((state) => state.lastResponse?.active ?? false);
export const useViResponsesActions = () => useViResponsesStore((state) => state.actions);

// direct exports
export const viResponsesActions = useViResponsesStore.getState().actions;
export const viResponses = useViResponsesStore.getState().responses;
export const viActiveResponse = useViResponsesStore.getState().lastResponse;
