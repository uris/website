export const images = {
	workspaceOverview: undefined,
	realtimeConversation: undefined,
	projectRouting: undefined,
	stateModel: undefined,
	sliceFoundation: undefined,
} as const;

export type UrisDesignImageName = keyof typeof images;
