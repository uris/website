import type { ErrorMessage } from '@apple-pie/slice';

export type ContactStore = {
	formValues: Map<string, FormEntry>;
	errors: ErrorMessage[];
	sending: boolean;
	actions: {
		clear: () => void;
		send: () => Promise<void>;
		setFormValue: (fieldName: string, entry: FormEntryInput) => void;
		setFieldInitialized: (fieldName: string) => void;
		setSending: (sending: boolean) => void;
	};
};

/**
 * Form entry
 */
export type FormEntry = {
	value: string;
	initialized: boolean;
	isValid: boolean;
	validationType: ValidationType;
};

/**
 * Submitted values for form entries
 */
export type FormEntryInput = Pick<FormEntry, 'value' | 'validationType'>;

/**
 * Validation types for form entries
 */
export enum ValidationType {
	email = 'email',
	text = 'text',
	none = 'none',
}

/**
 * Contact form setup
 */
export const contactForm = {
	from: { ValidationType: ValidationType.email, errorMessage: "I'll need a valid email to get back to you." },
	text: {
		ValidationType: ValidationType.text,
		errorMessage: 'Please provide a little more information about your inquiry',
	},
};
