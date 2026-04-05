import { DropDown } from '@apple-pie/slice';

interface MarkdownSelectProps {
	options?: unknown;
}

// plugin can send options as string or arrray of strings
function normalizeOptions(options: unknown): string[] {
	// if already and array ensure items are strings
	if (Array.isArray(options)) {
		return options.filter((option): option is string => typeof option === 'string');
	}

	// parse string (string will come in the form of JSON)
	if (typeof options === 'string') {
		try {
			const parsed = JSON.parse(options);
			if (Array.isArray(parsed)) {
				return parsed.filter((option): option is string => typeof option === 'string');
			}
		} catch {}

		return options
			.split(/\n|\$\$|,/g)
			.map((option) => option.trim())
			.filter(Boolean);
	}

	// return empty
	return [];
}

export function MarkdownSelect(props: Readonly<MarkdownSelectProps>) {
	const normalizedOptions = normalizeOptions(props.options);

	// map options into dropdown options ready for slice dropdown
	const dropDownOptions = normalizedOptions.map((option) => ({ label: option, value: option }));

	// guard for actual options
	if (dropDownOptions.length === 0) return null;

	return (
		<DropDown
			placeholder={false}
			inline
			width={'auto'}
			selectedIndex={0}
			options={dropDownOptions}
			paddingBottom={2}
			paddingTop={2}
			size={'l'}
			iconColor={'var(--core-link-primary)'}
		/>
	);
}
