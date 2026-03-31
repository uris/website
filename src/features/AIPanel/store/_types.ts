export type AIPanelStore = {
	sidebarOpen: boolean;
	micMuted: boolean;
	actions: {
		toggleSideBar: () => void;
		toggleMicMute: () => void;
	};
};
