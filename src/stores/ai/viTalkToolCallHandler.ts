import { isProjectSlug } from '@/projects/_registry/slugs';
import { CallbackEvent, type ViEventMessage } from '@/stores/ai/_types';
import UIView, { ToolType, UITheme } from '@/stores/ai/ai-tools/_types';
import { sendToolCallResultsItem } from '@/stores/ai/ViTalkCreateConvoItemFactory';
import { processEventCallbacks } from '@/stores/ai/viStore';

/** UI tools complete through their UI listeners; data tools return a result even on failure. */
export async function viTalkToolCallHandler(
	params: { id: string; name: string; args: unknown; call_id: string },
	isCurrent: () => boolean = () => true,
) {
	if (!params.id || !params.call_id || !isCurrent()) return;
	const args = params.args;
	if (!args || typeof args !== 'object' || Array.isArray(args)) return;
	switch (params.name) {
		case ToolType.UpdateUiSettings:
			if ('theme' in args) handleThemeChange(args.theme, params.call_id);
			if ('volume' in args) handleVolumeChange(args.volume, params.call_id);
			return;
		case ToolType.RequestProjectDetails:
			if ('slug' in args && typeof args.slug === 'string' && isProjectSlug(args.slug)) {
				await sendData(`/server/projects/${args.slug}`, params.call_id, ToolType.RequestProjectDetails, isCurrent);
			} else {
				sendToolCallResultsItem({ success: false, message: 'Invalid project identifier' }, params.call_id);
			}
			return;
		case ToolType.RequestSkills:
			await sendData('/server/skills', params.call_id, ToolType.RequestSkills, isCurrent);
			return;
		case ToolType.OpenView: {
			if (!('view' in args) || !Object.values(UIView).includes(args.view as UIView)) return;
			const view = args.view as UIView;
			const action_value: ViEventMessage['action_value'] = { view };
			if (view === UIView.Projects && 'slug' in args && typeof args.slug === 'string' && isProjectSlug(args.slug)) {
				action_value.slug = args.slug;
			}
			processEventCallbacks(CallbackEvent.ViOpenView, {
				event: CallbackEvent.ViOpenView,
				id: params.call_id,
				action_value,
			});
			return;
		}
		case ToolType.ViewAllProjects:
			processEventCallbacks(CallbackEvent.ViOpenView, {
				event: CallbackEvent.ViOpenView,
				id: params.call_id,
				action_value: { view: UIView.Projects },
			});
	}
}

async function sendData(url: string, callId: string, tool: ToolType, isCurrent: () => boolean) {
	let result: unknown = { success: false, message: 'Requested data is unavailable' };
	try {
		const response = await fetch(url);
		if (response.ok) {
			const body = await response.json();
			if (body?.data && body.success !== false) result = body.data;
		}
	} catch {
		// Complete the tool call with an error so the model can explain the failure.
	}
	if (isCurrent()) sendToolCallResultsItem(result, callId, true, tool);
}

export function handleThemeChange(theme: unknown, call_id: string) {
	let sliceTheme: UITheme = UITheme.System;
	if (theme === 'darkMode') sliceTheme = UITheme.DarkMode;
	else if (theme === 'lightMode') sliceTheme = UITheme.LightMode;
	processEventCallbacks(CallbackEvent.ViThemeChange, {
		event: CallbackEvent.ViThemeChange,
		id: call_id,
		action_value: { theme: sliceTheme },
	});
}

export function handleVolumeChange(volume: unknown, call_id: string) {
	if (typeof volume === 'number' && volume >= 0 && volume <= 1) {
		processEventCallbacks(CallbackEvent.ViVolumeChange, {
			event: CallbackEvent.ViVolumeChange,
			id: call_id,
			action_value: { volume },
		});
	}
}
