import { FlexDiv, IconButton, Label, Preset } from '@apple-pie/slice';

interface ToggleButtonProps {
	label?: string;
	textSize?: 's' | 'm' | 'l';
	buttonSize?: 's' | 'm' | 'l';
	frameSize?: number;
	icon?: string;
	selected?: boolean;
	iconColor?: string;
	iconColorOn?: string;
	bgColor?: string;
	bgColorOn?: string;
	onChange?: (state: boolean) => void;
	onSelect?: () => void;
	gap?: number;
	iconSize?: number;
	tooltip?: string;
	unselect?: boolean;
}

export function ToggleButton(props: Readonly<ToggleButtonProps>) {
	const {
		label,
		textSize,
		icon,
		selected = false,
		iconColor = 'var(--core-text-primary)',
		iconColorOn = 'var(--core-surface-primary)',
		bgColor = 'var(--core-surface-secondary)',
		bgColorOn = 'var(--core-link-primary)',
		iconSize = 20,
		buttonSize = 'm',
		tooltip,
		gap = 4,
		unselect = true,
		onChange,
		onSelect,
	} = props;

	const handleClick = () => {
		if (!unselect && selected) return;
		const newState = !selected;
		onChange?.(newState);
		if (newState) onSelect?.();
	};

	return (
		<FlexDiv preset={Preset.Row} gap={gap}>
			{icon && (
				<IconButton
					icon={icon}
					buttonSize={buttonSize}
					tooltip={tooltip}
					toggle={!selected}
					isToggled={selected}
					bgColorOn={bgColorOn}
					bgColor={bgColor}
					iconColor={iconColor}
					iconColorOn={iconColorOn}
					onClick={handleClick}
					iconSize={iconSize}
				/>
			)}
			{label && (
				<Label textSize={textSize} borderSize={0} padding={0} onClick={handleClick}>
					{label}
				</Label>
			)}
		</FlexDiv>
	);
}
