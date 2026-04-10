import { Modal, type ModalAction, type ModalProps } from '@apple-pie/slice';
import css from './ViTalkModal.module.css';

// confirm connection modal
const confirmConnectActions: ModalAction<boolean>[] = [
	{
		id: 'cancel',
		label: `Don't connect`,
		value: false,
		position: 'left',
	},
	{
		id: 'continue',
		label: `Got it`,
		value: true,
		primary: true,
	},
];

// info modal actions
const infoActions: ModalAction<boolean>[] = [
	{
		id: 'cancel',
		label: `Got it`,
		value: false,
		primary: true,
	},
];

interface ViTalkModalProps extends ModalProps<boolean> {
	connect?: boolean;
}

// show info options / connect options
export function ViTalkModal(props: Readonly<ViTalkModalProps>) {
	const { connect = true, ...rest } = props;
	return (
		<Modal<boolean>
			{...rest}
			titleIcon={'talk'}
			actions={connect ? confirmConnectActions : infoActions}
			title={'About Vi Talk'}
			borderRadius={16}
		>
			<p className={css.p}>
				Vi is a voice enabled ai assistant you can talk to about my work, background and skills.
			</p>
			<p className={css.p}>
				Conversations are not recorded, saved, shared, or analyzed / used by me in any way. If you
				hit refresh... Poof! They're gone.
			</p>
			<p className={css.p}>
				Also, Vi tends to only say great things about me (all true of course 😉)... Probably because
				that's what I asked her to do ...
			</p>
		</Modal>
	);
}
