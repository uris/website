import { FlexDiv } from '@apple-pie/slice';
import type React from 'react';
import styles from './Wrapper.module.css';

interface WrapperProps {
	children: React.ReactNode;
}
export function Wrapper(props: Readonly<WrapperProps>) {
	const { children } = props;
	return (
		<FlexDiv
			width={'fill'}
			height={'fill'}
			justify={'start'}
			align={'center'}
			direction={'column'}
			scrollY={true}
			background={'var(--core-surface-primary-tint)'}
			className={styles.wrapper}
		>
			<div className={styles.content}>{children}</div>
		</FlexDiv>
	);
}
