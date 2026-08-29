import { projectSlugs } from '@/projects/_registry/slugs';
import UIView, { ToolType, UIAction, UITheme } from './_types';

/**
 * Tool that allows the model to request project details
 */
export const request_project_details = {
	type: 'function',
	name: ToolType.RequestProjectDetails,
	description: 'Retrieves the details of a specific project',
	parameters: {
		type: 'object',
		properties: {
			slug: {
				type: 'string',
				description: 'Project slug',
				enum: [...projectSlugs],
			},
		},
		required: ['slug'],
		additionalProperties: false,
	},
};

/**
 * Tool that allows the model to display all projects
 */
export const view_all_projects = {
	type: 'function',
	name: ToolType.ViewAllProjects,
	description: 'Displays and lists all of Uris projects',
	parameters: {
		type: 'object',
		properties: {},
		required: [],
		additionalProperties: false,
	},
};

/**
 * Tool to allow the model to open the project details in the browser window
 */
export const open_view = {
	type: 'function',
	name: ToolType.OpenView,
	description: 'Instructs the browser to open a specific view - project, skills, or contact - in the sidebar',
	parameters: {
		type: 'object',
		properties: {
			view: {
				type: 'string',
				description: 'the view the user will see in the viewport sidebar',
				enum: Object.values(UIView),
			},
			slug: {
				type: 'string',
				description: 'If requesting a specific project, the slug for the project being requested.',
				enum: [...projectSlugs],
			},
		},
		required: ['view'],
		additionalProperties: false,
	},
};

/**
 * Tool that allows the model to request skills details
 */
export const request_skills = {
	type: 'function',
	name: ToolType.RequestSkills,
	description: 'Retrieves details on Uris skills, tools, etc he is comfortable with',
	parameters: {
		type: 'object',
		properties: {},
		required: [],
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
				enum: Object.values(UITheme),
			},
			[UIAction.Volume]: {
				type: 'number',
				description: 'the value between 0 (no volume) and 1 (max volume) to set the system sound level',
			},
		},
		required: [],
		additionalProperties: false,
	},
};
