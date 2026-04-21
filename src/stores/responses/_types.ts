export enum ResponseType {
	Text = 'text',
	Audio = 'audio',
	SessionStart = 'session start',
}

export enum Role {
	Assistant = 'assistant',
	User = 'user',
	System = 'system',
	Tool = 'tool',
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
	interrupted?: boolean;
};

export type ViResponsesStore = {
	responses: ViResponse[];
	lastResponse: ViResponse | null;
	bufferStreaming: boolean;
	autoScrollStream: boolean;
	actions: {
		handleSessionStart: (id: string) => void;
		handleResponseStart: (id: string, type: ResponseType) => void;
		handleResponseDelta: (id: string, delta: string) => void;
		handleResponseEnd: (id: string) => void;
		handleDisconnectCleanUp: (streamed?: string) => void;
		handleUpdateLastResponse: (lastResponse: ViResponse) => void;
		handleNewUserMessage: (message: UserMessage) => void;
		handleUpdateUserMessage: (message: Partial<UserMessage>) => void;
		handleToolCallMessage: (id: string) => Promise<void>;
		setBufferStreaming: (streaming: boolean) => void;
		setAutoScrollStream: (autoScrollStream: boolean) => void;
	};
};

export type UserMessage = {
	id: string;
	content_type: UserMessageType;
	text: string | null | undefined;
	transcript: string | null | undefined;
};

export enum UserMessageType {
	Audio = 'input_audio',
	Text = 'input_text',
}
