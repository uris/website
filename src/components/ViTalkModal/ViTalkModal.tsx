import { Modal, type ModalAction, type ModalProps } from '@apple-pie/slice';
import css from './ViTalkModal.module.css';

// confirm connection modal
const confirmConnectActions: ModalAction<boolean>[] = [
	{
		id: 'cancel',
		label: `Got it`,
		value: false,
		position: 'left',
	},
	{
		id: 'continue',
		label: `Connect To Vi`,
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
			<p className={css.p}>Vi is a voice enabled ai assistant you can talk to about my work, background and skills.</p>
			<p>
				You can also ask Vi to navigate and interact directly with the site, like "Vi, Open project ..." or "Vi, Mute
				sound".
			</p>
			<p className={css.p}>
				Just so you know, conversations are not recorded, saved, shared, or analyzed / used by me in any way. Once you
				hit refresh... poof! They're gone.
			</p>
		</Modal>
	);
}
