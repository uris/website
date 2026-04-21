import { CallbackEvent, type ViEventMessage } from '@/stores/ai/_types';
import UIView, { ToolType, UITheme } from '@/stores/ai/ai-tools/_types';
import { sendToolCallResultsItem } from '@/stores/ai/ViTalkCreateConvoItemFactory';
import { processEventCallbacks } from '@/stores/ai/viStore';

export async function viTalkToolCallHandler(params: { id: string; name: any; args: any; call_id: string }) {
	switch (params.name) {
		// *** UPDATE UI Settings: volume, theme, etc.
		case ToolType.UpdateUiSettings: {
			console.log({ params });
			if (typeof params.args === 'object') {
				if ('theme' in params.args) handleThemeChange(params.args.theme, params.call_id);
				if ('volume' in params.args) handleVolumeChange(params.args.volume, params.call_id);
			}
			break;
		}

		// *** GET PROJECT DETAILS
		case ToolType.RequestProjectDetails: {
			if (typeof params.args === 'object' && 'slug' in params.args) {
				const response = await fetch(`/server/projects/${params.args.slug}`);
				if (response.ok) {
					const { data } = await response.json();
					if (data) {
						sendToolCallResultsItem(data, params.call_id, true, ToolType.RequestProjectDetails);
					}
				}
			}
			break;
		}

		// *** GET SKILLS
		case ToolType.RequestSkills: {
			const response = await fetch(`/server/skills`);
			if (response.ok) {
				const { data } = await response.json();
				if (data) {
					sendToolCallResultsItem(data, params.call_id, true, ToolType.RequestSkills);
				}
			}
			break;
		}

		// *** OPEN A BROWSER VIEW
		case ToolType.OpenView: {
			console.log('open view', { params });
			if (typeof params.args === 'object' && 'view' in params.args) {
				// get params for the view / project to open
				let action_value: ViEventMessage['action_value'];
				switch (params.args.view) {
					case UIView.Projects:
						action_value = { slug: params.args.slug, view: params.args.view };
						break;
					default:
						action_value = { view: params.args.view };
						break;
				}
				// emit event to open the selected project
				processEventCallbacks(CallbackEvent.ViOpenView, {
					event: CallbackEvent.ViOpenView,
					id: params.call_id,
					action_value,
				});
			}
			break;
		}

		// *** OPEN ALL PROJECTS
		case ToolType.ViewAllProjects: {
			console.log('view all projects', { params });
			// emit event to open the selected project
			processEventCallbacks(CallbackEvent.ViOpenView, {
				event: CallbackEvent.ViOpenView,
				id: params.call_id,
				action_value: { view: UIView.Projects },
			});
			break;
		}

		default: {
			break;
		}
	}
}

/**
 * Request a theme change
 */
export function handleThemeChange(theme: unknown, call_id: string) {
	let sliceTheme: UITheme = UITheme.System;
	if (typeof theme === 'string' && theme === 'darkMode') sliceTheme = UITheme.DarkMode;
	else if (typeof theme === 'string' && theme === 'lightMode') sliceTheme = UITheme.LightMode;
	// emit the requested theme to listeners
	processEventCallbacks(CallbackEvent.ViThemeChange, {
		event: CallbackEvent.ViThemeChange,
		id: call_id,
		action_value: { theme: sliceTheme },
	});
}

/**
 * Request a volume change
 */
export function handleVolumeChange(volume: unknown, call_id: string) {
	if (typeof volume === 'number' && volume >= 0 && volume <= 1) {
		// emit the requested volume to listeners
		processEventCallbacks(CallbackEvent.ViVolumeChange, {
			event: CallbackEvent.ViVolumeChange,
			id: call_id,
			action_value: { volume },
		});
	}
}
