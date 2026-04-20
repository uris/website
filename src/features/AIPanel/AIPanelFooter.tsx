'use client';

import { AnimatePresence } from 'framer-motion';
import type { Transition, Variants } from 'motion';
import { ButtonBar } from '@/features/AIPanel/ButtonBar';
import { TextAreaBar } from '@/features/AIPanel/TextAreaBar';
import { useTextInputBar } from '@/stores/home-layout/homeLayoutStore';
import {useMicMuted, useVolume} from "@apple-pie/slice/stores";
import {useMemo} from "react";
import {useViConnected} from "@/stores/ai/viStore";

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
	const volumeMuted = useVolume() <= 0;
	const connected = useViConnected();
	
	const showTextInput = useMemo(()=>{
		if(volumeMuted && connected) return true
		return textInputBar
	},[connected, volumeMuted, textInputBar])

	return (
		<AnimatePresence initial={false} mode={'sync'}>
			{!showTextInput && (
				<ButtonBar key={'button-bar'} variants={barVariants} transition={barTransition} />
			)}
			{showTextInput && (
				<TextAreaBar key={'text-area-bar'} variants={barVariants} transition={barTransition} />
			)}
		</AnimatePresence>
	);
}
