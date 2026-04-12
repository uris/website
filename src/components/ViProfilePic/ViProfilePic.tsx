'use client';

import Image from 'next/image';
import type React from 'react';
import { useMemo } from 'react';
import profilePic from '../../assets/vi-profile.png';
import styles from './ViProfilePic.module.css';

export interface ProfilePicProps {
	bgColor?: string;
	size?: number;
	borderSize?: number;
	borderColor?: string;
	avatarBorderSize?: number;
	avatarBorderColor?: string;
	avatarConnectedColor?: string;
	connected?: boolean;
}
export function ViProfilePic(props: Readonly<ProfilePicProps>) {
	const {
		bgColor = 'var(--core-outline-primary)',
		size = 36,
		borderSize = 0,
		borderColor = 'var(--core-surface-primary)',
		avatarBorderSize = 2,
		avatarBorderColor = 'var(--core-outline-primary)',
		avatarConnectedColor = 'var(--core-text-special)',
		connected = false,
	} = props;

	const cssVars = useMemo(() => {
		return {
			'--profile-pic-border-color': borderColor,
			'--profile-pic-border-size': `${borderSize}px`,
			'--profile-pic-avatar-border-color': connected ? avatarConnectedColor : avatarBorderColor,
			'--profile-pic-avatar-border-size': `${connected ? avatarBorderSize : 0}px`,
			'--profile-pic-bg-color': bgColor,
			'--profile-pic-size': `${size}px`,
		} as React.CSSProperties;
	}, [
		borderColor,
		borderSize,
		bgColor,
		size,
		avatarBorderColor,
		avatarBorderSize,
		connected,
		avatarConnectedColor,
	]);

	return (
		<div className={styles.profile} style={cssVars}>
			<div className={styles.border}>
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
		</div>
	);
}
