import { Icon } from '@apple-pie/slice';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ProjectTileProps } from '@/src/components/ProjectTile/_types';
import styles from './ProjectTile.module.css';

export function ProjectTile(props: Readonly<ProjectTileProps>) {
	const {
		width,
		height,
		title,
		type,
		logo,
		image,
		heavy = false,
		titleColor = 'var(--core-text-primary)',
		typeColor = 'rgba(0,0,0,0.3)',
		layout = 'square',
		listGap = 24,
		stagger = 0.1,
	} = props;
	const [hasEntered, setHasEntered] = useState<boolean>(false);
	const [delay, setDelay] = useState<number>(stagger);
	const timer = useRef<NodeJS.Timeout | null>(null);

	const resolvedSize = useMemo(() => {
		const tileWidth = width ?? 200;
		const tileHeight = height ?? 200;
		if (layout === 'wide') return { tileWidth: tileWidth * 2 + listGap, tileHeight };
		if (layout === 'long') return { tileWidth: tileWidth, tileHeight: tileHeight * 2 + listGap };
		return { tileWidth, tileHeight };
	}, [layout, width, height, listGap]);

	const resolvedLogo = useMemo(() => {
		if (!logo) return null;
		if (typeof logo === 'string') {
			const imgSrc = `${logo}?v=001`;
			return <Image quality={100} src={imgSrc} alt={'title'} loading={'eager'} />;
		}
		if (React.isValidElement(logo)) return logo;
		if (typeof logo === 'object') return <Icon {...(logo as any)} />;
		return null;
	}, [logo]);

	const resolvedImage = useMemo(() => {
		if (!image) return null;
		if (typeof image === 'string') {
			const imgSrc = `${image}?v=007`;
			return (
				<Image
					quality={100}
					src={imgSrc}
					width={0}
					height={0}
					sizes="100vw"
					alt={'title'}
					loading={'eager'}
					style={{ width: '100%', height: 'auto' }}
				/>
			);
		}
		if (React.isValidElement(image)) return image;
		return null;
	}, [image]);

	const cssVars = useMemo(() => {
		return {
			'--project-tile-width': `${resolvedSize.tileWidth}px`,
			'--project-tile-height': `${resolvedSize.tileHeight}px`,
			'--project-tile-title-color': titleColor,
			'--project-tile-type-color': typeColor,
			'--project-tile-translate-y': hasEntered ? '0' : '50px',
			'--project-tile-transition': `all 0.25s ease-in-out ${delay}s`,
		} as React.CSSProperties;
	}, [resolvedSize, titleColor, typeColor, hasEntered, delay]);

	const classNames = useMemo(() => {
		let layoutName = '';
		if (layout === 'wide') layoutName = ` ${styles.tileWide}`;
		if (layout === 'long') layoutName = ` ${styles.tileLong}`;
		return `${styles.wrapper}${layoutName}`;
	}, [layout]);

	// signal can perform enter transition
	useEffect(() => {
		setHasEntered(true);
		timer.current = setTimeout(() => setDelay(0), stagger * 1000);
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [stagger]);

	return (
		<div className={classNames} style={cssVars}>
			{logo && <div className={styles.logo}>{resolvedLogo}</div>}
			{type && <div className={styles.subtitle}>{type}</div>}
			{title && <div className={`${styles.title} ${heavy ? styles.heavy : ''}`}>{title}</div>}
			{image && <div className={styles.image}>{resolvedImage}</div>}
		</div>
	);
}
