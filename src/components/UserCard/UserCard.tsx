import { Button } from '@apple-pie/slice';
import Image from 'next/image';
import type React from 'react';
import { useMemo } from 'react';
import type { UserCardProps, UserGridProps } from '@/components/UserCard/_types';
import { setStyle } from '@/utils/styles/styles';
import styles from './UserCard.module.css';

export function UserCard(props: Readonly<UserCardProps>) {
	const { photo, name, role, company, quote, videoLabel, width = 250, height = 350, showVideo = true } = props;

	const cssVars = useMemo(() => {
		return {
			'--card-height': setStyle(height),
			'--card-width': setStyle(width),
			'--info-justify-content': showVideo ? 'flex-start' : 'space-between',
		} as React.CSSProperties;
	}, [height, width, showVideo]);

	return (
		<div className={styles.wrapper} style={cssVars}>
			<div className={styles.info}>
				<div className={styles.profile}>
					{photo && (
						<Image
							quality={80}
							src={photo}
							width={54}
							height={54}
							sizes={'54px'}
							alt={`${videoLabel}`}
							loading={'lazy'}
							style={{ border: '2px solid var(--core-outline-secondary)', borderRadius: '100%' }}
						/>
					)}
					<div className={styles.bio}>
						<span className={styles.name}>{name}</span>
						<span className={styles.role}>{role}</span>
						<span className={styles.company}>{company}</span>
					</div>
				</div>
				<p style={{ color: 'var(--core-text-primary)' }}>{quote}</p>
			</div>
			{showVideo && (
				<Button label={videoLabel} iconRight={'play circle'} width={'100%'} size={'large'} variant={'solid'} />
			)}
		</div>
	);
}

export function UserGrid(props: Readonly<UserGridProps>) {
	const {
		gap = 24,
		cards = [],
		maxCards = 3,
		cardWidth = 250,
		cardHeight = 350,
		showVideo = true,
		margin = true,
		marginSize = 64,
	} = props;

	const cssVars = useMemo(() => {
		return {
			'--grid-gap': setStyle(gap),
			'--grid-max-tiles': maxCards,
			'--card-width': setStyle(cardWidth),
			'--grid-margin': margin ? setStyle(marginSize) : '0',
		} as React.CSSProperties;
	}, [gap, maxCards, cardWidth, margin, marginSize]);

	return (
		<div className={styles.grid} style={cssVars}>
			{cards.map((card) => (
				<UserCard
					key={`${card.role}_${card.name}`}
					{...card}
					width={cardWidth}
					height={cardHeight}
					showVideo={showVideo}
				/>
			))}
		</div>
	);
}
