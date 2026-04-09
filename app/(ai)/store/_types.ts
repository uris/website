export type AILayoutStore = {
	sidebarOpen: boolean;
	settingsOpen: boolean;
	textInputBar: boolean;
	footerSize: number | undefined;
	userName: string;
	actions: {
		toggleSideBar: (open?: boolean) => void;
		toggleSettings: (open?: boolean) => void;
		toggleInputBar: (open?: boolean) => void;
		setFooterSize: (size: number) => void;
		setUserName: (name: string) => void;
	};
};
