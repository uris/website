import { beforeEach, expect, it, vi } from 'vitest';
import {
	registerViToolCall,
	trackViRequestSubmitted,
	trackViSessionAttempted,
	trackViSessionEnded,
	trackViSessionFailed,
	trackViSessionStarted,
	trackViToolCompleted,
} from '@/src/analytics/viAnalytics';
import { ToolType } from '@/stores/ai/ai-tools/_types';

const { capture } = vi.hoisted(() => ({ capture: vi.fn() }));
vi.mock('@/src/analytics/trackAppEvent', () => ({ trackAppEvent: capture }));
beforeEach(() => {
	trackViSessionEnded();
	capture.mockClear();
});

it('waits for both settings results and aggregates failure without double counting', () => {
	trackViSessionAttempted();
	trackViSessionStarted();
	registerViToolCall('call', ToolType.UpdateUiSettings, 2);
	trackViToolCompleted('call', true, 'theme');
	trackViToolCompleted('call', true, 'theme');
	expect(capture).toHaveBeenCalledTimes(2);
	trackViToolCompleted('call', false, 'volume');
	trackViToolCompleted('call', false, 'volume');
	expect(capture).toHaveBeenCalledTimes(3);
	expect(capture).toHaveBeenLastCalledWith('vi_tool_completed', {
		vi_session_id: expect.any(String),
		tool: ToolType.UpdateUiSettings,
		success: false,
	});
});

it('clears pending events on cancellation and assigns a fresh ID on reconnect', () => {
	trackViSessionAttempted();
	const firstId = capture.mock.calls[0][1].vi_session_id;
	trackViSessionEnded();
	trackViSessionStarted();
	trackViSessionFailed('token');
	trackViRequestSubmitted('late-item', 'text');
	expect(capture).toHaveBeenCalledTimes(1);
	trackViSessionAttempted();
	const nextId = capture.mock.calls[1][1].vi_session_id;
	expect(nextId).not.toBe(firstId);
	trackViSessionStarted();
	trackViSessionStarted();
	trackViSessionFailed('webrtc');
	expect(capture).toHaveBeenCalledTimes(3);
});

it.each(['microphone', 'token', 'webrtc', 'session_setup'] as const)('records one setup failure at %s', (stage) => {
	trackViSessionAttempted();
	trackViSessionFailed(stage);
	trackViSessionFailed(stage);
	trackViSessionStarted();
	expect(capture).toHaveBeenCalledTimes(2);
	expect(capture).toHaveBeenLastCalledWith('vi_session_failed', { vi_session_id: expect.any(String), stage });
});

it('measures connected time, excludes setup time and emits only one end event', () => {
	const clock = vi.spyOn(performance, 'now');
	clock.mockReturnValue(1000);
	trackViSessionAttempted();
	clock.mockReturnValue(6000);
	trackViSessionStarted();
	const sessionId = capture.mock.calls[0][1].vi_session_id;
	clock.mockReturnValue(71000);
	trackViSessionEnded('connection_closed');
	trackViSessionEnded();
	expect(capture.mock.calls.filter(([event]) => event === 'vi_session_ended')).toEqual([
		['vi_session_ended', { vi_session_id: sessionId, duration_seconds: 65, reason: 'connection_closed' }],
	]);
});

it('does not emit an end event for a cancelled or failed connection attempt', () => {
	trackViSessionAttempted();
	trackViSessionEnded();
	trackViSessionAttempted();
	trackViSessionFailed('microphone');
	trackViSessionEnded();
	expect(capture.mock.calls.some(([event]) => event === 'vi_session_ended')).toBe(false);
});
