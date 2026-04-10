import { ProgressIndicator } from '@apple-pie/slice';
import styles from '@/features/AIPanel/AIPanel.module.css';
import { ResponseActionBar } from '@/src/components/ResponseActionBar/ResponseActionBar';
import { ViProfilePic } from '@/src/components/ViProfilePic/ViProfilePic';
import { useActiveResponse } from '@/src/hooks/useActiveResponse/useActiveResonse';
import { MarkdownRenderer } from '@/src/renderers/markdown/MarkdownRenderer';
import { ResponseType } from '@/src/stores/responses/_types';
import { useViBufferStreaming } from '@/src/stores/responses/responsesStore';

interface MessageThreadProps {
	handleStart?: () => void;
	handleEnd?: () => void;
	handleAppend?: () => void;
}

export function MessagesThread(props: Readonly<MessageThreadProps>) {
	const { handleEnd, handleAppend, handleStart } = props;
	const responses = useActiveResponse({
		onStart: handleStart,
		onAppend: handleAppend,
		onEnd: handleEnd,
	});
	const active = useViBufferStreaming();

	return responses.map((response, index) => {
		const responseStyleName = response.role === 'user' ? 'userResponse' : 'assistantResponse';
		const last = index === responses.length - 1;
		const transcribing =
			response.type === ResponseType.Audio && response.active && response.value === '';

		if (response.type === ResponseType.SessionStart) {
			const styleName = index === 0 ? 'sessionStart' : 'sessionReconnect';
			return (
				<div
					key={`${response.id}_${index}`}
					className={`${styles.responseSeparator} ${styles[styleName]}`}
				>
					{index === 0 && <ViProfilePic />}
				</div>
			);
		} else {
			return (
				<div
					key={`${response.id}_${index}`}
					className={`${styles.response} ${styles[responseStyleName]}`}
				>
					{transcribing && (
						<div className={styles.transcribing}>
							<ProgressIndicator inline show color={'var(--core-text-disabled)'} />
							Transcribing
						</div>
					)}
					<MarkdownRenderer content={response.value} />
					{!transcribing && <ResponseActionBar response={response} active={active} last={last} />}
				</div>
			);
		}
	});
}
