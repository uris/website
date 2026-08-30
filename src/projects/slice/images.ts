import cameraDemo from '@/assets//projects/slice/slice-camera-demo.png';
import cameraDemoLight from '@/assets//projects/slice/slice-camera-demo-light.png';
import bundle from '@/assets/projects/slice/slice-bundlephobia@3x.png';
import bundleLight from '@/assets/projects/slice/slice-bundlephobia-light@3x.png';
import themeCoreColors from '@/assets/projects/slice/slice-core-colors@3x.png';
import themeCoreColorsLight from '@/assets/projects/slice/slice-core-colors-light@3x.png';
import indexDB from '@/assets/projects/slice/slice-indexdb@3x.png';
import indexDBLight from '@/assets/projects/slice/slice-indexdb-light@3x.png';
import sliceCode from '@/assets/projects/slice/slice-mic-code.png';
import performance from '@/assets/projects/slice/slice-performance@3x.png';
import performanceLight from '@/assets/projects/slice/slice-performance-light@3x.png';
import prompt from '@/assets/projects/slice/slice-prompt@3x.png';
import promptLight from '@/assets/projects/slice/slice-prompt-light@3x.png';
import sliceRollupCode from '@/assets/projects/slice/slice-rollup-code.png';
import ssr from '@/assets/projects/slice/slice-ssr@3x.png';
import ssrLight from '@/assets/projects/slice/slice-ssr-light@3x.png';
import sliceSSR from '@/assets/projects/slice/slice-ssr-provider-code.png';
import themeColors from '@/assets/projects/slice/slice-theme-colors.png';
import themeColorsLight from '@/assets/projects/slice/slice-theme-colors-light.png';
import videoPlayer from '@/assets/projects/slice/slice-video-player@3x.png';
import videoPlayerLight from '@/assets/projects/slice/slice-video-player-light@3x.png';

export const images = {
	cameraDemo,
	cameraDemoLight,
	sliceCode,
	sliceRollupCode,
	sliceSSR,
	themeColors,
	themeColorsLight,
	themeCoreColors,
	themeCoreColorsLight,
	videoPlayer,
	videoPlayerLight,
	ssr,
	ssrLight,
	indexDB,
	indexDBLight,
	performance,
	performanceLight,
	bundle,
	bundleLight,
	prompt,
	promptLight,
} as const;

export const themedImages = {
	coreColors: { image: themeCoreColors, imageLight: themeCoreColorsLight },
	ssr: { image: ssr, imageLight: ssrLight },
	videoComponent: { image: videoPlayer, imageLight: videoPlayerLight },
	indexDB: { image: indexDB, imageLight: indexDBLight },
	performance: { image: performance, imageLight: performanceLight },
	bundle: { image: bundle, imageLight: bundleLight },
	prompt: { image: prompt, imageLight: promptLight },
};
