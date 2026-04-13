'use client';

import { Icon } from '@apple-pie/slice';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Logo } from '@/src/components/Logos/Logos';
import type { ProjectTileProps } from '@/src/components/ProjectTile/_types';
import { useDidAnimateProjects } from '@/stores/home-layout/homeLayoutStore';
import { classNames } from '@/utils/styles/styles';
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
		animate = { start: { y: 50 }, end: { y: 0 } },
		index = 0,
		onAnimationEnd,
		onClick,
	} = props;
	const [hasEntered, setHasEntered] = useState<boolean>(false);
	const [delay, setDelay] = useState<number>(stagger);
	const didAnimate = useDidAnimateProjects();
	const timer = useRef<NodeJS.Timeout | null>(null);

	// memo tile size - shouldn't really change, but just in case
	const resolvedSize = useMemo(() => {
		const tileWidth = width ?? 200;
		const tileHeight = height ?? 200;
		if (layout === 'wide') return { tileWidth: tileWidth * 2 + listGap, tileHeight };
		if (layout === 'long') return { tileWidth: tileWidth, tileHeight: tileHeight * 2 + listGap };
		return { tileWidth, tileHeight };
	}, [layout, width, height, listGap]);

	// resolve logo to the component of the next image
	const resolvedLogo = useMemo(() => {
		if (!logo) return null;
		if (typeof logo === 'string') {
			const imgSrc = `${logo}?v=001`;
			return <Image quality={100} src={imgSrc} alt={'title'} loading={'eager'} />;
		}
		const { type, props } = logo;
		if (type === 'icon') return <Icon {...props} />;
		if (type === 'logo') return <Logo {...props} />;
		return null;
	}, [logo]);

	// resolve logo to the component of the next image
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

	// determine the transforms
	const transform = useMemo(() => {
		let transforms = { y: 0, x: 0 };
		if ('y' in animate.start && 'y' in animate.end) {
			transforms = { ...transforms, y: didAnimate || hasEntered ? animate.end.y : animate.start.y };
		}
		if ('x' in animate.start && 'x' in animate.end) {
			transforms = { ...transforms, x: didAnimate || hasEntered ? animate.end.x : animate.start.x };
		}
		return transforms;
	}, [animate, hasEntered, didAnimate]);

	// memo dynamic css variables
	const cssVars = useMemo(() => {
		return {
			'--project-tile-width': `${resolvedSize.tileWidth}px`,
			'--project-tile-height': `${resolvedSize.tileHeight}px`,
			'--project-tile-title-color': titleColor,
			'--project-tile-type-color': typeColor,
			'--project-tile-translate-y': `${transform.y}px`,
			'--project-tile-translate-x': `${transform.x}px`,
			'--project-tile-opacity': didAnimate || hasEntered ? '1' : '0',
			'--project-tile-transition': `all 0.25s ease-in-out ${delay}s`,
		} as React.CSSProperties;
	}, [resolvedSize, titleColor, typeColor, delay, transform, hasEntered, didAnimate]);

	// memo styles
	const styleNames = useMemo(() => {
		const names: string[] = [styles.wrapper];
		if (layout === 'wide') names.push(styles.tileWide);
		if (layout === 'long') names.push(styles.tileLong);
		return names;
	}, [layout]);

	// emit transition end to parent if no flag yet
	const handleAnimationEnd = useCallback(() => {
		if (!didAnimate) onAnimationEnd?.(index);
	}, [index, didAnimate, onAnimationEnd]);

	// set up the initial transition if needed
	useEffect(() => {
		setHasEntered(true);
		timer.current = setTimeout(() => setDelay(0), stagger * 1000);
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [stagger]);

	return (
		<button
			type={'button'}
			className={classNames(styleNames)}
			style={cssVars}
			onTransitionEnd={handleAnimationEnd}
			onClick={onClick}
		>
			{logo && <div className={styles.logo}>{resolvedLogo}</div>}
			{type && <div className={styles.subtitle}>{type}</div>}
			{title && <div className={`${styles.title} ${heavy ? styles.heavy : ''}`}>{title}</div>}
			{image && <div className={styles.image}>{resolvedImage}</div>}
		</button>
	);
}
