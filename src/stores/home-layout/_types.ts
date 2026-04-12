export type HomeLayoutStore = {
	sidebarOpen: boolean;
	storedSidebarOpen: true | null;
	settingsOpen: boolean;
	textInputBar: boolean;
	footerSize: number | undefined;
	userName: string | null;
	didAnimateProjects: boolean;
	showTalkToViLabel: boolean;
	projects: any[];
	actions: {
		toggleSideBar: (open?: boolean) => void;
		toggleSettings: (open?: boolean) => void;
		toggleInputBar: (open?: boolean) => void;
		setFooterSize: (size: number) => void;
		setUserName: (name: string) => void;
		setDidAnimateProjects: (didAnimateProjects: boolean) => void;
		setShowTalkToViLabel: (showTalkToViLabel: boolean) => void;
		setProjects: (projects: any[]) => void;
	};
};
