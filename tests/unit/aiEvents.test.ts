import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CallbackEvent } from '@/stores/ai/_types';
import { handleMessageEvent, realtimeDataEventHandler } from '@/stores/ai/ViTalkEventHandler';
import { Role } from '@/stores/responses/_types';
import { useViResponsesStore } from '@/stores/responses/responsesStore';

const mocks = vi.hoisted(() => ({
	instructions: vi.fn(),
	tools: vi.fn(),
	intro: vi.fn(),
	notification: vi.fn(),
	tool: vi.fn(),
}));
vi.mock('@/stores/ai/viTalkSessionUpdateFactory', () => ({
	updateSessionInstructions: mocks.instructions,
	updateSessionTools: mocks.tools,
}));
vi.mock('@/src/stores/ai/ViTalkResponseCreateFactory', () => ({ sendCreateIntroMessage: mocks.intro }));
vi.mock('@/src/stores/ai/viStore', () => ({ viNotification: mocks.notification }));
vi.mock('@/stores/ai/viTalkToolCallHandler', () => ({ viTalkToolCallHandler: mocks.tool }));
beforeEach(() => {
	useViResponsesStore.setState(useViResponsesStore.getInitialState(), true);
	mocks.instructions.mockReset();
});
const event = (type: string, extra: object = {}) => handleMessageEvent({ type, ...extra });
describe('realtime event envelope', () => {
	it.each(['open', 'close', 'error', 'unexpected'])('ignores %s in the message decoder', async (type) =>
		expect(await realtimeDataEventHandler(new Event(type))).toBeUndefined(),
	);
	it.each(['', '{', 'null', '5', '{}', '{"type":4}', '{"type":"unknown"}'])(
		'ignores invalid/unknown message %s',
		async (data) => expect(await realtimeDataEventHandler(new MessageEvent('message', { data }))).toBeUndefined(),
	);
	it('ignores nontext payloads and message events without data', async () => {
		expect(await realtimeDataEventHandler(new MessageEvent('message', { data: { type: 'unknown' } }))).toBeUndefined();
		expect(await realtimeDataEventHandler(new Event('message'))).toBeUndefined();
	});
	it('decodes valid message JSON', async () =>
		expect(
			await realtimeDataEventHandler(
				new MessageEvent('message', { data: JSON.stringify({ type: CallbackEvent.AssistantSpeechStart }) }),
			),
		).toMatchObject({ state: { viTalking: true } }));
});
describe('session and assistant lifecycle', () => {
	it('seeds a session before greeting and distinguishes reconnect from a first visit', async () => {
		expect(await event(CallbackEvent.SessionCreated, { session: { id: 'first' } })).toMatchObject({
			event: CallbackEvent.SessionCreated,
			state: { connected: true, connecting: false },
		});
		expect(mocks.instructions.mock.invocationCallOrder[0]).toBeLessThan(mocks.tools.mock.invocationCallOrder[0]);
		expect(mocks.intro).toHaveBeenLastCalledWith(true);
		expect(mocks.notification).toHaveBeenCalledWith('Connected');
		await event(CallbackEvent.SessionCreated, { session: { id: 'next' } });
		expect(mocks.intro).toHaveBeenLastCalledWith(false);
	});
	it('does not greet twice for a duplicate session', async () => {
		await event(CallbackEvent.SessionCreated, { session: { id: 'same' } });
		await event(CallbackEvent.SessionCreated, { session: { id: 'same' } });
		expect(mocks.intro).toHaveBeenCalledTimes(1);
	});
	it('builds and finishes an assistant transcript from a realistic event sequence', async () => {
		await event(CallbackEvent.ResponseCreated, { response: { id: 'answer' } });
		await event(CallbackEvent.TranscriptDelta, { response_id: 'answer', delta: 'Hello' });
		await event(CallbackEvent.TranscriptDelta, { response_id: 'stale', delta: 'ignore' });
		await event(CallbackEvent.TranscriptEnd, { response_id: 'answer' });
		expect(useViResponsesStore.getState().lastResponse).toMatchObject({ id: 'answer', value: 'Hello', active: false });
	});
	it.each([
		[CallbackEvent.AssistantSpeechStart, true],
		[CallbackEvent.AssistantSpeechEnd, false],
	])('updates speaking state for %s', async (type, talking) =>
		expect(await event(type)).toMatchObject({ event: type, state: { viTalking: talking } }),
	);
	it.each([CallbackEvent.ResponseStart, CallbackEvent.AudioInterrupt, CallbackEvent.UserMessageTranscriptDelta])(
		'forwards %s for UI listeners',
		async (type) => expect(await event(type)).toMatchObject({ event: type }),
	);
	it.each([CallbackEvent.SessionCreated, CallbackEvent.ResponseCreated, CallbackEvent.ResponseItemDone])(
		'ignores incomplete %s',
		async (type) => expect(await event(type)).toBeUndefined(),
	);
	it('ignores an invalid delta instead of appending undefined', async () => {
		await event(CallbackEvent.ResponseCreated, { response: { id: 'answer' } });
		await event(CallbackEvent.TranscriptDelta, { response_id: 'answer' });
		expect(useViResponsesStore.getState().lastResponse?.value).toBe('');
	});
});
describe('user messages and tools', () => {
	it('creates an audio placeholder then completes it from transcription', async () => {
		await event(CallbackEvent.UserSpeechStart, { item_id: 'user' });
		expect(
			await event('conversation.item.added', {
				item: { id: 'user', type: 'message', role: 'user', content: [{ type: 'input_audio' }] },
			}),
		).toMatchObject({ event: CallbackEvent.UserAudioMessageAdded });
		await event(CallbackEvent.UserMessageTranscriptDone, { item_id: 'user', transcript: 'Question' });
		expect(useViResponsesStore.getState().responses[0]).toMatchObject({ value: 'Question', active: false });
	});
	it('adds user text messages', async () => {
		expect(
			await event('conversation.item.added', {
				item: { id: 'text', type: 'message', role: 'user', content: [{ type: 'input_text', text: 'Hello' }] },
			}),
		).toMatchObject({ event: CallbackEvent.UserTextMessageAdded });
		expect(useViResponsesStore.getState().responses[0].value).toBe('Hello');
	});
	it.each([
		undefined,
		{ role: 'assistant', type: 'message' },
		{ role: 'user', type: 'other' },
		{ role: 'user', type: 'message' },
		{ role: 'user', type: 'message', content: [{ type: 'unknown' }] },
	])('ignores irrelevant conversation items %j', async (item) =>
		expect(await event('conversation.item.added', { item })).toBeUndefined(),
	);
	it('marks a function response as a tool and dispatches parsed arguments', async () => {
		await event(CallbackEvent.ResponseCreated, { response: { id: 'answer' } });
		await event(CallbackEvent.ResponseItemDone, {
			response_id: 'answer',
			item: { type: 'function_call', name: 'request_skills', arguments: '{}', call_id: 'call' },
		});
		expect(useViResponsesStore.getState().lastResponse?.role).toBe(Role.Tool);
		expect(mocks.tool).toHaveBeenCalledWith(
			expect.objectContaining({ id: 'answer', name: 'request_skills', args: {}, call_id: 'call' }),
			expect.any(Function),
		);
	});
	it.each(['{', 'null', '[]', '1', undefined])('ignores malformed function arguments %j', async (args) => {
		await event(CallbackEvent.ResponseItemDone, {
			response_id: 'answer',
			item: { type: 'function_call', name: 'request_skills', arguments: args, call_id: 'call' },
		});
		expect(mocks.tool).not.toHaveBeenCalled();
	});
	it.each([
		{ type: 'message' },
		{ type: 'function_call', arguments: '{}' },
		{ type: 'function_call', name: 'tool', arguments: '{}' },
	])('ignores non-call/incomplete result %j', async (item) => {
		await event(CallbackEvent.ResponseItemDone, { response_id: 'answer', item });
		expect(mocks.tool).not.toHaveBeenCalled();
	});
});

describe('cancelled session initialization', () => {
	it('does not notify or greet when disconnected while instructions are loading', async () => {
		const pending = Promise.withResolvers<void>();
		mocks.instructions.mockReturnValue(pending.promise);
		let current = true;
		const result = handleMessageEvent(
			{ type: CallbackEvent.SessionCreated, session: { id: 'cancelled' } },
			() => current,
		);
		current = false;
		pending.resolve();
		expect(await result).toBeUndefined();
		expect(mocks.tools).not.toHaveBeenCalled();
		expect(mocks.intro).not.toHaveBeenCalled();
		expect(mocks.notification).not.toHaveBeenCalled();
		expect(useViResponsesStore.getState().responses).toEqual([]);
	});
	it('ignores events belonging to an obsolete session', async () => {
		expect(await handleMessageEvent({ type: CallbackEvent.AssistantSpeechStart }, () => false)).toBeUndefined();
	});
});
