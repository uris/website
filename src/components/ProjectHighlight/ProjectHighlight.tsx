import { useTheme } from '@apple-pie/slice';
import Image, { type StaticImageData } from 'next/image';
import type React from 'react';
import { useMemo } from 'react';
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
		alt = 'Project highlight image',
		loading = 'eager',
		preload = true,
	} = props;

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
	]);

	return (
		<div className={styles.container} style={cssVars}>
			<div className={styles.textContainer}>{children}</div>
			<div className={styles.imageContainer}>
				<div className={styles.imageWrapper}>
					{resolvedImage && (
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
						/>
					)}
				</div>
			</div>
		</div>
	);
}
