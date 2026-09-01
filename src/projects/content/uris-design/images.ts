import heroBG from '@/assets/backgrounds/abstract-bubbles.png';
import hero from '@/assets/projects/uris-design/uris-design-hero@3x.png';
import heroLight from '@/assets/projects/uris-design/uris-design-hero-light@3x.png';
import skills from '@/assets/projects/uris-design/uris-design-skills@3x.png';
import skillsLight from '@/assets/projects/uris-design/uris-design-skills-light@3x.png';
import talk from '@/assets/projects/uris-design/uris-design-talk@3x.png';
import talkLight from '@/assets/projects/uris-design/uris-design-talk-light@3x.png';

export const images = {
	skills,
	skillsLight,
	talk,
	talkLight,
	hero,
	heroLight,
	heroBG,
} as const;

export const themedImages = {
	skills: { image: skills, imageLight: skillsLight },
	talk: { image: talk, imageLight: talkLight },
	hero: { image: hero, imageLight: heroLight },
	heroBG: { image: heroBG, imageLight: heroBG },
};
