import type { ErrorMessage } from '@apple-pie/slice';
import { useToastStore } from '@apple-pie/slice/stores';
import { create } from 'zustand';
import { messageSent } from '@/content/notifications/notifications';
import { isContactMessage, isValidContactEmail, isValidContactText } from '@/src/lib/contact-validation';
import {
	type ContactStore,
	contactForm,
	type FormEntry,
	type FormEntryInput,
	ValidationType,
} from '@/stores/contact/_types';

export const useContactStore = create<ContactStore>()((set, get) => ({
	formValues: new Map<string, FormEntry>(),
	errors: [],
	sending: false,
	actions: {
		clear: () => {
			set({ formValues: new Map(), errors: [] });
		},
		send: async () => {
			if (get().sending) return;
			const message = createMessage(get().formValues);
			if (!isContactMessage(message)) return;
			try {
				set({ sending: true });
				await sendEmailMessage(message);
				get().actions.clear();
				useToastStore.getState().actions.push(messageSent(true));
			} catch {
				useToastStore.getState().actions.push(messageSent(false));
			} finally {
				set({ sending: false });
			}
		},
		setFormValue: (fieldName: string, entry: FormEntryInput) => {
			const formValues = new Map(get().formValues);
			const isValid = entryIsValid(entry.value, entry.validationType);
			const initialized = formValues.get(fieldName)?.initialized ?? false;
			const updatedEntry: FormEntry = {
				initialized,
				isValid,
				validationType: entry.validationType,
				value: entry.value,
			};
			formValues.set(fieldName, updatedEntry);
			const errors = createErrorEntries(formValues);
			set({ formValues, errors });
		},
		setFieldInitialized: (fieldName: string) => {
			const formValues = new Map(get().formValues);
			const entry = formValues.get(fieldName);
			if (!entry) return;
			formValues.set(fieldName, { ...entry, initialized: true });
			const errors = createErrorEntries(formValues);
			set({ formValues, errors });
		},
		setSending: (sending: boolean) => {
			set({ sending });
		},
	},
}));

export const useFormErrors = () => useContactStore((state) => state.errors);
export const useSending = () => useContactStore((state) => state.sending);
export const useContact = () => useContactStore((state) => state.actions);
export const useFormValue = (fieldName: string) =>
	useContactStore((state) => {
		const entry = state.formValues.get(fieldName);
		return entry?.value ?? '';
	});

/**
 * Hook that checks if the form can be submitted
 * Note: this is different to errors
 */
export const useFormIsValid = () =>
	useContactStore((state) => {
		const formValues = state.formValues;
		const fields = Object.keys(contactForm);
		for (const field of fields) {
			const entry = formValues.get(field);
			if (!entry) return false;
			if (!entry.isValid) return false;
		}
		return true;
	});

/**
 * Helper to send the mail message
 */
async function sendEmailMessage(message: { from: string; text: string }) {
	const response = await fetch('/server/contact', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(message),
	});
	const data = await response.json();
	if (response.ok && data?.success === true) return data;
	throw new Error('Unable to send message');
}

/**
 * Super simple validation based on type
 */
function entryIsValid(value: string, validationType: ValidationType) {
	switch (validationType) {
		case ValidationType.email: {
			return isValidContactEmail(value);
		}
		case ValidationType.text: {
			return isValidContactText(value);
		}
		default:
			return true;
	}
}

/**
 * Create an email body from form values
 */
function createMessage(formValues: Map<string, FormEntry>) {
	const from = formValues.get('from')?.value ?? '';
	const text = formValues.get('text')?.value ?? '';
	return { from, text };
}

/**
 * Create the error array
 */
function createErrorEntries(formValues: Map<string, FormEntry>) {
	const entries = Array.from(formValues.entries());
	const errors: ErrorMessage[] = [];
	for (const [key, entry] of entries) {
		if (!entry.initialized) continue;
		const entryKey = key as keyof typeof contactForm;
		if (!entry.isValid && entry.value !== '') errors.push({ title: contactForm[entryKey].errorMessage ?? '' });
	}
	return errors;
}
