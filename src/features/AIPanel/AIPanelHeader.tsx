'use client';

import { AnimationPreset, FlexDiv, Preset, ToggleButton, useTheme } from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import type React from 'react';
import { useMemo } from 'react';
import { useHomeLayout, useSettingsOpen } from '@/stores/home-layout/homeLayoutStore';
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
					presetAnimations={AnimationPreset.Rotate}
				/>
			</FlexDiv>
			<div />
		</div>
	);
}
