import { type ColumnDefinition, Icon } from '@apple-pie/slice';
import { typeStyles } from '@apple-pie/slice/theme/type';
import type React from 'react';

export type ResultValue = { current: number; new: number };

export type UsabilityData = {
	task: string;
	success: ResultValue;
	time: ResultValue;
	errors: ResultValue;
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
		errors: { current: 6, new: 8 },
	},
	{
		task: 'Call by digit',
		success: { current: 1, new: 1 },
		time: { current: 6.23, new: 5.69 },
		errors: { current: 1, new: 0 },
	},
	{
		task: 'View/Call missed',
		success: { current: 0.9531, new: 0.9769 },
		time: { current: 15.6, new: 4.86 },
		errors: { current: 46, new: 2 },
	},
	{
		task: 'Listen to voicemail',
		success: { current: 0.7917, new: 1 },
		time: { current: 27.4, new: 13.94 },
		errors: { current: 49, new: 3 },
	},
	{
		task: 'Multi Call',
		success: { current: 0.8196, new: 1 },
		time: { current: 12.67, new: 3.94 },
		errors: { current: 48, new: 13 },
	},
	{
		task: 'Read message',
		success: { current: 0.901, new: 1 },
		time: { current: 12.05, new: 2.88 },
		errors: { current: 23, new: 14 },
	},
	{
		task: 'Send message',
		success: { current: 0.9765, new: 0.9765 },
		time: { current: 3.94, new: 4.07 },
		errors: { current: 24, new: 5 },
	},
];

export const preferenceData: PreferenceData[] = [
	{
		scale: 'Overall rating (1-5)',
		nonCustomers: { current: 3.11, new: 4.36 },
		customers: { current: 3.13, new: 4.43 },
	},
];

export const performanceDefinitions: ColumnDefinition<UsabilityData>[] = [
	{
		id: 'col-1',
		key: 'task',
		title: 'Task name',
		justify: 'start',
		width: 180,
		renderHeader: (ctx) => <span style={typeStyles['body-l-medium']}>{ctx.column.title}</span>,
		renderCell: ({ row }) => <div style={{ color: 'var(--core-text-special)' }}>{row.task}</div>,
	},
	{
		id: 'col-2',
		key: 'success',
		title: 'Success Rate',
		justify: 'start',
		renderHeader: (ctx) => <HeaderRender top={ctx.column.title} bottom={'mean success rate'} />,
		renderCell: ({ row }) => (
			<PerfRenderer current={row.success.current} new={row.success.new} positive={'greater'} format={'percent'} />
		),
	},
	{
		id: 'col-3',
		key: 'time',
		title: 'Time taken',
		justify: 'start',
		renderHeader: (ctx) => <HeaderRender top={ctx.column.title} bottom={'mean seconds'} />,
		renderCell: ({ row }) => <PerfRenderer current={row.time.current} new={row.time.new} positive={'less'} />,
	},
	{
		id: 'col-4',
		key: 'time',
		title: 'Error Rate',
		justify: 'start',
		renderHeader: (ctx) => <HeaderRender top={ctx.column.title} bottom={'mean num. errors'} />,
		renderCell: ({ row }) => <PerfRenderer current={row.errors.current} new={row.errors.new} positive={'less'} />,
	},
];

export const preferenceDefinitions: ColumnDefinition<PreferenceData>[] = [
	{
		id: 'col-1',
		key: 'scale',
		title: 'Preference Scale',
		justify: 'start',
		width: 180,
		renderHeader: (ctx) => <span style={typeStyles['body-l-medium']}>{ctx.column.title}</span>,
		renderCell: ({ row }) => <div style={{ color: 'var(--core-text-special)' }}>{row.scale}</div>,
	},
	{
		id: 'col-2',
		key: 'nonCustomers',
		title: 'Non Customers',
		justify: 'start',
		renderHeader: (ctx) => <HeaderRender top={ctx.column.title} />,
		renderCell: ({ row }) => (
			<PerfRenderer
				current={row.nonCustomers.current}
				new={row.nonCustomers.new}
				positive={'greater'}
				format={'decimal'}
			/>
		),
	},
	{
		id: 'col-3',
		key: 'customers',
		title: 'Customers',
		justify: 'start',
		renderHeader: (ctx) => <HeaderRender top={ctx.column.title} />,
		renderCell: ({ row }) => (
			<PerfRenderer current={row.customers.current} new={row.customers.new} positive={'greater'} />
		),
	},
];

const percent = new Intl.NumberFormat('en-US', {
	style: 'percent',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

const decimal = new Intl.NumberFormat('en-US', {
	style: 'decimal',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

export const HeaderRender = (props: Readonly<{ top: string; bottom?: string }>) => {
	const { top, bottom } = props;
	const HeaderRender: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		flexDirection: 'column',
	};
	const measureStyle: React.CSSProperties = {
		...typeStyles['body-s-medium'],
		color: 'var(--core-text-disabled)',
	};
	return (
		<div style={HeaderRender}>
			<span>{top}</span>
			{bottom && <span style={measureStyle}>{bottom}</span>}
		</div>
	);
};

export const PerfRenderer = (
	props: Readonly<{ current: number; new: number; positive: 'greater' | 'less'; format?: 'decimal' | 'percent' }>,
) => {
	const { current, new: newTime, positive = 'greater', format = 'decimal' } = props;
	const style: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 16,
		width: '100%',
	};
	const isPositive = positive === 'greater' ? current < newTime : current > newTime;
	const isSame = current === newTime;
	const positiveColor: React.CSSProperties = { color: 'var(--feedback-positive)', fontWeight: 600 };
	const negativeColor: React.CSSProperties = { color: 'var(--feedback-warning)', fontWeight: 600 };
	const sameColor: React.CSSProperties = { color: 'var(--feedback-urgency)', fontWeight: 600 };
	const measureColor: React.CSSProperties = isSame ? sameColor : isPositive ? positiveColor : negativeColor;

	return (
		<div style={style}>
			<span>{format === 'decimal' ? decimal.format(current) : percent.format(current)}</span>
			<Icon name={'arrow right'} />
			<span style={measureColor}>{format === 'decimal' ? decimal.format(newTime) : percent.format(newTime)}</span>
		</div>
	);
};
