'use client';

import { IconButton, Pager, useObserveResize, useTheme } from '@apple-pie/slice';
import type { Transition } from 'motion';
import { AnimatePresence, motion } from 'motion/react';
import Image, { type StaticImageData } from 'next/image';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Direction } from '@/stores/sidebar/_types';
import { classNames, hardGradientCover } from '@/utils/styles/styles';
import styles from './ProjectImage.module.css';

interface ProjectImageProps {
	children?: React.ReactNode;
	paddingTops?: number;
	paddingSides?: number;
	maxImageHeight?: number;
}

function ProjectImage(props: Readonly<ProjectImageProps>) {
	const { children, paddingTops = 56, paddingSides = 64, maxImageHeight } = props;
	const [pages, setPages] = useState<number>();
	const [selected, setSelected] = useState<number>(0);
	const [height, setHeight] = useState<number>(maxImageHeight ?? 0);
	const [direction, setDirection] = useState<Direction>(Direction.Forward);
	const ref = useRef<HTMLDivElement>(null);
	const { width } = useObserveResize(ref, { ignore: 'height' });

	// memo elements
	const elements = useMemo(() => {
		const items = [];
		for (const child of React.Children.toArray(children)) {
			if (React.isValidElement(child)) {
				items.push(child as React.ReactElement<ImageItemProps>);
			}
		}
		setPages(items.length);
		return items;
	}, [children]);

	const handleHeightChange = useCallback((newHeight: number) => {
		setHeight((prev) => (prev === newHeight ? prev : newHeight));
	}, []);

	// render image element to show
	const renderElement = useCallback(() => {
		if (!elements?.[selected]) return null;
		const element = elements[selected];
		return React.cloneElement(element, {
			...element.props,
			maxImageHeight,
			onHeightChange: handleHeightChange,
		});
	}, [maxImageHeight, elements, selected, handleHeightChange]);

	// variants with a custom direction to animate left/right
	const variants = {
		enter: (direction: Direction) => {
			return { x: direction > 0 ? width : -width, opacity: 0 };
		},
		center: { zIndex: 1, x: 0, opacity: 1 },
		exit: (direction: Direction) => {
			return { zIndex: 0, x: direction < 0 ? width : -width, opacity: 0 };
		},
	};

	const transition: Transition = { duration: 0.35, ease: 'easeInOut' };

	// handle page change
	const handlePageChange = useCallback(
		(index: number) => {
			let direction: Direction;
			if (index === selected) return;
			if (index > elements.length - 1) {
				index = 0;
				direction = Direction.Forward;
			} else if (index < 0) {
				index = elements.length - 1;
				direction = Direction.Backward;
			} else {
				direction = index > selected ? Direction.Forward : Direction.Backward;
			}
			setDirection(direction);
			setSelected(index);
		},
		[selected, elements.length],
	);

	// gradient cover
	const cssVars = useMemo(() => {
		return {
			'--padding-tops': `${paddingTops}px`,
			'--padding-sides': `${paddingSides}px`,
			'--padding-bottom': `${paddingTops + 24}px`,
		} as React.CSSProperties;
	}, [paddingSides, paddingTops]);

	return (
		<div
			className={styles.wrapper}
			style={{ ...cssVars, height, minHeight: maxImageHeight }}
			ref={ref}
		>
			<AnimatePresence initial={false} custom={direction}>
				<motion.div
					variants={variants}
					initial={'enter'}
					animate={'center'}
					exit={'exit'}
					transition={transition}
					custom={direction}
					style={{
						position: 'absolute',
						top: 0,
						height,
						minHeight: maxImageHeight,
						overflow: 'hidden',
					}}
					key={`imageElement_${selected}`}
				>
					{renderElement()}
				</motion.div>
			</AnimatePresence>
			<div className={styles.pagerWrapper}>
				<IconButton
					bgColor={'none'}
					bgColorHover={'var(--core-surface-primary)'}
					icon={'arrow left'}
					onClick={() => handlePageChange(selected - 1)}
				/>
				<Pager
					pages={pages}
					size={6}
					index={selected}
					color={'var(--core-outline-primary)'}
					colorOn={'var(--core-text-primary)'}
					onChange={handlePageChange}
					gap={8}
				/>
				<IconButton
					bgColor={'none'}
					bgColorHover={'var(--core-surface-primary)'}
					icon={'arrow right'}
					onClick={() => handlePageChange(selected + 1)}
				/>
			</div>
		</div>
	);
}

export default ProjectImage;

interface ImageItemProps {
	children?: React.ReactNode;
	title?: string;
	image?: string | StaticImageData;
	imageLight?: string | StaticImageData;
	imagePos?: 'left' | 'right';
	borderRadius?: number;
	coverUp?: boolean;
	maxImageHeight?: number;
	onHeightChange?: (height: number) => void;
}
export function ImageItem(props: Readonly<ImageItemProps>) {
	const {
		imagePos = 'right',
		title,
		children,
		image,
		imageLight,
		onHeightChange,
		coverUp = true,
		maxImageHeight,
		borderRadius = 16,
	} = props;
	const ref = useRef<HTMLDivElement>(null);
	const { height } = useObserveResize(ref);
	const lastReportedHeight = useRef<number>(0);
	const { current, isDark } = useTheme();
	const surfaceColor = current.colors['core-surface-primary-tint'];

	// wrapper class names
	const frameClasses = useMemo(() => {
		const names = [styles.contentFrame];
		if (imagePos === 'left') names.push(styles.frameReverse);
		return names;
	}, [imagePos]);

	// image class names
	const imageClasses = useMemo(() => {
		const names = [styles.imageContent];
		if (imagePos === 'left') names.push(styles.imageReverse);
		return names;
	}, [imagePos]);

	// memo dynamic CSS
	const cssVars = useMemo(() => {
		return {
			'--frame-min-height': maxImageHeight ? `${maxImageHeight}px` : 'auto',
			'--image-border-radius': `${borderRadius}px`,
			'--gradient-cover': hardGradientCover(surfaceColor, 'top'),
		} as React.CSSProperties;
	}, [borderRadius, maxImageHeight, surfaceColor]);

	// report height once after mount
	useLayoutEffect(() => {
		if (height <= 0) return;
		if (height !== lastReportedHeight.current) onHeightChange?.(height);
		lastReportedHeight.current = height;
	}, [onHeightChange, height]);

	return (
		<div className={classNames(frameClasses)} ref={ref} style={cssVars}>
			<div className={styles.block}>
				<div className={styles.textContent}>
					<h3>{title}</h3>
					{children}
				</div>
			</div>
			<div className={`${styles.block} ${styles.blockImage}`}>
				<div className={classNames(imageClasses)}>
					{image && (
						<Image
							quality={80}
							src={isDark ? image : (imageLight ?? image)}
							width={0}
							height={0}
							sizes="100vw"
							alt={title ?? 'Image'}
							loading={'eager'}
							className={styles.image}
						/>
					)}
				</div>
			</div>
			{coverUp && <div className={styles.coverUp} />}
		</div>
	);
}
