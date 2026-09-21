import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { MarkdownSelect } from '@/components/MarkdownSelect/MarkdownSelect';

describe('MarkdownSelect', () => {
	it.each([
		['array', ['Design', 42, null, 'Development']],
		['JSON', '["Design",42,null,"Development"]'],
		['delimited text', ' Design , Development\nResearch$$Strategy '],
	])('renders usable options from %s and allows selection', async (_label, options) => {
		await render(<MarkdownSelect options={options} />);
		const select = page.getByRole('combobox');
		await expect.element(select).toBeVisible();
		await expect.element(select).toHaveValue('0');
		await expect.element(page.getByRole('option', { name: '42' })).not.toBeInTheDocument();
		await select.selectOptions(page.getByRole('option', { name: 'Development' }));
		await expect.element(select).toHaveValue('1');
	});

	it.each([undefined, null, [], [1, null], ''])(
		'hides the dropdown when no usable options exist: %j',
		async (options) => {
			await render(<MarkdownSelect options={options} />);
			await expect.element(page.getByRole('combobox')).not.toBeInTheDocument();
		},
	);
});
