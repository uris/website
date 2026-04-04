import { FlexDiv, Preset } from '@apple-pie/slice';
import { AISettings } from '@/features/SettingsPanel/AISettings';
import { MicrophoneSettings } from '@/features/SettingsPanel/MicrophoneSettings';
import { SoundSettings } from '@/features/SettingsPanel/SoundSettings';
import { ThemeSettings } from '@/features/SettingsPanel/ThemeSettings';

export function SettingsPanel() {
	return (
		<FlexDiv preset={Preset.FillScroll} padding={'0 12px 0 16px'}>
			<SoundSettings />
			<MicrophoneSettings />
			<AISettings />
			<ThemeSettings />
		</FlexDiv>
	);
}
