import heroBG from '@/assets/backgrounds/macos-bigsur@3x.jpg';
import adaptive from '@/assets/projects/rc-phone/adaptive@3x.png';
import effortless from '@/assets/projects/rc-phone/effortless@4x.png';
import modern from '@/assets/projects/rc-phone/modern@4x.png';
import old from '@/assets/projects/rc-phone/old@3x.png';
import portable from '@/assets/projects/rc-phone/portable@4x.png';
import type { ThemedProjectImages } from '@/projects/_types/types';

export const images = {
	heroBG,
	old,
};

export const themedImages: ThemedProjectImages = {
	heroBG: { image: heroBG, imageLight: heroBG },
	old: { image: old, imageLight: old },
	adaptive: { image: adaptive, imageLight: adaptive },
	effortless: { image: effortless, imageLight: effortless },
	portable: { image: portable, imageLight: portable },
	modern: { image: modern, imageLight: modern },
};
