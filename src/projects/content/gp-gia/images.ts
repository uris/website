import heroBG from '@/assets/backgrounds/abstract-bubbles-04.png';
import placeholder from '@/assets/placeholders/image-placeholder@3x.png';
import placeholderLight from '@/assets/placeholders/image-placeholder-light@3x.png';
import artifactTerminateDark from '@/assets/projects/gp-gia/artifact-02-dark@3x.png';
import artifactTerminateLight from '@/assets/projects/gp-gia/artifact-02-light@3x.png';
import artifactDark from '@/assets/projects/gp-gia/artifact-dark@3x.png';
import artifactLight from '@/assets/projects/gp-gia/artifact-light@3x.png';
import collaborateDark from '@/assets/projects/gp-gia/collaboration-dark@3x.png';
import collaborateLight from '@/assets/projects/gp-gia/collaboration-light@3x.png';
import architectureDark from '@/assets/projects/gp-gia/gia-architecture-dark.png';
import architectureLight from '@/assets/projects/gp-gia/gia-architecture-light.png';
import colabArchDark from '@/assets/projects/gp-gia/gp-gia-collaboration-dark@3x.png';
import colabArchLight from '@/assets/projects/gp-gia/gp-gia-collaboration-light@3x.png';
import verifiedDark from '@/assets/projects/gp-gia/gp-verified-dark@3x.png';
import verifiedLight from '@/assets/projects/gp-gia/gp-verified-light@3x.png';
import monitorDark from '@/assets/projects/gp-gia/monitoring-dark@3x.png';
import monitorLight from '@/assets/projects/gp-gia/monitoring-light@3x.png';
import sourceDark from '@/assets/projects/gp-gia/source-dark@3x.png';
import sourceLight from '@/assets/projects/gp-gia/source-light@3x.png';
import type { ThemedProjectImages } from '@/projects/_types/types';

export const themedImages: ThemedProjectImages = {
	heroBG: { image: heroBG, imageLight: heroBG },
	placeholder: { image: placeholder, imageLight: placeholderLight },
	hero: { image: artifactTerminateDark, imageLight: artifactTerminateLight },
	source: { image: sourceDark, imageLight: sourceLight },
	artifact: { image: artifactDark, imageLight: artifactLight },
	collaborate: { image: collaborateDark, imageLight: collaborateLight },
	monitor: { image: monitorDark, imageLight: monitorLight },
	verified: { image: verifiedDark, imageLight: verifiedLight },
	architecture: { image: architectureDark, imageLight: architectureLight },
	colabArch: { image: colabArchDark, imageLight: colabArchLight },
};
