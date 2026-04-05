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

	const cssVars = {
		'--profile-pic-border-color': borderColor,
		'--profile-pic-border-size': `${borderSize}px`,
		'--profile-pic-bg-color': bgColor,
		'--profile-pic-size': `${size}px`,
		'--profile-pic-padding-top': `${borderSize * 3}px`,
	} as React.CSSProperties;

	return (
		<div className={styles.profile} style={cssVars}>
			<Image src={profilePic} fill alt={'Uris Da Costa'} />
		</div>
	);
}
