import { ToolType } from '@/stores/ai/ai-tools/_types';
import { AppEvent, type ViEndReason, type ViFailureStage } from './events';
import { trackAppEvent } from './trackAppEvent';

// A local conversation ID links attempts, accepted turns and tools without sending provider IDs or content.
let context: { vi_session_id: string; started: boolean; startedAt?: number; failed: boolean } | null = null;
const requests = new Set<string>();
const tools = new Map<string, { tool: ToolType; expected: number; parts: Set<string>; success: boolean }>();

export function trackViSessionAttempted() {
	trackViSessionEnded('replaced');
	context = { vi_session_id: crypto.randomUUID(), started: false, failed: false };
	trackAppEvent(AppEvent.ViSessionAttempted, { vi_session_id: context.vi_session_id });
}

export function trackViSessionStarted() {
	if (!context || context.started || context.failed) return;
	context.started = true;
	context.startedAt = performance.now();
	trackAppEvent(AppEvent.ViSessionStarted, { vi_session_id: context.vi_session_id });
}

export function trackViSessionEnded(reason: ViEndReason = 'user_disconnect') {
	const ended = context;
	context = null;
	if (ended?.started && ended.startedAt !== undefined) {
		trackAppEvent(AppEvent.ViSessionEnded, {
			vi_session_id: ended.vi_session_id,
			duration_seconds: Math.max(0, (performance.now() - ended.startedAt) / 1000),
			reason,
		});
	}
	requests.clear();
	tools.clear();
}

export function trackViSessionFailed(stage: ViFailureStage) {
	if (!context || context.failed || context.started) return;
	context.failed = true;
	trackAppEvent(AppEvent.ViSessionFailed, { vi_session_id: context.vi_session_id, stage });
}

export function trackViRequestSubmitted(itemId: unknown, input_mode: 'voice' | 'text') {
	if (!context?.started || typeof itemId !== 'string' || !itemId || requests.has(itemId)) return;
	requests.add(itemId);
	trackAppEvent(AppEvent.ViRequestSubmitted, { vi_session_id: context.vi_session_id, input_mode });
}

export function registerViToolCall(callId: string, name: string, expected = 1) {
	if (!context?.started || tools.has(callId) || !Object.values(ToolType).includes(name as ToolType)) return;
	tools.set(callId, { tool: name as ToolType, expected, parts: new Set(), success: true });
}

export function trackViToolCompleted(callId: string, success: boolean, part = 'result') {
	const tool = tools.get(callId);
	if (!context?.started || !tool || tool.parts.has(part) || tool.parts.size >= tool.expected) return;
	tool.parts.add(part);
	tool.success &&= success;
	if (tool.parts.size === tool.expected) {
		trackAppEvent(AppEvent.ViToolCompleted, {
			vi_session_id: context.vi_session_id,
			tool: tool.tool,
			success: tool.success,
		});
	}
}
