import { DropDown, type MicOption } from '@apple-pie/slice';
import {
	useCurrentMicDeviceId,
	useMicOptions,
	useMicrophoneStoreActions,
	useMicSupported,
} from '@apple-pie/slice/stores';

export function Settings() {
	const micOptions = useMicOptions();
	const selectedMicId = useCurrentMicDeviceId() ?? '';
	const setSelectedMic = useMicrophoneStoreActions().setMicrophone;
	const micSupported = useMicSupported();

	return (
		<DropDown<MicOption>
			disabled={!micSupported}
			options={micOptions}
			selectedValue={{ id: selectedMicId }}
			onOption={setSelectedMic}
		/>
	);
}
