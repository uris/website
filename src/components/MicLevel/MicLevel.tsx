import { Level } from '@apple-pie/slice';
import { useMicActive, useMicMuted, useProcessedMicStream } from '@apple-pie/slice/stores';

export function MicLevel() {
	const active = useMicActive();
	const stream = useProcessedMicStream();
	const muted = useMicMuted();

	if (muted || !active || !stream.current) return null;
	return (
		<div style={{ paddingRight: 6 }}>
			<Level
				audioStream={stream.current}
				playing={true}
				width={75}
				height={2}
				gap={0}
				maxIntensity={5}
				minIntensity={0}
				colorActive="var(--core-text-tertiary)"
				backgroundColor="var(--core-outline-secondary)"
			/>
		</div>
	);
}
