const addMic = `
// grab the mic options and setter from the store
const {(micOptions, setMicrophone)} = useMicrophoneStore();

// bind directly to the dropdown component props
return <Dropdown options={micOptions} onOption={setMicrophone} />

// micOptions is already DropdownOption[] — no mapping needed
// setMicrophone wires directly to the WebRTC audio track and mic hook
`.trim();

const granularExports = `
// bring in only what you need
import { Button } from '@apple-pie/slice/components/Button'
import { useMicrophone } from '@apple-pie/slice/hooks/useMicrophone'
import { useWebRTC } from '@apple-pie/slice/stores/WebRTC'

// or pull everything through the main entry
import { Avatar, Button, ThemeProvider } from '@apple-pie/slice'
`.trim();

export const sample = `
import ...

export function Settings() {
    const micOptions = useMicOptions();
    const selectedMicId = useCurrentMicDeviceId() ?? '';
    const setSelectedMic = useMicrophoneStoreActions().setMicrophone;
    const micSupported = useMicSupported();
    
    return <DropDown<MicOption>
        disabled={!micSupported}
        options={micOptions}
        selectedValue={{ id: selectedMicId }}
        onOption={setSelectedMic}
    />
}
`.trim();

const rollup = `
import ...

const shouldMinify = process.env.MINIFY === 'true';
const keepJsDocComments = (_node, comment) =>
    comment.type === 'comment2' && comment.value.startsWith('*');
const preserveDirectives =
    preserveDirectivesPlugin.default ?? preserveDirectivesPlugin;

const buildInputs = () => {
    const inputs = {
        index: 'src/index.ts',
        hooks: 'src/hooks/index.ts',
        providers: 'src/providers/index.ts',
        stores: 'src/stores/index.ts',
        theme: 'src/theme/index.ts',
        utils: 'src/utils/index.ts',
        'utils/objects': 'src/utils/objects/index.ts',
    };
}
`.trim();

const provider = `
'use client';

import { ThemeProvider } from '@apple-pie/slice/providers/ThemeProvider';
import type { PropsWithChildren } from 'react';

type ProvidersProps = PropsWithChildren<{
    initialTheme: 'lightMode' | 'darkMode';
    initialSystem: boolean;
}>;

export function Providers({ children, initialTheme, initialSystem }: ProvidersProps) {
    return (
        <ThemeProvider initialTheme={initialTheme} initialSystem={initialSystem} global>
            {children}
        </ThemeProvider>
    );
}
`.trim();

export const snippets = {
	addMic,
	granularExports,
	provider,
	rollup,
	sample,
} as const;
