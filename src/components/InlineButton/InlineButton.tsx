import { Button } from '@apple-pie/slice';
import type React from 'react';

export type InlineButtonProps = {
	label?: string;
	children?: React.ReactNode;
	onClick?: () => void;
};

export function InlineButton(props: Readonly<InlineButtonProps>) {
	const { children, label = 'Button Label', onClick = () => null } = props;
	return (
		<Button
			iconLeft={'play circle'}
			variant={'text'}
			size={'small'}
			paddingLeft={0}
			paddingRight={0}
			iconColor={'var(--core-link-primary)'}
			labelColor={'var(--core-link-primary)'}
			underline
			onClick={onClick}
		>
			{children ?? label}
		</Button>
	);
}
