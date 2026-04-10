import { Icon } from '@apple-pie/slice';
import { useModalActions } from '@apple-pie/slice/stores';
import { ViProfilePic } from '@/src/components/ViProfilePic/ViProfilePic';
import { ViTalkModal } from '@/src/components/ViTalkModal/ViTalkModal';
import styles from './TalkToViLabel.module.css';
export function TalkToViLabel() {
	const showModal = useModalActions().show;

	// trigger info modal
	const handleInfoClick = async () => {
		showModal({
			id: 'vi-intro',
			component: ViTalkModal,
			props: { connect: false },
		});
	};

	return (
		<div className={styles.wrapper}>
			<ViProfilePic size={24} borderSize={0} borderColor={'var(--core-outline-primary)'} />
			Talk To Vi
			<Icon
				name={'help'}
				size={18}
				onClick={handleInfoClick}
				pointer
				strokeColor={'var(--core-text-disabled)'}
			/>
			<div className={styles.caret} />
		</div>
	);
}
