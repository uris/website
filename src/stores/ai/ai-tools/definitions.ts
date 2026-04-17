import { Project } from '@/stores/sidebar/_types';
import { ToolType, UIAction } from './_types';

/**
 * Tool that allows the model to request project details
 */
export const request_project_details = {
	type: 'function',
	name: ToolType.RequestProjectDetails,
	description: 'Retrieves then details of a specific project you want more information about',
	parameters: {
		type: 'object',
		properties: {
			slug: {
				type: 'string',
				description: 'Project slug',
				enum: ['slice', 'uris-design'],
			},
		},
		required: ['slug'],
		additionalProperties: false,
	},
};

/**
 * Tool to allow the model to open the project details in the browser window
 */
export const open_project_view = {
	type: 'function',
	name: ToolType.OpenProjectView,
	description: 'Instructs the browser to open the project view in the workspace',
	parameters: {
		type: 'object',
		properties: {
			slug: {
				type: 'string',
				description: 'Project slug',
				enum: [Project.Slice, Project.UrisDesign],
			},
		},
		required: ['slug'],
		additionalProperties: false,
	},
};

/**
 * Tool to allows the model to manage and update settings
 */
export const update_ui_settings = {
	type: 'function',
	name: ToolType.UpdateUiSettings,
	description: 'Instructs the UI to update the requested setting to the requested value',
	parameters: {
		type: 'object',
		properties: {
			[UIAction.Theme]: {
				type: 'string',
				description: 'set the color scheme for the UI, where system is the PC display setting',
				enum: ['dark', 'light', 'system'],
			},
			[UIAction.Volume]: {
				type: 'number',
				description:
					'the value between 0 (no volume) and 1 (max volume) to set the system sound level',
			},
		},
		required: [],
		additionalProperties: false,
	},
};
