import { Toast } from '@apple-pie/slice';
import { ThemeProvider } from '@apple-pie/slice/providers/ThemeProvider';
import { useToast, useToastStore } from '@apple-pie/slice/stores';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { cleanup, render } from 'vitest-browser-react';
import { Contact } from '@/src/surfaces/contact/contact';
import { ContactFooter } from '@/src/surfaces/contact/contact-footer';
import { contactForm } from '@/stores/contact/_types';
import { useContactStore } from '@/stores/contact/contactStore';
import { SidebarSurface } from '@/stores/sidebar/_types';
import { useSidebarContentStore } from '@/stores/sidebar/sidebarStore';

const fetchMock = vi.fn<typeof fetch>();
const email = () => page.getByRole('textbox', { name: 'from-email' });
const message = () => page.getByPlaceholder('Something on your mind? Drop me a note ...');
const send = () => page.getByRole('button', { name: 'Send', exact: true });
const clear = () => page.getByRole('button', { name: 'Clear', exact: true });

function ContactView() {
	const toast = useToast();
	return (
		<ThemeProvider initialTheme="lightMode" initialSystem={false}>
			<div style={{ position: 'relative', height: 600 }}>
				<Contact />
				<ContactFooter />
			</div>
			<Toast {...toast} />
		</ThemeProvider>
	);
}

function resetStores() {
	useContactStore.setState({ ...useContactStore.getInitialState(), formValues: new Map(), errors: [] }, true);
	useSidebarContentStore.setState(
		{ ...useSidebarContentStore.getInitialState(), surface: SidebarSurface.Contact },
		true,
	);
	useToastStore.setState(useToastStore.getInitialState(), true);
}
beforeEach(() => {
	resetStores();
	fetchMock.mockReset();
	fetchMock.mockRejectedValue(new Error('Unexpected request in contact test'));
	vi.stubGlobal('fetch', fetchMock);
});
afterEach(async () => {
	await cleanup();
	vi.unstubAllGlobals();
	resetStores();
});
async function mount() {
	await render(<ContactView />);
	// Wait for the form's own delayed autofocus before interacting.
	await expect.element(message()).toHaveFocus();
}
async function fillValid() {
	await email().fill('person@example.com');
	await message().fill('Hello from the browser');
	await expect.element(send()).toBeEnabled();
}

describe('contact form', () => {
	it('requires both fields and displays validation after blur', async () => {
		await mount();
		await expect.element(send()).toBeDisabled();
		await email().fill('invalid');
		await expect.element(page.getByText(contactForm.from.errorMessage)).not.toBeInTheDocument();
		await message().click();
		await expect.element(page.getByText(contactForm.from.errorMessage)).toBeVisible();
		await message().fill('abc');
		await email().click();
		await expect.element(page.getByText(contactForm.text.errorMessage)).toBeVisible();
		await email().fill('person@example.com');
		await expect.element(send()).toBeDisabled();
		await message().fill('abcd');
		await expect.element(send()).toBeEnabled();
		await expect.element(page.getByText(contactForm.from.errorMessage)).not.toBeInTheDocument();
		await expect.element(page.getByText(contactForm.text.errorMessage)).not.toBeInTheDocument();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('clears a draft and returns to an invalid empty form', async () => {
		await mount();
		await fillValid();
		await clear().click();
		await expect.element(email()).toHaveValue('');
		await expect.element(message()).toHaveValue('');
		await expect.element(send()).toBeDisabled();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('disables editing while pending and shows success only after the server confirms', async () => {
		const deferred = Promise.withResolvers<Response>();
		fetchMock.mockReturnValue(deferred.promise);
		await mount();
		await fillValid();
		await send().click();
		try {
			await expect.element(email()).toBeDisabled();
			await expect.element(message()).toBeDisabled();
			await expect.element(clear()).toBeDisabled();
			await expect.element(send()).toBeDisabled();
			await expect.element(page.getByText('Message sent', { exact: true })).not.toBeInTheDocument();
			expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/server/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ from: 'person@example.com', text: 'Hello from the browser' }),
			});
		} finally {
			deferred.resolve(Response.json({ success: true, status: 200 }));
		}
		await expect.element(page.getByText('Message sent', { exact: true })).toBeVisible();
		await expect.element(email()).toBeEnabled();
		await expect.element(email()).toHaveValue('');
		await expect.element(message()).toHaveValue('');
		await expect.element(send()).toBeDisabled();
	});
	it('preserves the draft on failure, displays feedback, and allows retry', async () => {
		fetchMock.mockResolvedValueOnce(Response.json({ success: false, message: 'Unavailable' }, { status: 503 }));
		await mount();
		await fillValid();
		await send().click();
		await expect.element(page.getByText('Unable to send your message. Please try again later.')).toBeVisible();
		await expect.element(email()).toHaveValue('person@example.com');
		await expect.element(message()).toHaveValue('Hello from the browser');
		await expect.element(send()).toBeEnabled();
		fetchMock.mockResolvedValueOnce(Response.json({ success: true }));
		await send().click();
		await expect.element(page.getByText('Message sent', { exact: true })).toBeVisible();
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});
