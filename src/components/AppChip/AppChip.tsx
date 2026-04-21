import { Chip } from '@apple-pie/slice';

interface AppChipProps {
	icon?: string;
	name?: string;
}

export function AppChip(props: Readonly<AppChipProps>) {
	const { icon, name } = props;
	return (
		<Chip
			label={name}
			icon={icon}
			labelSize={'s'}
			paddingSides={10}
			paddingTops={6}
			borderSize={1}
			color={'var(--core-text-secondary)'}
			borderColor={'var(--core-outline-secondary)'}
			bgColor={'var(--core-surface-primary)'}
			variant={'normal'}
		/>
	);
}
