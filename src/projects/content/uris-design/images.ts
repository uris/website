import heroBG from '@/assets/backgrounds/abstract-bubbles.png';
import placeholder from '@/assets/placeholders/image-placeholder@3x.png';
import placeholderLight from '@/assets/placeholders/image-placeholder-light@3x.png';
import archDark from '@/assets/projects/uris-design/arhitecture-strawman-dark@3x.png';
import archLight from '@/assets/projects/uris-design/arhitecture-strawman-light@3x.png';
import homeDark from '@/assets/projects/uris-design/home-dark@3x.png';
import homeLight from '@/assets/projects/uris-design/home-light@3x.png';
import sliceWelcomeDark from '@/assets/projects/uris-design/slice-welcome-dark@3x.png';
import sliceWelcomeLight from '@/assets/projects/uris-design/slice-welcome-light@3x.png';
import hero from '@/assets/projects/uris-design/uris-design-hero@3x.png';
import heroLight from '@/assets/projects/uris-design/uris-design-hero-light@3x.png';
import skills from '@/assets/projects/uris-design/uris-design-skills@3x.png';
import skillsLight from '@/assets/projects/uris-design/uris-design-skills-light@3x.png';
import talk from '@/assets/projects/uris-design/uris-design-talk@3x.png';
import talkLight from '@/assets/projects/uris-design/uris-design-talk-light@3x.png';
import viAdjustSoundDark from '@/assets/projects/uris-design/vi-adjust-sound-dark@3x.png';
import viAdjustSoundLight from '@/assets/projects/uris-design/vi-adjust-sound-light@3x.png';
import viProject from '@/assets/projects/uris-design/vi-open-project-dark@3x.png';
import viProjectLight from '@/assets/projects/uris-design/vi-open-project-light@3x.png';
import viSkillsDark from '@/assets/projects/uris-design/vi-skills-dark@3x.png';
import viSkillsLight from '@/assets/projects/uris-design/vi-skills-light@3x.png';
import viQuestionDark from '@/assets/projects/uris-design/vi-theme-question-dark@3x.png';
import viQuestionLight from '@/assets/projects/uris-design/vi-theme-question-light@3x.png';
import viTypeInputDark from '@/assets/projects/uris-design/vi-type-input-dark@3x.png';
import viTypeInputLight from '@/assets/projects/uris-design/vi-type-input-light@3x.png';

export const images = {
	skills,
	skillsLight,
	talk,
	talkLight,
	hero,
	heroLight,
	heroBG,
	placeholder,
	placeholderLight,
	homeDark,
	homeLight,
	viProject,
	viProjectLight,
	viQuestionDark,
	viQuestionLight,
	viSkillsDark,
	viSkillsLight,
	viTypeInputDark,
	viTypeInputLight,
	viAdjustSoundDark,
	viAdjustSoundLight,
	archDark,
	archLight,
	sliceWelcomeDark,
	sliceWelcomeLight,
} as const;

export const themedImages = {
	skills: { image: skills, imageLight: skillsLight },
	talk: { image: talk, imageLight: talkLight },
	hero: { image: viProject, imageLight: viProjectLight },
	heroBG: { image: heroBG, imageLight: heroBG },
	placeholder: { image: placeholder, imageLight: placeholderLight },
	viQuestion: { image: viQuestionDark, imageLight: viQuestionLight },
	viSkills: { image: viSkillsDark, imageLight: viSkillsLight },
	viInterruptable: { image: viTypeInputDark, imageLight: viTypeInputLight },
	viBounds: { image: viAdjustSoundDark, imageLight: viAdjustSoundLight },
	architecture: { image: archDark, imageLight: archLight },
	sliceWelcome: { image: sliceWelcomeDark, imageLight: sliceWelcomeLight },
};
