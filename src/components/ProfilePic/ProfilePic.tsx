import Image from 'next/image';
import type React from 'react';
import profilePic from '../../assets/profile-pic.png';
import styles from './ProfilePic.module.css';

export interface ProfilePicProps {
	bgColor?: string;
	size?: number;
	borderSize?: number;
	borderColor?: string;
}
export function ProfilePic(props: Readonly<ProfilePicProps>) {
	const {
		bgColor = 'var(--core-outline-primary)',
		size = 56,
		borderSize = 4,
		borderColor = 'var(--core-outline-primary)',
	} = props;

	const imageSize = Math.ceil(size - borderSize * 2);

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
				height={imageSize}
				width={imageSize}
				alt={'Uris Da Costa'}
				loading={'eager'}
			/>
		</div>
	);
}
