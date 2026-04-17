import { open_project_view, request_project_details, update_ui_settings } from './definitions';

// all project-related tools
export function getProjectTools() {
	return [request_project_details, open_project_view];
}

// all UI instructions tools
export function getUITools() {
	return [update_ui_settings];
}

// get all tools
export function getAllTools() {
	return [...getProjectTools(), ...getUITools()];
}
