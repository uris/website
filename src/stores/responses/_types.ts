export enum ResponseType {
	Text = 'text',
	Audio = 'audio',
}

export enum Role {
	Assistant = 'assistant',
	User = 'user',
}

export type ViResponse = {
	id: string;
	role: Role;
	type: ResponseType;
	value: string;
	timestamp: number;
	active: boolean;
	delta?: string;
	disconnected?: boolean;
};

export type ViResponsesStore = {
	responses: ViResponse[];
	lastResponse: ViResponse | null;
	actions: {
		handleResponseStart: (id: string, type: ResponseType) => void;
		handleResponseDelta: (id: string, delta: string) => void;
		handleResponseEnd: (id: string) => void;
		handleDisconnectCleanUp: () => void;
		handleUpdateLastResponse: (lastResponse: ViResponse) => void;
	};
};
