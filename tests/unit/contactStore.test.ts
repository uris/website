import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { contactForm, ValidationType } from '@/stores/contact/_types';
import { useContactStore } from '@/stores/contact/contactStore';

const { capture } = vi.hoisted(() => ({ capture: vi.fn() }));
vi.mock('@/src/analytics/trackAppEvent', () => ({ trackAppEvent: capture }));

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('@apple-pie/slice', () => ({ ToastType: { Success: 'success', Warning: 'warning' } }));
vi.mock('@apple-pie/slice/stores', () => ({ useToastStore: { getState: () => ({ actions: { push } }) } }));
const fetchMock = vi.fn<typeof fetch>();
const actions = useContactStore.getState().actions;
const populate = () => {
	actions.setFormValue('from', { value: 'person@example.com', validationType: ValidationType.email });
	actions.setFormValue('text', { value: 'Hello there', validationType: ValidationType.text });
};
beforeEach(() => {
	useContactStore.setState({ ...useContactStore.getInitialState(), formValues: new Map(), errors: [] }, true);
	fetchMock.mockReset();
	vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('contact validation', () => {
	it.each([
		['', false],
		['person', false],
		['person@example', false],
		['person @example.com', false],
		['person@example.com', true],
	])('validates email %j', (value, isValid) => {
		actions.setFormValue('from', { value, validationType: ValidationType.email });
		expect(useContactStore.getState().formValues.get('from')).toMatchObject({ value, isValid, initialized: false });
	});
	it.each([
		['', false],
		['abc', false],
		['abcd', true],
		['    ', false],
		[' a  ', false],
	])('validates the text boundary %j', (value, isValid) => {
		actions.setFormValue('text', { value, validationType: ValidationType.text });
		expect(useContactStore.getState().formValues.get('text')?.isValid).toBe(isValid);
	});
	it('allows entries that do not need validation', () => {
		actions.setFormValue('text', { value: 'draft', validationType: ValidationType.none });
		expect(useContactStore.getState().formValues.get('text')?.isValid).toBe(true);
	});
	it('shows errors only after initialization and clears them when corrected or empty', () => {
		actions.setFieldInitialized('missing');
		actions.setFormValue('from', { value: 'invalid', validationType: ValidationType.email });
		expect(useContactStore.getState().errors).toEqual([]);
		actions.setFieldInitialized('from');
		expect(useContactStore.getState().errors).toEqual([{ title: contactForm.from.errorMessage }]);
		actions.setFormValue('from', { value: 'person@example.com', validationType: ValidationType.email });
		expect(useContactStore.getState().errors).toEqual([]);
		expect(useContactStore.getState().formValues.get('from')?.initialized).toBe(true);
		actions.setFormValue('from', { value: '', validationType: ValidationType.email });
		expect(useContactStore.getState().errors).toEqual([]);
	});
	it('does not mutate earlier store snapshots when editing, initializing, or clearing', () => {
		populate();
		const original = useContactStore.getState().formValues;
		actions.setFieldInitialized('from');
		expect(original.get('from')?.initialized).toBe(false);
		actions.setFormValue('text', { value: 'New message', validationType: ValidationType.text });
		expect(original.get('text')?.value).toBe('Hello there');
		actions.clear();
		expect(original.size).toBe(2);
		expect(useContactStore.getState().formValues.size).toBe(0);
		expect(useContactStore.getState().errors).toEqual([]);
	});
	it('supports explicitly setting sending state', () => {
		actions.setSending(true);
		expect(useContactStore.getState().sending).toBe(true);
		actions.setSending(false);
		expect(useContactStore.getState().sending).toBe(false);
	});
});

describe('contact submission', () => {
	it.each(['empty', 'missing text', 'invalid email', 'invalid text'])('does not submit %s input', async (scenario) => {
		if (scenario !== 'empty')
			actions.setFormValue('from', { value: 'person@example.com', validationType: ValidationType.email });
		if (scenario === 'invalid email') {
			populate();
			actions.setFormValue('from', { value: 'invalid', validationType: ValidationType.email });
		}
		if (scenario === 'invalid text')
			actions.setFormValue('text', { value: 'abc', validationType: ValidationType.text });
		await actions.send();
		expect(fetchMock).not.toHaveBeenCalled();
		expect(push).not.toHaveBeenCalled();
		expect(useContactStore.getState().sending).toBe(false);
	});
	it('sends once while pending and clears only after success', async () => {
		populate();
		const deferred = Promise.withResolvers<Response>();
		fetchMock.mockReturnValue(deferred.promise);
		const pending = actions.send();
		expect(useContactStore.getState().sending).toBe(true);
		expect(useContactStore.getState().formValues.size).toBe(2);
		await actions.send();
		expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/server/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ from: 'person@example.com', text: 'Hello there' }),
		});
		expect(capture).not.toHaveBeenCalled();
		deferred.resolve(Response.json({ success: true }));
		await pending;
		expect(useContactStore.getState()).toMatchObject({ sending: false, errors: [] });
		expect(useContactStore.getState().formValues.size).toBe(0);
		expect(push).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ message: 'Message sent' }));
		expect(capture).toHaveBeenCalledExactlyOnceWith('contact_submitted', null);
	});
	it.each(['application failure', 'HTTP failure', 'malformed body', 'network failure'])(
		'retains input and supports retry after %s',
		async (failure) => {
			populate();
			if (failure === 'network failure') fetchMock.mockRejectedValueOnce(new Error('offline'));
			else if (failure === 'HTTP failure')
				fetchMock.mockResolvedValueOnce(Response.json({ success: true }, { status: 500 }));
			else if (failure === 'malformed body') fetchMock.mockResolvedValueOnce(new Response('not JSON'));
			else fetchMock.mockResolvedValueOnce(Response.json({ success: false, message: 'failed' }));
			await actions.send();
			expect(useContactStore.getState().sending).toBe(false);
			expect(useContactStore.getState().formValues.get('text')?.value).toBe('Hello there');
			expect(push).toHaveBeenLastCalledWith(
				expect.objectContaining({ message: 'Unable to send your message. Please try again later.' }),
			);
			expect(capture).not.toHaveBeenCalled();
			fetchMock.mockResolvedValueOnce(Response.json({ success: true }));
			await actions.send();
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(useContactStore.getState().formValues.size).toBe(0);
		},
	);
});
