import { expect, it } from 'vitest';

it('initializes the layout store from the browser-saved name', async () => {
	const original = localStorage.getItem('userName');
	try {
		localStorage.setItem('userName', 'Returning visitor');
		// This file has its own browser context and imports the store only after seeding storage.
		const { useHomeLayoutStore } = await import('@/stores/home-layout/homeLayoutStore');
		expect(useHomeLayoutStore.getState().userName).toBe('Returning visitor');
	} finally {
		if (original === null) localStorage.removeItem('userName');
		else localStorage.setItem('userName', original);
	}
});
