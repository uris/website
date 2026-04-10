import Image from 'next/image';
import type React from 'react';
import profilePic from '../../assets/vi-profile.png';
import styles from './ViProfilePic.module.css';

export interface ProfilePicProps {
	bgColor?: string;
	size?: number;
	borderSize?: number;
	borderColor?: string;
}
export function ViProfilePic(props: Readonly<ProfilePicProps>) {
	const {
		bgColor = 'var(--core-outline-primary)',
		size = 48,
		borderSize = 8,
		borderColor = 'var(--core-surface-primary)',
	} = props;

	const cssVars = {
		'--profile-pic-border-color': borderColor,
		'--profile-pic-border-size': `${borderSize}px`,
		'--profile-pic-bg-color': bgColor,
		'--profile-pic-size': `${size}px`,
	} as React.CSSProperties;

	return (
		<div className={styles.profile} style={cssVars}>
			<Image
				quality={100}
				src={profilePic}
				width={0}
				height={0}
				sizes="100vw"
				alt={'Vi Profile Picture'}
				loading={'eager'}
				style={{ width: '100%', height: 'auto' }}
			/>
		</div>
	);
}
