import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EVENTS_DATA_CHANNEL } from '@/stores/ai/_data';
import { CallbackEvent } from '@/stores/ai/_types';
import { ToolType } from '@/stores/ai/ai-tools/_types';
import { useAIStore } from '@/stores/ai/viStore';
import { useViResponsesStore } from '@/stores/responses/responsesStore';

const transport = vi.hoisted(() => ({
	get: vi.fn(),
	add: vi.fn(),
	initialize: vi.fn(),
	remove: vi.fn(),
	send: vi.fn(),
	stopMic: vi.fn(),
	notify: vi.fn(),
}));
vi.mock('@apple-pie/slice/stores', () => ({
	getWebRTCConnections: transport.get,
	useWebRTCActions: {
		addConnection: transport.add,
		initializeConnection: transport.initialize,
		removeConnection: transport.remove,
	},
	getMicrophoneState: () => ({ micStream: { current: { getTracks: () => [] } } }),
	getCurrentMicDeviceLabel: () => 'Headset',
	getVolume: () => 1,
	microphoneActions: { requestMicrophone: vi.fn(), setInputVolume: vi.fn(), stopMicrophone: transport.stopMic },
	useToastStore: { getState: () => ({ actions: { push: transport.notify } }) },
}));
vi.mock('@/src/content/notifications/notifications', () => ({
	viConnectionNotification: (message: string) => ({ message }),
}));
const fetchMock = vi.fn<typeof fetch>();
const actions = useAIStore.getState().actions;
let channel: (channel: string, event: string, data: MessageEvent) => Promise<void>;
let serial = 0;
const deliver = (type: string, data: object = {}) =>
	channel(
		EVENTS_DATA_CHANNEL,
		'message',
		new MessageEvent('message', { data: JSON.stringify({ type, event_id: `event-${serial++}`, ...data }) }),
	);
const output = () =>
	transport.send.mock.calls.map(([channel, payload]) => {
		expect(channel).toBe(EVENTS_DATA_CHANNEL);
		return payload;
	});
beforeEach(() => {
	for (const mock of Object.values(transport)) mock.mockReset();
	useAIStore.setState({ ...useAIStore.getInitialState(), viListeners: new Map() }, true);
	useViResponsesStore.setState(useViResponsesStore.getInitialState(), true);
	const connection = { connection: { sendMessage: transport.send } };
	transport.get.mockReturnValue(connection);
	transport.add.mockImplementation((_name, options) => {
		channel = options.onDataChannelEvent;
	});
	transport.remove.mockImplementation(() => transport.get.mockReturnValue(null));
	transport.initialize.mockImplementation(() => deliver(CallbackEvent.SessionCreated, { session: { id: 'session' } }));
	fetchMock.mockReset();
	fetchMock.mockImplementation(async (url) => {
		if (url === '/server/openai/realtime/session/request')
			return Response.json({ success: true, data: { value: 'test-token' } });
		if (url === '/server/projects/summaries') return Response.json({ data: [] });
		throw new Error(`Unexpected network request: ${url}`);
	});
	vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
	actions.disconnect();
	vi.unstubAllGlobals();
});

describe('simulated AI session through real website handlers', () => {
	it('initializes a session, streams a reply, sends user input, and tears down cleanly', async () => {
		const connected = vi.fn();
		actions.addViListener(CallbackEvent.ViConnect, connected);
		await actions.connect(true);
		expect(useAIStore.getState()).toMatchObject({ connected: true, connecting: false });
		expect(connected).toHaveBeenCalledOnce();
		expect(output().map((event) => event.type)).toEqual(['session.update', 'session.update', 'response.create']);
		await deliver(CallbackEvent.ResponseCreated, { response: { id: 'answer' } });
		await deliver(CallbackEvent.AssistantSpeechStart);
		await deliver(CallbackEvent.TranscriptDelta, { response_id: 'answer', delta: 'Hello' });
		await deliver(CallbackEvent.TranscriptEnd, { response_id: 'answer' });
		await deliver(CallbackEvent.AssistantSpeechEnd);
		expect(useViResponsesStore.getState().lastResponse).toMatchObject({ value: 'Hello', active: false });
		actions.handleUserMessage('Tell me more');
		expect(
			output()
				.slice(-4)
				.map((event) => event.type),
		).toEqual(['response.cancel', 'output_audio_buffer.clear', 'conversation.item.create', 'response.create']);
		actions.disconnect();
		expect(transport.remove).toHaveBeenCalledOnce();
		expect(transport.stopMic).toHaveBeenCalledOnce();
		await deliver(CallbackEvent.AssistantSpeechStart);
		expect(useAIStore.getState()).toMatchObject({ connected: false, viTalking: false });
	});
	it('returns a failed tool result over the channel instead of losing the model response', async () => {
		await actions.connect();
		await deliver(CallbackEvent.ResponseCreated, { response: { id: 'answer' } });
		await deliver(CallbackEvent.ResponseItemDone, {
			response_id: 'answer',
			item: { type: 'function_call', name: ToolType.RequestSkills, arguments: '{}', call_id: 'call' },
		});
		const result = output().find((event) => event.item?.type === 'function_call_output');
		expect(result.item.call_id).toBe('call');
		expect(JSON.parse(result.item.output)).toMatchObject({ success: false });
		expect(output().at(-1).type).toBe('response.create');
		expect(useAIStore.getState().connected).toBe(true);
	});
	it('settles the active response on disconnect, including when no UI listener is mounted', async () => {
		await actions.connect();
		await deliver(CallbackEvent.ResponseCreated, { response: { id: 'answer' } });
		await deliver(CallbackEvent.TranscriptDelta, { response_id: 'answer', delta: 'Partial answer' });
		useViResponsesStore.getState().actions.setBufferStreaming(true);
		actions.disconnect();
		expect(useViResponsesStore.getState().lastResponse).toMatchObject({
			value: 'Partial answer',
			active: false,
			delta: undefined,
		});
		expect(useViResponsesStore.getState().bufferStreaming).toBe(false);
	});
	it('does not revive a cancelled session when instruction loading finishes', async () => {
		const pending = Promise.withResolvers<Response>();
		fetchMock.mockImplementation(async (url) =>
			url === '/server/projects/summaries'
				? pending.promise
				: Response.json({ success: true, data: { value: 'test-token' } }),
		);
		const connecting = actions.connect();
		await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/server/projects/summaries'));
		actions.disconnect();
		pending.resolve(Response.json({ data: [] }));
		await connecting;
		expect(useAIStore.getState()).toMatchObject({ connected: false, connecting: false });
		expect(output()).toEqual([]);
		expect(useViResponsesStore.getState().responses).toEqual([]);
	});
});
