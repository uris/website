import type React from 'react';
import { useMemo } from 'react';
import styles from './SkillSlider.module.css';

interface SkillSliderProps {
	width?: number | string;
	height?: number;
	name?: string;
	value?: number;
	handleSize?: number;
	level?: string;
}

export const resolveStyle = (value: string | number) => {
	if (typeof value === 'string') return value;
	return `${value}px`;
};

export function SkillSlider(props: Readonly<SkillSliderProps>) {
	const { width = '100%', height = 2, name = 'Skill', value = 25, handleSize = 16, level = 'principal' } = props;

	const cssVars = useMemo(() => {
		return {
			'--width': resolveStyle(width),
			'--height': `${height}px`,
			'--handle-size': `${handleSize}px`,
			'--value': `${value}%`,
		} as React.CSSProperties;
	}, [width, height, handleSize, value]);

	return (
		<div className={styles.wrapper} style={cssVars}>
			<div className={styles.labels}>
				<div className={`${styles.name} body-s-regular`}>{name}</div>
				<div className={`${styles.value} body-s-regular`}>{level}</div>
			</div>
			<div className={styles.progress}>
				<div className={styles.track}>
					<div className={styles.level} />
				</div>
				<div className={styles.handle} />
			</div>
		</div>
	);
}
