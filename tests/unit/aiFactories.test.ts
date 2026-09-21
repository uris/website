import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONN_NAME, EVENTS_DATA_CHANNEL } from '@/stores/ai/_data';
import { ToolNamespace, ToolType } from '@/stores/ai/ai-tools/_types';
import { getAllTools, getProjectTools, getUITools } from '@/stores/ai/ai-tools/loadTools';
import {
	createConversationItem,
	sendToolCallResultsItem,
	sendUserMessage,
} from '@/stores/ai/ViTalkCreateConvoItemFactory';
import {
	createToolCallResponseInstructions,
	pickInitialMessage,
	requestResponseStop,
	sendCreateIntroMessage,
	sendResponseRequest,
	sendUserResponseRequest,
} from '@/stores/ai/ViTalkResponseCreateFactory';
import {
	projectList,
	updateSessionInstructions,
	updateSessionTools,
	viBaseInstructions,
} from '@/stores/ai/viTalkSessionUpdateFactory';
import { useHomeLayoutStore } from '@/stores/home-layout/homeLayoutStore';

const transport = vi.hoisted(() => ({ get: vi.fn(), send: vi.fn() }));
vi.mock('@apple-pie/slice/stores', () => ({ getWebRTCConnections: transport.get }));
const fetchMock = vi.fn<typeof fetch>();
let connection: { connection: { sendMessage: typeof transport.send } };
beforeEach(() => {
	connection = { connection: { sendMessage: transport.send } };
	transport.get.mockReturnValue(connection);
	fetchMock.mockReset();
	vi.stubGlobal('fetch', fetchMock);
	useHomeLayoutStore.setState(useHomeLayoutStore.getInitialState(), true);
});
afterEach(() => vi.unstubAllGlobals());
const payloads = () =>
	transport.send.mock.calls.map(([channel, payload]) => {
		expect(channel).toBe(EVENTS_DATA_CHANNEL);
		return payload;
	});
describe('outgoing conversation and response events', () => {
	it('creates a user text item and sends it on the named connection', () => {
		const expected = {
			type: 'conversation.item.create',
			item: { type: 'message', role: 'user', content: [{ type: 'input_text', text: 'Hello' }] },
		};
		expect(createConversationItem('Hello')).toEqual(expected);
		sendUserMessage('Hello');
		expect(payloads()).toEqual([expected]);
		expect(transport.get).toHaveBeenCalledWith(CONN_NAME);
	});
	it('cancels a response before clearing buffered audio', () => {
		requestResponseStop();
		expect(payloads()).toEqual([{ type: 'response.cancel' }, { type: 'output_audio_buffer.clear' }]);
	});
	it('requests audio for user messages and a generic response when no tool is specified', () => {
		sendUserResponseRequest();
		sendResponseRequest();
		expect(payloads()).toEqual([
			{ type: 'response.create', response: { output_modalities: ['audio'] } },
			{ type: 'response.create' },
		]);
	});
	it.each([ToolType.ViewAllProjects, ToolType.RequestProjectDetails, ToolType.RequestSkills])(
		'adds instructions for %s',
		(tool) => {
			sendResponseRequest(tool);
			expect(payloads()[0]).toMatchObject({ type: 'response.create', response: { instructions: expect.any(String) } });
			expect(createToolCallResponseInstructions(tool)?.length).toBeGreaterThan(20);
		},
	);
	it('does not invent instructions for unrelated tools', () =>
		expect(createToolCallResponseInstructions(ToolType.OpenView)).toBeUndefined());
	it('sends serialized tool output before requesting the model response', () => {
		sendToolCallResultsItem({ answer: 'Yes' }, 'call', true, ToolType.RequestSkills);
		expect(payloads()[0]).toEqual({
			type: 'conversation.item.create',
			item: { type: 'function_call_output', call_id: 'call', output: '{"answer":"Yes"}' },
		});
		expect(payloads()[1].type).toBe('response.create');
	});
	it('can defer the response and ignores tool output without a call identifier', () => {
		sendToolCallResultsItem({}, '');
		expect(transport.send).not.toHaveBeenCalled();
		sendToolCallResultsItem({}, 'call', false);
		expect(transport.send).toHaveBeenCalledTimes(1);
	});
	it.each([
		() => sendUserMessage('Hi'),
		requestResponseStop,
		sendUserResponseRequest,
		() => sendResponseRequest(),
		() => sendCreateIntroMessage(),
		() => sendToolCallResultsItem({}, 'call'),
		() => updateSessionTools(),
		() => updateSessionInstructions(),
	])('does nothing without an active connection', async (call) => {
		transport.get.mockReturnValue(null);
		await call();
		expect(transport.send).not.toHaveBeenCalled();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('personalizes first and returning greetings without hardcoding whole prompts', () => {
		expect(pickInitialMessage()).toContain('Hi, Vi here.');
		sendCreateIntroMessage();
		expect(payloads()[0].response.output_modalities).toEqual(['audio']);
		useHomeLayoutStore.setState({ userName: 'Ada' });
		expect(pickInitialMessage()).toContain('Hi, Ada');
		expect(pickInitialMessage(false)).toContain('Welcome back, Ada');
		sendCreateIntroMessage(false);
		expect(payloads()[1].response.instructions).toContain('Welcome back, Ada');
	});
});
describe('session configuration', () => {
	it.each([
		[undefined, getAllTools],
		[ToolNamespace.projects, getProjectTools],
		[ToolNamespace.ui, getUITools],
	])('sends tool namespace %s', (namespace, expected) => {
		updateSessionTools(namespace);
		expect(payloads()).toEqual([
			{ type: 'session.update', session: { type: 'realtime', tools: expected(), tool_choice: 'auto' } },
		]);
	});
	it('seeds instructions with project titles, identifiers, summaries, and optional tech stacks', async () => {
		fetchMock.mockResolvedValue(
			Response.json({
				data: [
					{ slug: 'slice', title: 'Slice', summary: 'UI SDK', techStack: ['React', 'TypeScript'] },
					{ slug: 'other', title: 'Other', summary: 'Design', techStack: [] },
				],
			}),
		);
		await updateSessionInstructions();
		const instruction = payloads()[0].session.instructions;
		expect(fetchMock).toHaveBeenCalledWith('/server/projects/summaries');
		expect(instruction).toContain(viBaseInstructions);
		expect(instruction).toContain('(slug/id: slice): UI SDK Tech stack: React, TypeScript.');
		expect(instruction).toContain('(slug/id: other): Design');
	});
	it.each(['http', 'empty', 'invalid', 'network', 'malformed'])(
		'continues with base instructions when project summaries fail: %s',
		async (failure) => {
			if (failure === 'network') fetchMock.mockRejectedValue(new Error('offline'));
			else if (failure === 'http') fetchMock.mockResolvedValue(new Response('', { status: 503 }));
			else if (failure === 'malformed') fetchMock.mockResolvedValue(new Response('{'));
			else fetchMock.mockResolvedValue(Response.json({ data: failure === 'empty' ? null : { invalid: true } }));
			expect(await projectList()).toBe('');
			await updateSessionInstructions();
			expect(payloads()[0].session.instructions).toContain(viBaseInstructions);
		},
	);
	it('does not send an old update after the connection was replaced', async () => {
		const pending = Promise.withResolvers<Response>();
		fetchMock.mockReturnValue(pending.promise);
		const update = updateSessionInstructions();
		transport.get.mockReturnValue(null);
		pending.resolve(Response.json({ data: [] }));
		await update;
		expect(transport.send).not.toHaveBeenCalled();
	});
});
