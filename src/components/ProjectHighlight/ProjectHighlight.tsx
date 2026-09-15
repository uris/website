import { type CustomVideoControls, useTheme, Video } from '@apple-pie/slice';
import Image, { type StaticImageData } from 'next/image';
import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { ThemedImage } from '@/projects/_types/types';
import { setStyle } from '@/utils/styles/styles';
import styles from './ProjectHighlight.module.css';

interface ProjectHighlightProps {
	children: React.ReactNode;
	maxContentWidth?: number;
	gap?: number;
	reverse?: boolean;
	imageHeight?: number;
	maxTextWidth?: number | string;
	alignItemsCenter?: boolean;
	marginBottom?: string | number | false;
	image?: StaticImageData;
	imageLight?: StaticImageData;
	themedImage?: ThemedImage;
	nomargin?: boolean;
	alt?: string;
	loading?: 'eager' | 'lazy';
	preload?: boolean;
	imageBackground?: string;
	noborder?: boolean;
	videoURL?: string;
	videoControls?: 'default' | 'simple' | 'custom' | 'none';
	videoMuted?: boolean;
	videoLoop?: boolean;
	videoPlaying?: boolean;
	customControls?: CustomVideoControls;
	padding?: number | string;
	coverUpTop?: number;
	coverUpLeft?: number;
	borderRadius?: number | string;
}

export function ProjectHighlight(props: Readonly<ProjectHighlightProps>) {
	const { isDark } = useTheme();
	const {
		children,
		maxContentWidth = 1024,
		gap = 64,
		reverse = false,
		imageHeight = 520,
		maxTextWidth = 250,
		alignItemsCenter = false,
		marginBottom = 88,
		image,
		imageLight,
		nomargin,
		themedImage,
		imageBackground = 'transparent',
		alt = 'Project highlight image',
		loading = 'eager',
		preload = true,
		noborder = false,
		videoURL,
		videoControls = 'simple',
		videoLoop = false,
		videoMuted = true,
		videoPlaying = true,
		customControls,
		padding = 0,
		coverUpTop,
		coverUpLeft,
		borderRadius = 16,
	} = props;

	// state of video ready to play
	const [canPlay, setCanPlay] = useState(false);

	// set can play when video ready to play (shows hero if not ready and there's a hero defined)
	const handleCanPlay = useCallback(() => {
		setCanPlay(true);
	}, []);

	// create the bottom margin
	const bottomMargin = useMemo(() => {
		if (nomargin) return '0px';
		if (marginBottom === undefined || marginBottom === false) return '0px';
		return setStyle(marginBottom);
	}, [marginBottom, nomargin]);

	// resolve image based on theme and provided image for light theme
	const resolvedImage = useMemo(() => {
		if (themedImage) {
			return isDark ? themedImage.image : themedImage.imageLight;
		}
		if (!imageLight) return image;
		return isDark ? image : imageLight;
	}, [image, imageLight, isDark, themedImage]);

	// create unique key for light/dark theme swaps
	const resolvedImageKey = useMemo(() => {
		if (!resolvedImage) return 'highlight-image-empty';
		if (typeof resolvedImage === 'string') return `${isDark ? 'dark' : 'light'}-${resolvedImage}`;
		return `${isDark ? 'dark' : 'light'}-${resolvedImage.src}`;
	}, [resolvedImage, isDark]);

	// resolve the image size
	const resolvedImageSize = useMemo(() => {
		if (!resolvedImage || !imageHeight) return { height: 0, width: 0 };
		const ratio = resolvedImage.width / resolvedImage.height;
		return { height: imageHeight, width: Math.round(imageHeight * ratio) }; // resolve to nearest full pixel
	}, [imageHeight, resolvedImage]);

	// memo show hero state
	const showHero = useMemo(() => {
		if (videoURL) return resolvedImage && !canPlay;
		return !!resolvedImage;
	}, [canPlay, resolvedImage, videoURL]);

	const cssVars = useMemo(() => {
		return {
			'--highlight-max-width': setStyle(maxContentWidth),
			'--highlight-max-text-width': setStyle(maxTextWidth),
			'--highlight-align-items': alignItemsCenter ? 'center' : 'flex-start',
			'--highlight-gap': setStyle(gap),
			'--highlight-row': reverse ? 'row-reverse' : 'row',
			'--highlight-image-width': setStyle(resolvedImageSize.width),
			'--highlight-image-height': setStyle(imageHeight),
			'--highlight-padding-top': alignItemsCenter ? '0' : '64px',
			'--highlight-margin-bottom': bottomMargin,
			'--highlight-image-background': imageBackground,
			'--highlight-border-size': noborder ? '0' : '1px',
			'--highlight-padding': setStyle(padding),
			'--cover-left': coverUpLeft ? setStyle(coverUpLeft) : 0,
			'--cover-top': coverUpTop ? setStyle(coverUpTop) : 0,
			'--highlight-border-radius': setStyle(borderRadius),
		} as React.CSSProperties;
	}, [
		maxContentWidth,
		gap,
		reverse,
		resolvedImageSize.width,
		imageHeight,
		maxTextWidth,
		alignItemsCenter,
		bottomMargin,
		imageBackground,
		noborder,
		padding,
		coverUpLeft,
		coverUpTop,
		borderRadius,
	]);

	return (
		<div className={styles.container} style={cssVars}>
			<div className={styles.textContainer}>{children}</div>
			<div className={styles.imageContainer}>
				<div className={styles.imageWrapper}>
					{showHero && resolvedImage && (
						<Image
							key={resolvedImageKey}
							quality={80}
							src={resolvedImage}
							width={resolvedImageSize.width}
							height={resolvedImageSize.height}
							sizes={'100vh'}
							alt={alt}
							loading={loading}
							className={styles.highlightImage}
							preload={preload}
							placeholder={'blur'}
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
								customControls={customControls}
								volume={0.5}
							/>
						</div>
					)}
					{coverUpLeft && <div className={styles.coverUpLeft} />}
					{coverUpTop && <div className={styles.coverUpTop} />}
				</div>
			</div>
		</div>
	);
}
