'use client';

import { Button } from '@apple-pie/slice';
import type { AnimationDefinition, Variants } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useState } from 'react';
import { useContact, useFormIsValid, useSending } from '@/stores/contact/contactStore';
import { SidebarSurface } from '@/stores/sidebar/_types';
import { useSurface } from '@/stores/sidebar/sidebarStore';
import styles from './contact.module.css';

const variants: Variants = {
	initial: { opacity: 0, transform: 'translateY(100%)' },
	animate: { opacity: 1, transform: 'translateY(0%)' },
	exit: { opacity: 0, transform: 'translateY(100%)' },
};

export function ContactFooter() {
	const surface = useSurface();
	const show = surface === SidebarSurface.Contact;
	const sending = useSending();
	const [delay, setDelay] = useState(0.35);
	const contactActions = useContact();
	const isValid = useFormIsValid();

	const handleAnimationComplete = useCallback((definition: AnimationDefinition) => {
		if (definition === 'animate') setDelay(0);
		else setDelay(0.35);
	}, []);

	return (
		<AnimatePresence initial={true}>
			{show && (
				<motion.div
					className={styles.footer}
					variants={variants}
					transition={{ duration: 0.25, ease: 'easeInOut', delay }}
					initial={'initial'}
					animate={'animate'}
					exit={'exit'}
					onAnimationComplete={handleAnimationComplete}
				>
					<Button
						state={sending ? 'disabled' : 'normal'}
						iconLeft={'x'}
						size={'large'}
						label={'Clear'}
						onClick={contactActions.clear}
					/>
					<Button
						state={!isValid || sending ? 'disabled' : 'normal'}
						variant={'solid'}
						size={'large'}
						iconRight={'arrow right'}
						label={'Send'}
						onClick={contactActions.send}
						working={sending}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
