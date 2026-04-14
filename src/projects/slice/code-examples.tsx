export const addMic = `
// grab the mic options and setter from the store
const {(micOptions, setMicrophone)} = useMicrophoneStore();

// bind directly to the dropdown component props
return <Dropdown options={micOptions} onOptionChange={setMicrophone} />

/* 
micOptions is already DropdownOption[] — no mapping needed - and setMicrophone wires directly to the WebRTC audio track and mic hook
 */
`.trim();

export const granularExports = `
// bring in only what you need
import { Button } from '@apple-pie/slice/components/Button'
import { useMicrophone } from '@apple-pie/slice/hooks/useMicrophone'
import { useWebRTC } from '@apple-pie/slice/stores/WebRTC'

// or pull everything through the main entry
import { Avatar, Button, ThemeProvider } from '@apple-pie/slice'
`.trim();
