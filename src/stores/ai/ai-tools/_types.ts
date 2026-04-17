export enum ToolNamespace {
	projects = 'projects',
	ui = 'ui',
}

export enum ToolType {
	RequestProjectDetails = 'request_project_details',
	ViewAllProjects = 'view_all_projects',
	OpenView = 'open_view_in_browser',
	UpdateUiSettings = 'update_ui_settings',
	RequestSkills = 'request_skills',
}

export enum UIAction {
	Theme = 'theme',
	Volume = 'volume',
}

enum UIView {
	Projects = 'Projects',
	Skills = 'Skills',
	Contact = 'Contact',
}

export enum UITheme {
	System = 'system',
	LightMode = 'lightMode',
	DarkMode = 'darkMode',
}

export default UIView;
