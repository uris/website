'use client';

import { FlexDiv, IconButton, Preset, ToggleButton, useTheme } from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import type React from 'react';
import { useCallback, useMemo } from 'react';
import { useHomeLayout, useSettingsOpen } from '@/stores/home-layout/homeLayoutStore';
import { buttonRotateAnimation, linkedinProfilePage } from '@/utils/consts/consts';
import { gradientCover } from '@/utils/styles/styles';
import styles from './AIPanel.module.css';

export function AIPanelHeader() {
	const { current } = useTheme();
	const surfaceColor = current.colors['core-surface-primary'];
	const toggleSettings = useHomeLayout().toggleSettings;
	const settingsOpen = useSettingsOpen();
	const setTip = useTipActions().push;

	// memo dynamic css variables
	const cssVars = useMemo(() => {
		return {
			'--header-gradient': gradientCover(surfaceColor, 'bottom'),
		} as React.CSSProperties;
	}, [surfaceColor]);

	// open LinkedIn profile page
	const handleLinkedIn = useCallback(() => {
		if (globalThis.window !== undefined) window.open(linkedinProfilePage, '_blank');
	}, []);

	return (
		<div className={styles.header} style={cssVars}>
			<FlexDiv preset={Preset.Row} gap={16}>
				<ToggleButton
					buttonSize={'l'}
					icon={settingsOpen ? 'x' : 'settings'}
					onChange={toggleSettings}
					tooltip={'Settings'}
					onToolTip={setTip}
					fill
					selected={settingsOpen}
					customAnimations={buttonRotateAnimation}
				/>
			</FlexDiv>
			<div>
				<IconButton
					buttonSize={'l'}
					icon={'linkedin'}
					tooltip={'Linked in profile'}
					onToolTip={setTip}
					iconFill={true}
					onClick={handleLinkedIn}
				/>
			</div>
		</div>
	);
}
