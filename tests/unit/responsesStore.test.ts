import { beforeEach, describe, expect, it } from 'vitest';
import { ResponseType } from '@/stores/responses/_types';
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
