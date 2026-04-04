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
