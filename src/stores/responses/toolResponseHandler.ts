import { CallbackEvent } from '@/stores/ai/_types';
import { ToolType } from '@/stores/ai/ai-tools/_types';
import { sendToolCallResultsItem } from '@/stores/ai/ViTalkCreateConvoItemFactory';
import { processEventCallbacks } from '@/stores/ai/viStore';

export async function handleToolResponse(params: {
	id: string;
	name: any;
	args: any;
	call_id: string;
}) {
	switch (params.name) {
		// *** UPDATE UI Settings: volume, theme, etc.
		case ToolType.UpdateUiSettings: {
			if (typeof params.args === 'object') {
				if ('theme' in params.args) handleThemeChange(params.args.theme, params.call_id);
				if ('volume' in params.args) handleVolumeChange(params.args.volume, params.call_id);
			}
			break;
		}

		// *** GET PROJECT DETAILS
		case ToolType.RequestProjectDetails: {
			if (typeof params.args === 'object' && 'slug' in params.args) {
				const response = await fetch(`/api/projects/${params.args.slug}`);
				if (response.ok) {
					const { data } = await response.json();
					console.log('Project details fetched:', data);
					if (data) {
						sendToolCallResultsItem(data, params.call_id, true, ToolType.RequestProjectDetails);
					}
				}
			}
			break;
		}

		// *** OPEN A PROJECT VIEW
		case ToolType.OpenProjectView: {
			if (typeof params.args === 'object' && 'slug' in params.args) {
				// emit event to open the selected project
				processEventCallbacks(CallbackEvent.ViOpenProjectView, {
					event: CallbackEvent.ViOpenProjectView,
					id: params.call_id,
					action_value: { slug: params.args.slug },
				});
			}
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
	let sliceTheme: 'system' | 'lightMode' | 'darkMode' = 'system';
	if (typeof theme === 'string' && theme === 'dark') sliceTheme = 'darkMode';
	else if (typeof theme === 'string' && theme === 'light') sliceTheme = 'lightMode';

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
