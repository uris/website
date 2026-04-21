import { ErrorSummary, FlexDiv, TextArea, TextField } from '@apple-pie/slice';
import type { Transition, Variants } from 'motion';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ValidationType } from '@/stores/contact/_types';
import { useContact, useFormErrors, useFormValue, useSending } from '@/stores/contact/contactStore';
import styles from './contact.module.css';

// error message entry/exit animation
const variants: Variants = {
	show: { opacity: 1, height: 'auto' },
	hide: { opacity: 0, height: 0 },
};
const transition: Transition = { duration: 0.25, ease: 'easeInOut' };

export function Contact() {
	const [focused, setFocused] = useState<boolean>(false);
	const timer = useRef<NodeJS.Timeout | null>(null);
	const text = useFormValue('text');
	const from = useFormValue('from');
	const setFormValue = useContact().setFormValue;
	const setFieldInitialized = useContact().setFieldInitialized;
	const sending = useSending();
	const errors = useFormErrors();

	// delay the focus until the component has had time to mount
	useEffect(() => {
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => setFocused(true), 250);
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, []);

	return (
		<div className={styles.wrapper}>
			<FlexDiv direction={'column'} padding={'40px 64px'} width={'fill'}>
				<motion.div
					className={styles.errors}
					variants={variants}
					initial={'hide'}
					animate={errors.length > 0 ? 'show' : 'hide'}
					transition={transition}
				>
					<ErrorSummary entries={errors} />
				</motion.div>
				<TextField
					backgroundColorBlurred={'none'}
					backgroundColorFocused={'none'}
					borderRadius={0}
					label={'From:'}
					name={'from-email'}
					value={from}
					placeholder={'Your email address'}
					borderType={'underline'}
					padding={'16px 0'}
					onBlur={(value) => {
						if (value !== '') setFieldInitialized('from');
					}}
					onChange={(value) => {
						setFormValue('from', { value, validationType: ValidationType.email });
					}}
					disabled={sending}
					maxLength={250}
				/>
				<TextArea
					name={'text'}
					focused={focused}
					placeholder={'Something on your mind? Drop me a note ...'}
					border={false}
					backgroundColor={'none'}
					resizable={false}
					rows={5}
					padding={'16px 0'}
					value={text}
					onBlur={(value) => {
						if (value !== '') setFieldInitialized('text');
					}}
					onChange={(value) => {
						setFormValue('text', { value, validationType: ValidationType.text });
					}}
					disabled={sending}
					maxLength={1500}
				/>
			</FlexDiv>
		</div>
	);
}
