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
			maxHeight={300}
		>
			<p className={css.p}>
				Vi is an ai assistant you can talk to about my work and background. Two rules:
			</p>
			<ol className={css.ol}>
				<li className={css.li}>
					<strong className={css.b}>Privacy:</strong> I don't record, save, share, or analyze
					conversations. They are yours, they are private. End of story. Hit refresh and they are
					gone for good.
				</li>
				<li className={css.li}>
					<strong className={css.b}>Vi exaggerates:</strong> tends to say great things about me (all
					true of course 😉)... probably because that what I asked her to do.
				</li>
			</ol>
		</Modal>
	);
}
