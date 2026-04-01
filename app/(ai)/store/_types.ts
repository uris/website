export type AILayoutStore = {
	sidebarOpen: boolean;
	settingsOpen: boolean;
	actions: {
		toggleSideBar: (open?: boolean) => void;
		toggleSettings: (open?: boolean) => void;
	};
};
