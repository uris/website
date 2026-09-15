import { type ColumnDefinition, DataTable } from '@apple-pie/slice';
import type React from 'react';
import { useMemo } from 'react';
import { setStyle } from '@/utils/styles/styles';
import styles from './Table.module.css';

export interface TableProps<T> {
	tableData: T[];
	columnDefinitions: ColumnDefinition<T>[];
	maxWidth?: number | string;
	padding?: number | string;
	caption?: string;
	margin?: boolean;
	marginSize?: number | string;
}

export function Table<T>(props: Readonly<TableProps<T>>) {
	const { tableData, columnDefinitions, maxWidth = 860, padding = 64, caption, marginSize = 64, margin = true } = props;

	const cssVars = useMemo(() => {
		return {
			'--table-padding': setStyle(padding),
			'--table-margin': margin ? setStyle(marginSize) : 0,
		} as React.CSSProperties;
	}, [padding, margin, marginSize]);

	return (
		<div className={styles.wrapper} style={cssVars}>
			{caption && (
				<h6 className={styles.caption} style={{ padding: 0, margin: 0 }}>
					{caption}
				</h6>
			)}
			<DataTable<T>
				caption={caption}
				tableData={tableData}
				columnDefinitions={columnDefinitions}
				height={'auto'}
				width={'100%'}
				backgroundColor={'transparent'}
				candyStripeBackgroundColor={'transparent'}
				colResize={false}
				maxWidth={maxWidth}
				margin={0}
				freezeColumn={true}
				headerSticky={true}
			/>
		</div>
	);
}
