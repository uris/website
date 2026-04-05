import { ToastType } from '@apple-pie/slice';
import type { Toast } from '@apple-pie/slice/stores';

export const micMuteNotification = (state: boolean) => {
	return {
		message: state ? 'Mic. muted' : 'Mic. unmuted',
		type: state ? ToastType.Warning : ToastType.Success,
		duration: 2000,
		position: 'top',
	} as Toast;
};

export const volumeMuteNotification = (state: boolean) => {
	return {
		message: state ? 'Sound muted' : 'Sound unmuted',
		type: state ? ToastType.Warning : ToastType.Success,
		duration: 2000,
		position: 'top',
	} as Toast;
};

export const micNotSupportedNotification = (message?: Error | string | null) => {
	const msg = message instanceof Error ? message.message : message;
	return {
		message: msg ?? 'Mic. access not available. Check your permission settings.',
		type: ToastType.Warning,
		duration: 4000,
		position: 'top',
	} as Toast;
};

export const micConnectNotification = (connected: boolean) => {
	return {
		message: connected ? 'Microphone connected' : 'Microphone disconnected',
		type: connected ? ToastType.Success : ToastType.Warning,
		duration: 4000,
		position: 'top',
	} as Toast;
};

export const viConnectionNotification = (
	state: 'Connecting' | 'Connected' | 'Disconnecting' | 'Disconnected',
) => {
	const messageMap = {
		Connecting: 'Connecting to Vi ...',
		Connected: 'Connected to Vi',
		Disconnecting: 'Disconnecting from Vi ...',
		Disconnected: 'Disconnected from Vi',
	};
	const typeMap = {
		Connecting: ToastType.Info,
		Connected: ToastType.Success,
		Disconnecting: ToastType.Info,
		Disconnected: ToastType.Warning,
	};
	const durationMap = {
		Connecting: 'Infinite',
		Connected: 2000,
		Disconnecting: 'Infinite',
		Disconnected: 2000,
	};
	return {
		message: messageMap[state],
		type: typeMap[state],
		duration: durationMap[state],
		position: 'top',
	} as Toast;
};
