import { FlexDiv, Preset } from '@apple-pie/slice';
import type React from 'react';

interface WrapperProps {
	children: React.ReactNode;
}
export function Wrapper(props: Readonly<WrapperProps>) {
	const { children } = props;
	return (
		<FlexDiv
			preset={Preset.Window}
			justify={'start'}
			align={'start'}
			scrollY={true}
			padding={'64px 64px 104px 64px'}
			background={'var(--core-surface-primary-tint)'}
		>
			{children}
		</FlexDiv>
	);
}
