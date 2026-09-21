import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONN_NAME, CONN_URL, EVENTS_DATA_CHANNEL, INITIAL_MIC_VOLUME } from '@/stores/ai/_data';
import { CallbackEvent } from '@/stores/ai/_types';
import { processEventCallbacks, useAIStore } from '@/stores/ai/viStore';
import { useHomeLayoutStore } from '@/stores/home-layout/homeLayoutStore';

const mock = vi.hoisted(() => ({
	mic: vi.fn(),
	label: vi.fn(),
	volume: vi.fn(),
	requestMic: vi.fn(),
	stopMic: vi.fn(),
	setVolume: vi.fn(),
	add: vi.fn(),
	initialize: vi.fn(),
	remove: vi.fn(),
	connection: vi.fn(),
	toast: vi.fn(),
	handler: vi.fn(),
	stopResponse: vi.fn(),
	sendUser: vi.fn(),
	respond: vi.fn(),
}));
vi.mock('@apple-pie/slice/stores', () => ({
	getMicrophoneState: mock.mic,
	getCurrentMicDeviceLabel: mock.label,
	getVolume: mock.volume,
	getWebRTCConnections: mock.connection,
	microphoneActions: {
		requestMicrophone: mock.requestMic,
		stopMicrophone: mock.stopMic,
		setInputVolume: mock.setVolume,
	},
	useWebRTCActions: { addConnection: mock.add, initializeConnection: mock.initialize, removeConnection: mock.remove },
	useToastStore: { getState: () => ({ actions: { push: mock.toast } }) },
}));
vi.mock('@/src/content/notifications/notifications', () => ({
	viConnectionNotification: (type: string) => ({ message: type }),
}));
vi.mock('@/src/stores/ai/ViTalkEventHandler', () => ({ realtimeDataEventHandler: mock.handler }));
vi.mock('@/src/stores/ai/ViTalkResponseCreateFactory', () => ({
	requestResponseStop: mock.stopResponse,
	sendUserResponseRequest: mock.respond,
}));
vi.mock('@/src/stores/ai/ViTalkCreateConvoItemFactory', () => ({ sendUserMessage: mock.sendUser }));
const actions = useAIStore.getState().actions;
const fetchMock = vi.fn<typeof fetch>();
const stream = { getTracks: () => [] };
let mic: { micStream: { current: object | null } };
const notification = (message: string) => expect.objectContaining({ message });
const message = (event_id = 'event') =>
	new MessageEvent('message', { data: JSON.stringify({ type: 'response.created', event_id }) });
beforeEach(() => {
	for (const fn of Object.values(mock)) fn.mockReset();
	useAIStore.setState({ ...useAIStore.getInitialState(), viListeners: new Map() }, true);
	useHomeLayoutStore.setState(useHomeLayoutStore.getInitialState(), true);
	mic = { micStream: { current: stream } };
	mock.mic.mockImplementation(() => mic);
	mock.label.mockReturnValue('AirPods');
	mock.volume.mockReturnValue(0.5);
	mock.requestMic.mockImplementation(async () => {
		mic.micStream.current = stream;
		return stream;
	});
	mock.initialize.mockResolvedValue(undefined);
	mock.connection.mockReturnValue({ connection: {} });
	fetchMock.mockReset();
	fetchMock.mockImplementation(async () => Response.json({ success: true, data: { value: 'fake-token' } }));
	vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
	actions.disconnect();
	vi.unstubAllGlobals();
});

