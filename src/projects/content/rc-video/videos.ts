import type { VideoProps } from '@apple-pie/slice';
import type { ProjectVideos } from '@/projects/_types/types';

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

export const videos: ProjectVideos = {
	aiSummaries: {
		...defaultVideoProps,
		src: 'https://player.vimeo.com/progressive_redirect/playback/823460592/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=b6e554141dffd2ffa25aac9a1dadb86bd0d3d59e1d4bb3fbfe07496cd7917482',
	},
	aiAccuracy: {
		...defaultVideoProps,
		src: 'https://player.vimeo.com/progressive_redirect/playback/823460564/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=6ce63ad410b75703415fec5a668ad1ae5cb0b05b6b292c465f791c6788586290',
	},
	about: {
		...defaultVideoProps,
		src: 'https://player.vimeo.com/progressive_redirect/playback/823459439/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=0121baf6a930629086e7cfbadf4a47b2972a0b26356797af4bc3201d5db2e908',
	},
	sessions: {
		...defaultVideoProps,
		src: 'https://player.vimeo.com/progressive_redirect/playback/823459394/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=bc081bcb4a5667ade7c6a54b517c5348a6829ae6d2fa102c8d0f64e0b0cb2845',
	},
};
