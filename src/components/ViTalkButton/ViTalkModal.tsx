import { Modal, type ModalAction, type ModalProps } from '@apple-pie/slice';
import css from './ViTalkButton.module.css';

const modalActions: ModalAction<boolean>[] = [
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

export const viTalkModal = (props: ModalProps<boolean>) => {
	return (
		<Modal<boolean>
			{...props}
			titleIcon={'talk'}
			actions={modalActions}
			title={'About Vi Talk'}
			padding={'24px'}
			borderRadius={16}
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
};