describe('connection lifecycle', () => {
	it('creates one named RTC connection using the session token, stream, volume and channel', async () => {
		const listener = vi.fn();
		actions.addViListener(CallbackEvent.ViConnect, listener);
		await actions.connect(true);
		expect(fetchMock).toHaveBeenCalledWith(
			'/server/openai/realtime/session/request',
			expect.objectContaining({ method: 'POST', body: '{"noiseReduction":"near_field"}' }),
		);
		expect(mock.add).toHaveBeenCalledExactlyOnceWith(
			CONN_NAME,
			expect.objectContaining({
				connectionUrl: CONN_URL,
				micStream: stream,
				volume: 0.5,
				dataChannels: [EVENTS_DATA_CHANNEL],
				onDataChannelEvent: expect.any(Function),
			}),
		);
		expect(mock.initialize).toHaveBeenCalledWith(CONN_NAME, undefined, 'fake-token');
		expect(listener).toHaveBeenCalledOnce();
		expect(useAIStore.getState().talk).toBe(true);
		expect(mock.toast).toHaveBeenCalledWith(notification('Connecting'));
	});
	it('requests a missing microphone and defaults volume and noise reduction', async () => {
		mic.micStream.current = null;
		mock.volume.mockReturnValue(undefined);
		mock.label.mockReturnValue(null);
		await actions.connect();
		expect(mock.requestMic).toHaveBeenCalledOnce();
		expect(mock.setVolume).toHaveBeenCalledWith(INITIAL_MIC_VOLUME);
		expect(mock.add.mock.calls[0][1].volume).toBe(INITIAL_MIC_VOLUME);
		expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string).noiseReduction).toBe('far_field');
	});
	it.each(['rejected', 'empty'])('settles microphone failure: %s', async (failure) => {
		mic.micStream.current = null;
		if (failure === 'rejected') mock.requestMic.mockRejectedValue(new Error('Permission denied'));
		else mock.requestMic.mockResolvedValue(null);
		await actions.connect();
		expect(useAIStore.getState()).toMatchObject({ connected: false, connecting: false });
		expect(fetchMock).not.toHaveBeenCalled();
		expect(mock.toast).toHaveBeenLastCalledWith(notification('Failed'));
	});
	it.each(['http', 'network', 'invalid JSON', 'unsuccessful', 'missing token', 'null data', 'missing stream', 'rtc'])(
		'cleans up after %s failure',
		async (failure) => {
			if (failure === 'http') fetchMock.mockResolvedValue(new Response('', { status: 503 }));
			if (failure === 'network') fetchMock.mockRejectedValue(new Error('offline'));
			if (failure === 'invalid JSON') fetchMock.mockResolvedValue(new Response('{'));
			if (failure === 'unsuccessful') fetchMock.mockResolvedValue(Response.json({ success: false }));
			if (failure === 'missing token') fetchMock.mockResolvedValue(Response.json({ success: true, data: {} }));
			if (failure === 'null data') fetchMock.mockResolvedValue(Response.json({ success: true, data: null }));
			if (failure === 'missing stream') {
				mic.micStream.current = null;
				mock.requestMic.mockResolvedValue({});
			}
			if (failure === 'rtc') mock.initialize.mockRejectedValue(new Error('negotiation failed'));
			await actions.connect();
			expect(useAIStore.getState()).toMatchObject({ connected: false, connecting: false, viTalking: false });
			expect(mock.toast).toHaveBeenLastCalledWith(notification('Failed'));
			expect(mock.stopMic).toHaveBeenCalled();
			if (failure === 'rtc') expect(mock.remove).toHaveBeenCalledWith(CONN_NAME);
		},
	);
	it('ignores duplicate connect while pending and while connected', async () => {
		const pending = Promise.withResolvers<Response>();
		fetchMock.mockReturnValue(pending.promise);
		const first = actions.connect();
		await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
		await actions.connect();
		pending.resolve(Response.json({ success: true, data: { value: 'token' } }));
		await first;
		useAIStore.setState({ connected: true, connecting: false });
		await actions.connect();
		expect(mock.initialize).toHaveBeenCalledOnce();
	});
	it.each(['microphone', 'session', 'rtc'])('disconnects during %s and prevents late reconnection', async (stage) => {
		const pending = Promise.withResolvers<any>();
		if (stage === 'microphone') {
			mic.micStream.current = null;
			mock.requestMic.mockReturnValue(pending.promise);
		}
		if (stage === 'session') fetchMock.mockReturnValue(pending.promise);
		if (stage === 'rtc') mock.initialize.mockReturnValue(pending.promise);
		const onConnect = vi.fn();
		actions.addViListener(CallbackEvent.ViConnect, onConnect);
		const connecting = actions.connect();
		await vi.waitFor(() =>
			expect(
				stage === 'microphone' ? mock.requestMic : stage === 'session' ? fetchMock : mock.initialize,
			).toHaveBeenCalled(),
		);
		actions.disconnect();
		expect(useAIStore.getState()).toMatchObject({ connected: false, connecting: false });
		if (stage === 'session') pending.resolve(Response.json({ success: true, data: { value: 'late' } }));
		else pending.resolve(stream);
		await connecting;
		expect(onConnect).not.toHaveBeenCalled();
		expect(useAIStore.getState()).toMatchObject({ connected: false, connecting: false });
		if (stage !== 'rtc') expect(mock.add).not.toHaveBeenCalled();
		expect(mock.stopMic).toHaveBeenCalled();
	});
	it('can reconnect after cancellation settles without old channel callbacks affecting the new session', async () => {
		await actions.connect();
		const oldCallback = mock.add.mock.calls[0][1].onDataChannelEvent;
		actions.disconnect();
		await actions.connect();
		mock.handler.mockResolvedValue({ state: { connected: true, connecting: false } });
		await oldCallback(EVENTS_DATA_CHANNEL, 'message', message());
		expect(mock.handler).not.toHaveBeenCalled();
		expect(mock.initialize).toHaveBeenCalledTimes(2);
	});
	it('disconnects once, resets speaking state and releases both resources even if RTC teardown throws', () => {
		useAIStore.setState({ connected: true, viTalking: true, live: true });
		mock.remove.mockImplementation(() => {
			throw new Error('closed');
		});
		const listener = vi.fn();
		actions.addViListener(CallbackEvent.ViDisconnect, listener);
		actions.disconnect();
		actions.disconnect();
		expect(useAIStore.getState()).toMatchObject({ connected: false, connecting: false, viTalking: false, live: false });
		expect(mock.stopMic).toHaveBeenCalledOnce();
		expect(listener).toHaveBeenCalledOnce();
		expect(useHomeLayoutStore.getState().showTalkToViLabel).toBe(true);
	});
	it('resets state even when microphone teardown fails', () => {
		useAIStore.setState({ connected: true });
		mock.stopMic.mockImplementation(() => {
			throw new Error('already stopped');
		});
		expect(() => actions.disconnect()).not.toThrow();
		expect(useAIStore.getState().connected).toBe(false);
	});
});

