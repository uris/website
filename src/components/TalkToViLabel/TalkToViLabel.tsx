import { Icon, useLocalStore } from '@apple-pie/slice';
import { useModalActions } from '@apple-pie/slice/stores';
import { ViProfilePic } from '@/src/components/ViProfilePic/ViProfilePic';
import { ViTalkModal } from '@/src/components/ViTalkModal/ViTalkModal';
import { useViActions, useViConnected } from '@/src/stores/ai/viStore';
import styles from './TalkToViLabel.module.css';
export function TalkToViLabel() {
	const [_, setViTalkConfirm] = useLocalStore<boolean>('viTalkConfirm', false);
	const modalResponse = useModalActions().modalResponse;
	const showModal = useModalActions().show;
	const connect = useViActions().connect;
	const connected = useViConnected();

	// with connect
	const showConnectInfo = async () => {
		const result = await modalResponse<boolean>({
			id: 'vi-intro',
			component: ViTalkModal,
			props: { connect: true },
		}).catch(() => false);
		if (result) {
			setViTalkConfirm(result);
			await connect(true);
		}
	};

	// informational
	const showInfo = async () => {
		showModal({
			id: 'vi-intro',
			component: ViTalkModal,
		});
	};

	const handleInfoClick = () => {
		connected ? showInfo() : showConnectInfo();
	};

	return (
		<button type={'button'} className={styles.wrapper}>
			<ViProfilePic size={24} borderSize={1} borderColor={'var(--core-outline-secondary)'} />
			Talk To Vi
			<Icon
				name={'help'}
				size={18}
				strokeColor={'var(--core-text-special)'}
				onClick={handleInfoClick}
				pointer
			/>
			<div className={styles.caret} />
		</button>
	);
}
