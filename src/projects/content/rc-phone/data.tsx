import type { ColumnDefinition } from '@apple-pie/slice';

export type ResultValue = { current: number; new: number };

export type UsabilityData = {
	task: string;
	success: ResultValue;
	time: ResultValue;
	Errors: ResultValue;
};

export type PreferenceData = {
	scale: string;
	nonCustomers: ResultValue;
	customers: ResultValue;
};

export const performanceData: UsabilityData[] = [
	{
		task: 'Call by name',
		success: { current: 0.9531, new: 1 },
		time: { current: 13.53, new: 12.53 },
		Errors: { current: 6, new: 8 },
	},
	{
		task: 'Call by digit',
		success: { current: 1, new: 1 },
		time: { current: 6.23, new: 5.69 },
		Errors: { current: 1, new: 2 },
	},
	{
		task: 'View/Call missed',
		success: { current: 0.9531, new: 0.9769 },
		time: { current: 15.6, new: 4.86 },
		Errors: { current: 46, new: 2 },
	},
	{
		task: 'Listen to voicemail',
		success: { current: 0.7917, new: 1 },
		time: { current: 27.4, new: 13.94 },
		Errors: { current: 49, new: 3 },
	},
	{
		task: 'Multi Call',
		success: { current: 0.8196, new: 1 },
		time: { current: 12.67, new: 3.94 },
		Errors: { current: 48, new: 13 },
	},
	{
		task: 'Read message',
		success: { current: 0.901, new: 1 },
		time: { current: 12.05, new: 2.88 },
		Errors: { current: 23, new: 14 },
	},
	{
		task: 'Send message',
		success: { current: 0.9765, new: 0.9765 },
		time: { current: 3.94, new: 4.07 },
		Errors: { current: 24, new: 5 },
	},
];

export const preferenceData: PreferenceData[] = [
	{
		scale: 'Overall rating (1-5)',
		nonCustomers: { current: 3.11, new: 4.36 },
		customers: { current: 3.13, new: 4.43 },
	},
];

export const perferenceDefinitions: ColumnDefinition<UsabilityData>[] = [
	{
		id: 'col-1',
		key: 'task',
		title: 'Task name',
		justify: 'start',
		renderHeader: () => <span style={typeStyles['body-l-medium']}>Name</span>,
	},
];
