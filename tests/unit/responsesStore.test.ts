import { beforeEach, describe, expect, it } from 'vitest';
import { ResponseType, Role, UserMessageType } from '@/stores/responses/_types';
import { useViResponsesStore } from '@/stores/responses/responsesStore';

const actions = useViResponsesStore.getState().actions;

beforeEach(() => {
	useViResponsesStore.setState(useViResponsesStore.getInitialState(), true);
});

describe('streamed responses', () => {
	it('assembles matching deltas and ignores events from another response', () => {
		actions.handleResponseDelta('missing', 'ignored');
		expect(useViResponsesStore.getState().lastResponse).toBeNull();
		actions.handleResponseStart('current', ResponseType.Text);
		actions.handleResponseDelta('current', 'Hello');
		actions.handleResponseDelta('stale', 'ignored');
		actions.handleResponseEnd('stale');
		expect(useViResponsesStore.getState().lastResponse?.active).toBe(true);
		actions.handleResponseDelta('current', ' world');
		actions.handleResponseEnd('current');
		expect(useViResponsesStore.getState().lastResponse).toMatchObject({
			id: 'current',
			value: 'Hello world',
			active: false,
			delta: undefined,
		});
	});

	it('keeps the completed response in history when the next one starts', () => {
		actions.handleResponseStart('first', ResponseType.Text);
		actions.handleResponseDelta('first', 'First answer');
		actions.handleResponseEnd('first');
		actions.handleResponseStart('second', ResponseType.Audio);
		expect(useViResponsesStore.getState().responses).toEqual([
			expect.objectContaining({ id: 'first', value: 'First answer', active: false }),
		]);
		expect(useViResponsesStore.getState().lastResponse).toMatchObject({ id: 'second', value: '', active: true });
	});

	it('settles the visible transcript on disconnect without overwriting it again', () => {
		actions.handleResponseStart('current', ResponseType.Audio);
		actions.handleResponseDelta('current', 'Full transcript');
		actions.handleDisconnectCleanUp('Heard so far');
		actions.handleDisconnectCleanUp('ignored');
		expect(useViResponsesStore.getState().lastResponse).toMatchObject({
			value: 'Heard so far',
			active: false,
			delta: undefined,
		});
	});
});

describe('response lifecycle edge cases', () => {
	it('records each session and response only once, ignoring missing identifiers', () => {
		actions.handleSessionStart('');
		actions.handleSessionStart('session');
		actions.handleSessionStart('session');
		expect(useViResponsesStore.getState().responses).toHaveLength(1);
		actions.handleResponseStart('', ResponseType.Audio);
		expect(useViResponsesStore.getState().lastResponse).toBeNull();
		actions.handleResponseStart('one', ResponseType.Audio);
		actions.handleResponseDelta('one', 'preserved');
		actions.handleResponseStart('one', ResponseType.Audio);
		expect(useViResponsesStore.getState().lastResponse?.value).toBe('preserved');
		actions.handleResponseStart('two', ResponseType.Text);
		actions.handleResponseStart('one', ResponseType.Audio);
		expect(useViResponsesStore.getState().lastResponse?.id).toBe('two');
	});
	it('ignores deltas after completion and preserves transcript when disconnect has no override', () => {
		actions.handleResponseEnd('missing');
		actions.handleDisconnectCleanUp();
		actions.handleResponseStart('one', ResponseType.Audio);
		actions.handleResponseDelta('one', 'Hello');
		actions.handleDisconnectCleanUp();
		actions.handleResponseDelta('one', 'late');
		expect(useViResponsesStore.getState().lastResponse).toMatchObject({ value: 'Hello', active: false });
	});
	it('creates one audio placeholder and updates only the matching user message', () => {
		const audio = { id: 'audio', content_type: UserMessageType.Audio, text: undefined, transcript: undefined };
		actions.handleNewUserMessage(audio);
		actions.handleNewUserMessage(audio);
		actions.handleNewUserMessage({
			id: 'text',
			content_type: UserMessageType.Text,
			text: 'Question',
			transcript: undefined,
		});
		expect(useViResponsesStore.getState().responses).toHaveLength(2);
		expect(useViResponsesStore.getState().responses[0]).toMatchObject({ value: '', active: true, role: Role.User });
		actions.handleUpdateUserMessage({ id: 'audio', transcript: 'Spoken question' });
		actions.handleUpdateUserMessage({ id: 'missing', transcript: 'Ignored' });
		expect(useViResponsesStore.getState().responses.map((r) => [r.id, r.value, r.active])).toEqual([
			['audio', 'Spoken question', false],
			['text', 'Question', false],
		]);
	});
	it('handles an empty final transcript and ignores missing transcript/id updates', () => {
		actions.handleNewUserMessage({ id: 'audio', content_type: UserMessageType.Audio, text: null, transcript: null });
		actions.handleUpdateUserMessage({ transcript: 'ignored' });
		actions.handleUpdateUserMessage({ id: 'audio' });
		expect(useViResponsesStore.getState().responses[0].active).toBe(true);
		actions.handleUpdateUserMessage({ id: 'audio', transcript: '' });
		expect(useViResponsesStore.getState().responses[0]).toMatchObject({ value: '', active: false });
	});
	it('ignores unknown message types and missing IDs; accepts text and already transcribed audio', () => {
		actions.handleNewUserMessage({ id: '', content_type: UserMessageType.Text, text: 'no id', transcript: null });
		actions.handleNewUserMessage({
			id: 'invalid',
			content_type: 'invalid' as UserMessageType,
			text: null,
			transcript: null,
		});
		actions.handleNewUserMessage({ id: 'text', content_type: UserMessageType.Text, text: null, transcript: null });
		actions.handleNewUserMessage({
			id: 'audio',
			content_type: UserMessageType.Audio,
			text: null,
			transcript: 'Already spoken',
		});
		expect(useViResponsesStore.getState().responses.map((r) => [r.value, r.active])).toEqual([
			['', false],
			['Already spoken', false],
		]);
	});
	it('marks only the matching response as a tool and supports UI response replacement', async () => {
		await actions.handleToolCallMessage('missing');
		actions.handleResponseStart('one', ResponseType.Audio);
		await actions.handleToolCallMessage('other');
		expect(useViResponsesStore.getState().lastResponse?.role).toBe(Role.Assistant);
		await actions.handleToolCallMessage('one');
		expect(useViResponsesStore.getState().lastResponse?.role).toBe(Role.Tool);
		const response = useViResponsesStore.getState().lastResponse;
		if (!response) throw new Error('Expected an active response');
		actions.handleUpdateLastResponse({ ...response, interrupted: true });
		actions.setBufferStreaming(true);
		actions.setAutoScrollStream(false);
		expect(useViResponsesStore.getState()).toMatchObject({
			bufferStreaming: true,
			autoScrollStream: false,
			lastResponse: { interrupted: true },
		});
	});
});
