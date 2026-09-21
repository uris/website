import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CallbackEvent } from '@/stores/ai/_types';
import UIView, { ToolType, UITheme } from '@/stores/ai/ai-tools/_types';
import { handleThemeChange, handleVolumeChange, viTalkToolCallHandler } from '@/stores/ai/viTalkToolCallHandler';

const mocks = vi.hoisted(() => ({ callback: vi.fn(), result: vi.fn() }));
vi.mock('@/stores/ai/viStore', () => ({ processEventCallbacks: mocks.callback }));
vi.mock('@/stores/ai/ViTalkCreateConvoItemFactory', () => ({ sendToolCallResultsItem: mocks.result }));
const fetchMock = vi.fn<typeof fetch>();
const call = (name: string, args: unknown = {}) =>
	viTalkToolCallHandler({ id: 'response', call_id: 'call', name, args });
beforeEach(() => {
	fetchMock.mockReset();
	vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());
describe('UI tools', () => {
	it.each([
		[UITheme.DarkMode, UITheme.DarkMode],
		[UITheme.LightMode, UITheme.LightMode],
		['system', UITheme.System],
		[null, UITheme.System],
	])('maps theme %j', (input, theme) => {
		handleThemeChange(input, 'call');
		expect(mocks.callback).toHaveBeenCalledWith(CallbackEvent.ViThemeChange, {
			event: CallbackEvent.ViThemeChange,
			id: 'call',
			action_value: { theme },
		});
	});
	it.each([0, 0.5, 1])('accepts volume %s', (volume) => {
		handleVolumeChange(volume, 'call');
		expect(mocks.callback).toHaveBeenCalledWith(CallbackEvent.ViVolumeChange, {
			event: CallbackEvent.ViVolumeChange,
			id: 'call',
			action_value: { volume },
		});
	});
	it.each([-1, 2, NaN, Infinity, null, '0.5'])('ignores invalid volume %j', (volume) => {
		handleVolumeChange(volume, 'call');
		expect(mocks.callback).not.toHaveBeenCalled();
	});
	it('dispatches each supplied setting and leaves absent settings alone', async () => {
		await call(ToolType.UpdateUiSettings, { theme: 'darkMode', volume: 0 });
		expect(mocks.callback).toHaveBeenCalledTimes(2);
		await call(ToolType.UpdateUiSettings, {});
		expect(mocks.callback).toHaveBeenCalledTimes(2);
	});
	it.each([UIView.Projects, UIView.Skills, UIView.Contact])('opens %s', async (view) => {
		await call(ToolType.OpenView, { view, slug: 'slice' });
		expect(mocks.callback).toHaveBeenCalledWith(CallbackEvent.ViOpenView, {
			event: CallbackEvent.ViOpenView,
			id: 'call',
			action_value: view === UIView.Projects ? { view, slug: 'slice' } : { view },
		});
	});
	it('opens the project list without selecting a project', async () => {
		await call(ToolType.ViewAllProjects);
		expect(mocks.callback).toHaveBeenCalledWith(CallbackEvent.ViOpenView, {
			event: CallbackEvent.ViOpenView,
			id: 'call',
			action_value: { view: UIView.Projects },
		});
	});
	it.each([null, [], 3, 'invalid'])('ignores malformed tool arguments %j', async (args) => {
		for (const tool of [ToolType.UpdateUiSettings, ToolType.OpenView, ToolType.RequestProjectDetails])
			await call(tool, args);
		expect(mocks.callback).not.toHaveBeenCalled();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('ignores unknown tools and invalid views', async () => {
		await call('unknown');
		await call(ToolType.OpenView, { view: 'Unknown' });
		expect(mocks.callback).not.toHaveBeenCalled();
		expect(mocks.result).not.toHaveBeenCalled();
	});
});
describe('data tools', () => {
	it.each([
		[ToolType.RequestSkills, '/server/skills', {}],
		[ToolType.RequestProjectDetails, '/server/projects/slice', { slug: 'slice' }],
	])('returns %s data', async (name, url, args) => {
		const data = { title: 'Example' };
		fetchMock.mockResolvedValue(Response.json({ success: true, data }));
		await call(name, args);
		expect(fetchMock).toHaveBeenCalledWith(url);
		expect(mocks.result).toHaveBeenCalledWith(data, 'call', true, name);
	});
	it.each(['http', 'empty', 'network', 'malformed'])(
		'returns a tool failure instead of hanging on %s',
		async (failure) => {
			if (failure === 'network') fetchMock.mockRejectedValue(new Error('offline'));
			else if (failure === 'http') fetchMock.mockResolvedValue(new Response('', { status: 404 }));
			else if (failure === 'malformed') fetchMock.mockResolvedValue(new Response('{'));
			else fetchMock.mockResolvedValue(Response.json({ data: null }));
			for (const tool of [ToolType.RequestSkills, ToolType.RequestProjectDetails]) await call(tool, { slug: 'slice' });
			expect(mocks.result).toHaveBeenCalledTimes(2);
			expect(mocks.result).toHaveBeenLastCalledWith(
				{ success: false, message: 'Requested data is unavailable' },
				'call',
				true,
				ToolType.RequestProjectDetails,
			);
		},
	);
	it.each([{}, { slug: null }, { slug: 42 }, { slug: '../contact' }])(
		'does not request an invalid project %j',
		async (args) => {
			await call(ToolType.RequestProjectDetails, args);
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('cancelled data tools', () => {
	it('does not deliver a late result into a new session', async () => {
		const pending = Promise.withResolvers<Response>();
		fetchMock.mockReturnValue(pending.promise);
		let current = true;
		const result = viTalkToolCallHandler(
			{ id: 'response', name: ToolType.RequestSkills, args: {}, call_id: 'old-call' },
			() => current,
		);
		current = false;
		pending.resolve(Response.json({ data: { title: 'Skills' } }));
		await result;
		expect(mocks.result).not.toHaveBeenCalled();
	});
	it('does not execute tools without identifiers or from a cancelled session', async () => {
		await viTalkToolCallHandler({ id: '', name: ToolType.RequestSkills, args: {}, call_id: 'call' });
		await viTalkToolCallHandler({ id: 'response', name: ToolType.RequestSkills, args: {}, call_id: '' });
		await viTalkToolCallHandler(
			{ id: 'response', name: ToolType.RequestSkills, args: {}, call_id: 'call' },
			() => false,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
