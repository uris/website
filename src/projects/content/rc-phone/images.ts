import heroBG from '@/assets/backgrounds/abstract-bubbles-03.png';
import placeholder from '@/assets/placeholders/image-placeholder@3x.png';
import placeholderLight from '@/assets/placeholders/image-placeholder-light@3x.png';
import charts from '@/assets/projects/rc-video/charts.png';
import competition from '@/assets/projects/rc-video/competition.png';
import covid from '@/assets/projects/rc-video/covid.png';
import express from '@/assets/projects/rc-video/express.gif';
import floating from '@/assets/projects/rc-video/floating@2x.png';
import hero from '@/assets/projects/rc-video/hero.png';
import hybrid from '@/assets/projects/rc-video/hybrid@2x.png';
import meetingsummary from '@/assets/projects/rc-video/meetingsummary@2x.png';
import nightandday from '@/assets/projects/rc-video/nightandday@2x.png';
import novideo from '@/assets/projects/rc-video/no-video@2x.png';
import portrait from '@/assets/projects/rc-video/portrait@2x.png';
import prep from '@/assets/projects/rc-video/prep@2x.png';
import record from '@/assets/projects/rc-video/record.png';
import sayno from '@/assets/projects/rc-video/sayno@2x.png';
import standup from '@/assets/projects/rc-video/standup@2x.png';
import summaries from '@/assets/projects/rc-video/summaries@2x.png';
import templates from '@/assets/projects/rc-video/templates@2x.png';
import users from '@/assets/projects/rc-video/users.png';
import type { ThemedProjectImages } from '@/projects/_types/types';

export const images = {
	heroBG,
	placeholder,
	placeholderLight,
};

export const themedImages: ThemedProjectImages = {
	heroBG: { image: heroBG, imageLight: heroBG },
	hero: { image: hero, imageLight: hero },
	placeholder: { image: placeholder, imageLight: placeholderLight },
	charts: { image: charts, imageLight: charts },
	covid: { image: covid, imageLight: covid },
	users: { image: users, imageLight: users },
	competition: { image: competition, imageLight: competition },
	sayno: { image: sayno, imageLight: sayno },
	record: { image: record, imageLight: record },
	standup: { image: standup, imageLight: standup },
	templates: { image: templates, imageLight: templates },
	prep: { image: prep, imageLight: prep },
	novideo: { image: novideo, imageLight: novideo },
	portrait: { image: portrait, imageLight: portrait },
	floating: { image: floating, imageLight: floating },
	express: { image: express, imageLight: express },
	nightandday: { image: nightandday, imageLight: nightandday },
	summaries: { image: summaries, imageLight: summaries },
	hybrid: { image: hybrid, imageLight: hybrid },
	meetingsummary: { image: meetingsummary, imageLight: meetingsummary },
};
