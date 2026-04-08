import { useLastUpdated } from '@apple-pie/slice';
import type { ViResponse } from '@/src/stores/responses/_types';
import styles from './ResponseActionBar.module.css';
export interface ResponseActionBarProps {
	response: ViResponse;
	active?: boolean;
	last?: boolean;
}

export function ResponseActionBar(props: Readonly<ResponseActionBarProps>) {
	const { response, active = false, last = false } = props;
	const { timestamp, disconnected = false } = response;
	const date = new Date(timestamp).toISOString();
	const { lastUpdated } = useLastUpdated(date);

	if (active && last) return null;
	return (
		<div className={styles.wrapper}>
			{lastUpdated && (
				<span className={`${styles.infoLabel} core-text-disabled`}>{lastUpdated}</span>
			)}
			{disconnected && (
				<span className={`${styles.infoLabel} feedback-attention`}>disconnected</span>
			)}
		</div>
	);
}
