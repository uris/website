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
	heroVideo: {
		...defaultVideoProps,
		src: 'https://player.vimeo.com/progressive_redirect/playback/820209897/rendition/720p/file.mp4?loc=external&signature=c00f8afbe14f534d24d7fc1fcc5d86345ecf0c6b9df7831dfd9c8287c4ed0f57',
	},
	natural: {
		...defaultVideoProps,
		src: 'https://player.vimeo.com/progressive_redirect/playback/820415024/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=545719652702986c1c1fc48ee885aef40b0555c6f5d40c567ec69e46361c01b5',
	},
	resize: {
		...defaultVideoProps,
		src: 'https://player.vimeo.com/progressive_redirect/playback/820415098/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=74e0b011f49e84ab9abcadf4ba057903e5b1ca267c2329f6b63fb8e342d3b0b0',
	},
	popout: {
		...defaultVideoProps,
		src: 'https://player.vimeo.com/progressive_redirect/playback/820415068/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=908b8bac26ff1e04832679826cf6c73173aa6d0077fe71f6318b327affba14f5',
	},
	hud: {
		...defaultVideoProps,
		src: 'https://player.vimeo.com/progressive_redirect/playback/820417313/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=066aa426377ed829164b48d868ddf118dca01493a40f7ae9a1b5615b42fe00ed',
	},
	dale: {
		...defaultVideoProps,
		src: 'https://player.vimeo.com/progressive_redirect/playback/1228652972/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=29d873bdda5166a7dbfcdfc086e28aa97476abf3a4993177107cbdb140d2d4c0',
	},
	outcomes: {
		...defaultVideoProps,
		src: 'https://player.vimeo.com/progressive_redirect/playback/821043477/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=784fd229592fd2cca566a0414ed1c6db02ab239820f979a843e9db3562443b12',
	},
};
