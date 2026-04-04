export type ViStore = {
	connected: boolean;
	connecting: boolean;
	talk: boolean;
	actions: {
		setTalk: (state: boolean) => void;
		connect: (talk?: boolean) => void;
		disconnect: () => void;
	};
};
