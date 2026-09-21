import type { ToolType } from '@/stores/ai/ai-tools/_types';

export type ViFailureStage = 'microphone' | 'token' | 'webrtc' | 'session_setup';
export type ViEndReason =
	| 'user_disconnect'
	| 'connection_closed'
	| 'connection_error'
	| 'handler_error'
	| 'page_exit'
	| 'replaced';
type ViContext = { vi_session_id: string };

// event types
export enum AppEvent {
	ViewedProject = 'viewed_project',
	ViSessionAttempted = 'vi_session_attempted',
	ViSessionStarted = 'vi_session_started',
	ViSessionEnded = 'vi_session_ended',
	ViSessionFailed = 'vi_session_failed',
	ViRequestSubmitted = 'vi_request_submitted',
	ViToolCompleted = 'vi_tool_completed',
	ContactSubmitted = 'contact_submitted',
}

// map of event types mapped to data types for the info collected
export type AppEventInfo = {
	[AppEvent.ViewedProject]: { project_slug: string; presentation: 'workspace' | 'standalone' };
	[AppEvent.ViSessionAttempted]: ViContext;
	[AppEvent.ViSessionStarted]: ViContext;
	[AppEvent.ViSessionEnded]: ViContext & { duration_seconds: number; reason: ViEndReason };
	[AppEvent.ViSessionFailed]: ViContext & { stage: ViFailureStage };
	[AppEvent.ViRequestSubmitted]: ViContext & { input_mode: 'voice' | 'text' };
	[AppEvent.ViToolCompleted]: ViContext & { tool: ToolType; success: boolean };
	[AppEvent.ContactSubmitted]: null;
};
