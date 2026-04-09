import { Avatar, useLocalStore } from '@apple-pie/slice';
import styles from '@/features/AIPanel/AIPanel.module.css';
import { ResponseActionBar } from '@/src/components/ResponseActionBar/ResponseActionBar';
import { useActiveResponse } from '@/src/hooks/useActiveResponse/useActiveResonse';
import { MarkdownRenderer } from '@/src/renderers/markdown/MarkdownRenderer';
import { ResponseType } from '@/src/stores/responses/_types';
import { useViBufferStreaming } from '@/src/stores/responses/responsesStore';
import { avatarColor } from '@/utils/consts/consts';

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
	const [userName] = useLocalStore('userName', '');

	return responses.map((response, index) => {
		const userInitial = userName === '' ? 'U' : userName.charAt(0).toUpperCase();
		const responseStyleName = response.role === 'user' ? 'userResponse' : 'assistantResponse';
		const avatarName = response.role === 'user' ? userInitial : 'Vi';
		const colors = avatarColor(response.role);
		const last = index === responses.length - 1;
		if (response.type === ResponseType.SessionStart) {
			const label = index === 0 ? 'Connected' : 'Re-connected';
			const styleName = index === 0 ? 'sessionStart' : 'sessionReconnect';
			return (
				<div
					key={`${response.id}_${index}`}
					className={`${styles.responseSeparator} ${styles[styleName]}`}
				>
					{' '}
					<span className={styles.marker}>{label}</span>
				</div>
			);
		} else {
			return (
				<div
					key={`${response.id}_${index}`}
					className={`${styles.response} ${styles[responseStyleName]}`}
				>
					<div className={`${styles[response.role]}`}>
						<Avatar
							name={avatarName}
							borderWidth={2}
							bgColor={colors.bgColor}
							borderColor={colors.borderColor}
							textColor={colors.textColor}
						/>
					</div>
					<MarkdownRenderer content={response.value} />
					<ResponseActionBar response={response} active={active} last={last} />
				</div>
			);
		}
	});
}