describe('data channel and callbacks', () => {
	it('dispatches state and callbacks only for the exact events channel', async () => {
		useAIStore.setState({ connected: true });
		mock.handler.mockResolvedValue({
			event: CallbackEvent.AssistantSpeechStart,
			state: { viTalking: true },
			data: { answer: 'hello' },
		});
		const listener = vi.fn();
		actions.addViListener(CallbackEvent.AssistantSpeechStart, listener);
		await actions.handleDataEvents('not-oai-events', 'message', message());
		expect(mock.handler).not.toHaveBeenCalled();
		await actions.handleDataEvents(EVENTS_DATA_CHANNEL, 'message', message());
		expect(useAIStore.getState().viTalking).toBe(true);
		expect(listener).toHaveBeenCalledWith(expect.objectContaining({ data: { answer: 'hello' } }));
	});
	it('ignores a late async handler after disconnect', async () => {
		useAIStore.setState({ connected: true });
		const pending = Promise.withResolvers<any>();
		mock.handler.mockReturnValue(pending.promise);
		const handling = actions.handleDataEvents(EVENTS_DATA_CHANNEL, 'message', message());
		actions.disconnect();
		pending.resolve({ state: { connected: true, viTalking: true } });
		await handling;
		expect(useAIStore.getState()).toMatchObject({ connected: false, viTalking: false });
	});
	it('deduplicates event IDs but accepts different events with the same data', async () => {
		useAIStore.setState({ connected: true });
		await actions.handleDataEvents(EVENTS_DATA_CHANNEL, 'message', message('one'));
		await actions.handleDataEvents(EVENTS_DATA_CHANNEL, 'message', message('one'));
		await actions.handleDataEvents(EVENTS_DATA_CHANNEL, 'message', message('two'));
		expect(mock.handler).toHaveBeenCalledTimes(2);
	});
	it.each(['close', 'error'])('tears down the connection on channel %s', async (type) => {
		useAIStore.setState({ connected: true });
		await actions.handleDataEvents(EVENTS_DATA_CHANNEL, type, new Event(type));
		expect(useAIStore.getState().connected).toBe(false);
		expect(mock.remove).toHaveBeenCalled();
	});
	it('ignores disconnected and non-message events', async () => {
		await actions.handleDataEvents(EVENTS_DATA_CHANNEL, 'message', message());
		useAIStore.setState({ connected: true });
		await actions.handleDataEvents(EVENTS_DATA_CHANNEL, 'open', new Event('open'));
		expect(mock.handler).not.toHaveBeenCalled();
	});
	it('settles a failed event handler without an unhandled rejection', async () => {
		useAIStore.setState({ connected: true });
		mock.handler.mockRejectedValue(new Error('bad event'));
		await expect(actions.handleDataEvents(EVENTS_DATA_CHANNEL, 'message', message())).resolves.toBeUndefined();
		expect(useAIStore.getState().connected).toBe(false);
	});
	it('deduplicates listeners and lets cleanup remove a registered handler', () => {
		const listener = vi.fn();
		const cleanup = actions.addViListener(CallbackEvent.ViConnect, listener);
		actions.addViListener(CallbackEvent.ViConnect, listener);
		processEventCallbacks(CallbackEvent.ViConnect);
		expect(listener).toHaveBeenCalledOnce();
		cleanup();
		cleanup();
		processEventCallbacks(CallbackEvent.ViConnect);
		expect(listener).toHaveBeenCalledOnce();
		expect(useAIStore.getState().viListeners.size).toBe(0);
	});
	it('a failing listener does not prevent the remaining listeners or cleanup', () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		actions.addViListener(CallbackEvent.ViConnect, () => {
			throw new Error('UI error');
		});
		const next = vi.fn();
		actions.addViListener(CallbackEvent.ViConnect, next);
		expect(() => processEventCallbacks(CallbackEvent.ViConnect)).not.toThrow();
		expect(next).toHaveBeenCalledOnce();
	});
	it('sends a user message after canceling, then asks for a response', () => {
		actions.setTalk(true);
		actions.setViTalking(true);
		actions.handleUserMessage('Hi');
		expect(mock.stopResponse.mock.invocationCallOrder[0]).toBeLessThan(mock.sendUser.mock.invocationCallOrder[0]);
		expect(mock.sendUser).toHaveBeenCalledWith('Hi');
		expect(mock.sendUser.mock.invocationCallOrder[0]).toBeLessThan(mock.respond.mock.invocationCallOrder[0]);
		expect(useAIStore.getState()).toMatchObject({ talk: true, viTalking: true });
	});
});
