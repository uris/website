import skills from '@/assets/projects/uris-design/uris-design-skills@3x.png';
import skillsLight from '@/assets/projects/uris-design/uris-design-skills-light@3x.png';
import talk from '@/assets/projects/uris-design/uris-design-talk@3x.png';
import talkLight from '@/assets/projects/uris-design/uris-design-talk-light@3x.png';

export const images = {
	skills,
	skillsLight,
	talk,
	talkLight,
} as const;

export const themedImages = {
	skills: { image: skills, imageLight: skillsLight },
	talk: { image: talk, imageLight: talkLight },
};
