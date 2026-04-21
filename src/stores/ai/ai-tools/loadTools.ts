import {
	open_view,
	request_project_details,
	request_skills,
	update_ui_settings,
	view_all_projects,
} from './definitions';

// all project-related tools
export function getProjectTools() {
	return [request_project_details];
}

// all skills related tools
export function getSkillTools() {
	return [request_skills];
}

// all UI instructions tools
export function getUITools() {
	return [update_ui_settings, open_view, view_all_projects];
}

// get all tools
export function getAllTools() {
	return [...getProjectTools(), ...getUITools(), ...getSkillTools()];
}
