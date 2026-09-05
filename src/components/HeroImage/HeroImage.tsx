import { useTheme, Video } from '@apple-pie/slice';
import Image from 'next/image';
import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { ThemedImage } from '@/projects/_types/types';
import { setStyle } from '@/utils/styles/styles';
import styles from './HeroImage.module.css';

interface HeroImageProps {
	backgroundColor?: string;
	imgBackgroundColor?: string;
	backgroundImage?: ThemedImage;
	backgroundFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
	heroImage?: ThemedImage;
	heroMaxWidth?: number;
	heroMargin?: number;
	heroOffset?: number;
	videoURL?: string;
	videoControls?: 'default' | 'simple' | 'custom' | 'none';
	videoMuted?: boolean;
	videoLoop?: boolean;
	videoPlaying?: boolean;
	dropShadow?: boolean;
	border?: boolean;
	heroAltText?: string;
	standAlone?: boolean;
	loading?: 'eager' | 'lazy';
	preload?: boolean;
}

export function HeroImage(props: Readonly<HeroImageProps>) {
	const { isDark } = useTheme();
	const {
		backgroundImage,
		backgroundColor = 'transparent',
		imgBackgroundColor = 'var(--core-surface-primary)',
		heroImage,
		heroMaxWidth = 1024,
		heroOffset = 112,
		heroMargin = 32,
		dropShadow = true,
		backgroundFit = 'cover',
		videoURL,
		videoControls = 'simple',
		videoLoop = false,
		videoMuted = true,
		videoPlaying = true,
		border = true,
		heroAltText,
		standAlone = false,
		loading = 'eager',
		preload = true,
	} = props;

	// state of video ready to play
	const [canPlay, setCanPlay] = useState(false);

	// memo css values based on props
	const cssVars = useMemo(() => {
		return {
			'--hero-background-color': backgroundColor,
			'--hero-container-padding': standAlone ? `0 ${setStyle(heroOffset)}` : setStyle(heroOffset),
			'--hero-container-margin': setStyle(heroMargin),
			'--hero-image-max-width': setStyle(heroMaxWidth),
			'--hero-drop-shadow': dropShadow ? 'var(--surface-shadow-soft)' : 'none',
			'--hero-border': border ? '1px' : '0',
			'--hero-image-background-color': imgBackgroundColor,
		} as React.CSSProperties;
	}, [heroMargin, heroMaxWidth, backgroundColor, heroOffset, border, dropShadow, standAlone, imgBackgroundColor]);

	// set can play when video ready to play (shows hero if not ready and there's a hero defined)
	const handleCanPlay = useCallback(() => {
		setCanPlay(true);
	}, []);

	// memo show hero state
	const showHero = useMemo(() => {
		if (videoURL) return heroImage && !canPlay;
		return !!heroImage;
	}, [canPlay, heroImage, videoURL]);

	// create unique key for light/dark hero image
	const heroKey = useMemo(() => {
		if (!heroImage) return 'hero-image-empty';
		return isDark ? heroImage.image.src : heroImage.imageLight.src;
	}, [heroImage, isDark]);

	// resolve the image to use based on theme
	const resolveHeroImage = useMemo(() => {
		if (!heroImage) return null;
		return isDark ? heroImage.image : heroImage.imageLight;
	}, [heroImage, isDark]);

	// create unique key for light/dark background image
	const backgroundKey = useMemo(() => {
		if (!heroImage) return 'hero-image-empty';
		return isDark ? heroImage.image.src : heroImage.imageLight.src;
	}, [heroImage, isDark]);

	return (
		<div className={styles.container} style={cssVars}>
			{backgroundImage && (
				<Image
					key={backgroundKey}
					quality={80}
					src={backgroundImage.image}
					fill={true}
					sizes={'100vw'}
					alt={''}
					loading={loading}
					preload={preload}
					className={styles.backgroundImage}
					style={{ objectFit: backgroundFit }}
				/>
			)}
			{videoURL && (
				<div className={styles.heroWrapper}>
					<Video
						src={videoURL}
						borderRadius={16}
						loop={videoLoop}
						muted={videoMuted}
						playing={videoPlaying}
						controls={videoControls}
						onCanPlay={handleCanPlay}
						volume={0.5}
					/>
				</div>
			)}
			{showHero && (
				<div className={styles.heroWrapper}>
					{resolveHeroImage && (
						<Image
							key={heroKey}
							quality={80}
							src={resolveHeroImage}
							width={resolveHeroImage.width}
							height={resolveHeroImage.height}
							sizes={'100vh'}
							alt={heroAltText ?? 'Hero Image'}
							loading={loading}
							className={styles.heroImage}
							preload={preload}
							placeholder={'blur'}
						/>
					)}
				</div>
			)}
		</div>
	);
}
