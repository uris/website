'use client';

import { AnimatePresence } from 'framer-motion';
import type { Transition, Variants } from 'motion';
import { ButtonBar } from '@/features/AIPanel/ButtonBar';
import { TextAreaBar } from '@/features/AIPanel/TextAreaBar';
import { useTextInputBar } from '@/stores/home-layout/homeLayoutStore';

// animation variants
const barVariants: Variants = {
	initial: { opacity: 0, y: 110 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 110 },
};

// default button transition
const barTransition: Transition = { duration: 0.25, ease: 'easeInOut' };

export function AIPanelFooter() {
	const textInputBar = useTextInputBar();

	return (
		<AnimatePresence initial={false} mode={'sync'}>
			{!textInputBar && (
				<ButtonBar key={'button-bar'} variants={barVariants} transition={barTransition} />
			)}
			{textInputBar && (
				<TextAreaBar key={'text-area-bar'} variants={barVariants} transition={barTransition} />
			)}
		</AnimatePresence>
	);
}
