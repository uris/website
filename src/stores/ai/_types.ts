export type ViStoreState = {
	connected: boolean;
	connecting: boolean;
	live: boolean;
	talk: boolean;
};

export type ViStore = ViStoreState & {
	actions: {
		setTalk: (state: boolean) => void;
		connect: (talk?: boolean) => Promise<void>;
		disconnect: () => void;
		handleDataEvents: (
			channel: string,
			event: any,
			eventData: MessageEvent<any> | Event | RTCErrorEvent,
		) => void;
	};
};

export type MessageType =
	| 'Connecting'
	| 'Connected'
	| 'Disconnecting'
	| 'Disconnected'
	| 'Already'
	| 'Failed';
