import heroBG from '@/assets/backgrounds/abstract-bubbles-02.png';
import performanceDark from '@/assets/projects/slice/component-performance-dark@3x.png';
import performanceLight from '@/assets/projects/slice/component-performance-light@3x.png';
import documentationDark from '@/assets/projects/slice/documentation-dark@3x.png';
import documentationLight from '@/assets/projects/slice/documentation-light@3x.png';
import importExample from '@/assets/projects/slice/import-code@3x.png';
import micHookDark from '@/assets/projects/slice/microphone-hook-dark@3x.png';
import micHookLight from '@/assets/projects/slice/microphone-hook-light@3x.png';
import promptDark from '@/assets/projects/slice/prompt-component-dark@3x.png';
import promptLight from '@/assets/projects/slice/prompt-component-light@3x.png';
import quickStartDark from '@/assets/projects/slice/quickstart-dark@3x.png';
import quickStartLight from '@/assets/projects/slice/quickstart-light@3x.png';
import exportsDark from '@/assets/projects/slice/slice-bundlephobia@3x.png';
import exportsLight from '@/assets/projects/slice/slice-bundlephobia-light@3x.png';
import themeColorsDark from '@/assets/projects/slice/theme-colors-dark@3x.png';
import themeColorsLight from '@/assets/projects/slice/theme-colors-light@3x.png';
import ssrDark from '@/assets/projects/slice/theme-server-dark@3x.png';
import ssrLight from '@/assets/projects/slice/theme-server-light@3x.png';
import videoDark from '@/assets/projects/slice/video-accessibility-dark@3x.png';
import videoLight from '@/assets/projects/slice/video-accessibility-light@3x.png';
import type { ThemedProjectImages } from '@/projects/_types/types';

export const themedImages: ThemedProjectImages = {
	heroBG: { image: heroBG, imageLight: heroBG },
	colors: { image: themeColorsDark, imageLight: themeColorsLight },
	video: { image: videoDark, imageLight: videoLight },
	prompt: { image: promptDark, imageLight: promptLight },
	import: { image: importExample, imageLight: importExample },
	documentation: { image: documentationDark, imageLight: documentationLight },
	performance: { image: performanceDark, imageLight: performanceLight },
	exports: { image: exportsDark, imageLight: exportsLight },
	ssr: { image: ssrDark, imageLight: ssrLight },
	micHook: { image: micHookDark, imageLight: micHookLight },
	quickStart: { image: quickStartDark, imageLight: quickStartLight },
};
