import dawn from '@/assets/projects/rc-phone/users/dawn@2x.png';
import eric from '@/assets/projects/rc-phone/users/eric@2x.png';
import jessie from '@/assets/projects/rc-phone/users/jessie@2x.png';
import julie from '@/assets/projects/rc-phone/users/julie@2x.png';
import liz from '@/assets/projects/rc-phone/users/liz@2x.png';
import paul from '@/assets/projects/rc-phone/users/paul@2x.png';

import type { UserCardProps } from '@/components/UserCard/_types';

export const userCards: UserCardProps[] = [
	{
		photo: liz,
		name: 'Liz W.',
		role: 'HR Director',
		company: 'Company Name',
		quote: `What matters to me is that these screens are in the right spot. It's the number one way I use Ring (computer and phone) ...`,
		videoLabel: "Liz's story",
		videoUrl: '',
	},
	{
		photo: jessie,
		name: 'Jessie N.',
		role: 'SaaS Manager',
		company: 'SaaS Ops ',
		quote: `Normally I have it on my left screen with what's app, snapchat, RingCentral and I also have Spotify. I kinda layer applications on top of each other ...`,
		videoLabel: "User's story",
		videoUrl: '',
	},
	{
		photo: julie,
		name: 'Julie G.',
		role: 'Office Manager',
		company: 'The Rubicon Group',
		quote: `I still do everything on my mac but I have RC open on my laptop. When I want to transfer work makes it so much harder ...`,
		videoLabel: "Julie's story",
		videoUrl: '',
	},
	{
		photo: eric,
		name: 'Eric I.',
		role: 'Architect',
		company: 'Sol Architecture',
		quote: `We link our office 365 contacts to RingCentral and that's where my information really comes from … We use a ticketing system and I also use that quite extensively ...`,
		videoLabel: "Eric's story",
		videoUrl: '',
	},
	{
		photo: dawn,
		name: 'Dawn C.',
		role: 'Sales Exec.',
		company: 'AP Lazer',
		quote: `I have a cheat sheet on my wall. A cork board that has everyone's extension number that I can look at ...`,
		videoLabel: "Dawn's story",
		videoUrl: '',
	},
	{
		photo: paul,
		name: 'Paul V.',
		role: 'Client Ops.',
		company: 'MMG Fusion',
		quote: `Obviously we're not in the office as much and so I really have to rely on the little dot to know who is or isn't available so I can use them ...`,
		videoLabel: "Paul's story",
		videoUrl: '',
	},
];
