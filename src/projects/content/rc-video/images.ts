import heroBG from '@/assets/backgrounds/abstract-bubbles-03.png';
import placeholder from '@/assets/placeholders/image-placeholder@3x.png';
import placeholderLight from '@/assets/placeholders/image-placeholder-light@3x.png';
import charts from '@/assets/projects/rc-video/charts.png';
import covid from '@/assets/projects/rc-video/covid.png';
import hero from '@/assets/projects/rc-video/hero.png';
import type { ThemedProjectImages } from '@/projects/_types/types';

export const images = {
	heroBG,
	placeholder,
	placeholderLight,
};

export const themedImages: ThemedProjectImages = {
	heroBG: { image: heroBG, imageLight: heroBG },
	hero: { image: hero, imageLight: hero },
	placeholder: { image: placeholder, imageLight: placeholderLight },
	charts: { image: charts, imageLight: charts },
	covid: { image: covid, imageLight: covid },
};
