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
				Vi is an ai assistant you can talk to about my work and background. Keep in mind:
			</p>
			<ol className={css.ol}>
				<li className={css.li}>
					<strong className={css.b}>Privacy:</strong> I don't record, save, share, or analyze any
					conversations. They are yours, they are private. Period.
				</li>
				<li className={css.li}>
					<strong className={css.b}>Vi's positive:</strong> She mostly says great things - because
					they are true ;) but mostly because that's what I asked her to do
				</li>
			</ol>
		</Modal>
	);
}
