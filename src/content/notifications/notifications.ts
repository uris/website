import { ToastType } from '@apple-pie/slice';
import type { Toast } from '@apple-pie/slice/stores';

export const micMuteNotification = (state: boolean) => {
	return {
		notifId: crypto.randomUUID(),
		message: state ? 'Mic. muted' : 'Mic. unmuted',
		type: state ? ToastType.Warning : ToastType.Success,
		duration: 2000,
		position: 'top',
	} as Toast;
};

export const volumeMuteNotification = (state: boolean) => {
	return {
		notifId: crypto.randomUUID(),
		message: state ? 'Sound muted' : 'Sound unmuted',
		type: state ? ToastType.Warning : ToastType.Success,
		duration: 2000,
		position: 'top',
	} as Toast;
};

export const micNotSupportedNotification = (message?: Error | string | null) => {
	const msg = message instanceof Error ? message.message : message;
	return {
		notifId: crypto.randomUUID(),
		message: msg ?? 'Mic. access not available. Check your permission settings.',
		type: ToastType.Warning,
		duration: 4000,
		position: 'top',
	} as Toast;
};

export const micConnectNotification = (connected: boolean) => {
	return {
		notifId: crypto.randomUUID(),
		message: connected ? 'Microphone connected' : 'Microphone disconnected',
		type: connected ? ToastType.Success : ToastType.Warning,
		duration: 4000,
		position: 'top',
	} as Toast;
};

export function viConnectionNotification(
	state: 'Connecting' | 'Connected' | 'Disconnecting' | 'Disconnected' | 'Already' | 'Failed',
) {
	const messageMap = {
		Connecting: 'Connecting to Vi ...',
		Connected: 'Connected to Vi',
		Disconnecting: 'Disconnecting from Vi ...',
		Disconnected: 'Disconnected from Vi',
		Already: 'Already connected to Vi',
		Failed: 'Failed to connect to Vi',
	};
	const typeMap = {
		Connecting: ToastType.Info,
		Connected: ToastType.Success,
		Disconnecting: ToastType.Info,
		Disconnected: ToastType.Warning,
		Already: ToastType.Info,
		Failed: ToastType.Error,
	};
	const durationMap = {
		Connecting: 'Infinite',
		Connected: 2000,
		Disconnecting: 'Infinite',
		Disconnected: 2000,
		Already: 2000,
		Failed: 4000,
	};
	return {
		notifId: crypto.randomUUID(),
		message: messageMap[state],
		type: typeMap[state],
		duration: durationMap[state],
		position: 'top',
	} as Toast;
}

export const copyToClipboardNotification = (success?: boolean) => {
	return {
		notifId: crypto.randomUUID(),
		message: success ? 'Copied to clipboard' : 'Unable to copy to clipboard',
		type: success ? ToastType.Success : ToastType.Warning,
		duration: 2500,
		position: 'top',
	} as Toast;
};
