import { ProgressIndicator } from '@apple-pie/slice';
import styles from '@/features/AIPanel/AIPanel.module.css';
import { ResponseActionBar } from '@/src/components/ResponseActionBar/ResponseActionBar';
import { ViProfilePic } from '@/src/components/ViProfilePic/ViProfilePic';
import { useActiveResponse } from '@/src/hooks/useActiveResponse/useActiveResonse';
import { MarkdownRenderer } from '@/src/renderers/markdown/MarkdownRenderer';
import { useViConnected } from '@/src/stores/ai/viStore';
import { ResponseType, Role, type ViResponse } from '@/src/stores/responses/_types';
import { useViBufferStreaming } from '@/src/stores/responses/responsesStore';
import { THINKING_PLACEHOLDER } from '@/utils/consts/consts';
import { classNames } from '@/utils/styles/styles';

interface MessageThreadProps {
	handleStart?: () => void;
	handleEnd?: () => void;
	handleAppend?: () => void;
}

export function MessagesThread(props: Readonly<MessageThreadProps>) {
	const { handleEnd, handleAppend, handleStart } = props;

	// forward events to parent for handling response lifecycle, scrolling, etc.
	const responses = useActiveResponse({
		onStart: handleStart,
		onAppend: handleAppend,
		onEnd: handleEnd,
	});

	// render messages based on role
	return responses.map((response, index) => {
		const role = response.role;
		const isFirstMsg = index === 0;
		const isLastMsg = index === responses.length - 1;
		const key = `${response.id}_${index}`;

		switch (role) {
			case Role.System: {
				return <SystemMessage key={key} first={isFirstMsg} />;
			}
			case Role.Assistant: {
				return <ViMessage key={key} response={response} last={isLastMsg} />;
			}
			case Role.User: {
				return <UserMessage key={key} response={response} last={isLastMsg} />;
			}
			default:
				return null;
		}
	});
}

interface SystemMessageProps {
	first?: boolean;
}

export function SystemMessage(props: Readonly<SystemMessageProps>) {
	const { first = true } = props;
	const connected = useViConnected();
	const showVi = connected && first;
	const styleNames = [styles.responseSeparator];
	styleNames.push(first ? styles.sessionStart : styles.sessionReconnect);
	if (showVi) styleNames.push(styles.sticky);
	return <div className={classNames(styleNames)}>{showVi && <ViProfilePic />}</div>;
}

interface AssistantMessageProps {
	response: ViResponse;
	last?: boolean;
}

export function ViMessage(props: Readonly<AssistantMessageProps>) {
	const { response, last = false } = props;
	const { value, active } = response;
	const buffering = useViBufferStreaming();
	const thinking = active && value === '';
	const render = thinking ? THINKING_PLACEHOLDER : value;
	return (
		<div className={`${styles.response} ${styles.assistantResponse}`}>
			<MarkdownRenderer content={render} />
			<ResponseActionBar response={response} active={buffering} last={last} />
		</div>
	);
}

interface UserMessageProps {
	response: ViResponse;
	last?: boolean;
}

export function UserMessage(props: Readonly<UserMessageProps>) {
	const { response, last = false } = props;
	const { active, value } = response;
	const isAudio = response.type === ResponseType.Audio;
	const transcribing = isAudio && active && value === '';
	return (
		<div className={`${styles.response} ${styles.userResponse}`}>
			{transcribing && (
				<div className={styles.transcribing}>
					<ProgressIndicator inline show color={'var(--core-text-disabled)'} />
					Transcribing
				</div>
			)}
			<MarkdownRenderer content={value} />
			{!transcribing && <ResponseActionBar response={response} active={active} last={last} />}
		</div>
	);
}
