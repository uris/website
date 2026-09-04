import type { VideoProps } from '@apple-pie/slice';

const defaultVideoProps: Partial<VideoProps> = {
	height: 'auto',
	width: '100%',
	playing: true,
	objectFit: 'cover',
	controls: 'simple',
	muted: false,
	borderRadius: 16,
	customControls: {
		play: false,
		progress: true,
		volume: true,
		fullscreen: true,
	},
};

export const videos: Record<string, VideoProps> = {
	aiSummaries: {
		...defaultVideoProps,
		src: 'https://player.vimeo.com/progressive_redirect/playback/823460592/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=b6e554141dffd2ffa25aac9a1dadb86bd0d3d59e1d4bb3fbfe07496cd7917482',
	},
	aiAccuracy: {
		...defaultVideoProps,
		src: 'https://player.vimeo.com/progressive_redirect/playback/823460564/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=6ce63ad410b75703415fec5a668ad1ae5cb0b05b6b292c465f791c6788586290',
	},
};
