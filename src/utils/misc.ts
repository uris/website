// noise reduction calc based on device name

export function bestGuessNoiseReduction(deviceName: string) {
	if (deviceName.toLowerCase().includes('airpods')) return 'near_field';
	if (deviceName.toLowerCase().includes('earbuds')) return 'near_field';
	if (deviceName.toLowerCase().includes('headset')) return 'near_field';
	if (deviceName.toLowerCase().includes('buds')) return 'near_field';
	return 'far_field';
}

export function textToParagraphs(text: string) {
	return text
		.split(/\n\s*\n/) // blank line = new paragraph
		.map((p) => p.trim())
		.filter(Boolean);
}

// resolve project details info
export function normalizeLanguage(language?: string): 'typescript' | 'javascript' | 'css' | 'html' | 'json' {
	if (language === 'javascript' || language === 'css' || language === 'html' || language === 'json') return language;
	return 'typescript';
}

export function normalizeTarget(target?: string): '_blank' | '_self' | '_parent' | '_top' | undefined {
	if (target === '_blank' || target === '_self' || target === '_parent' || target === '_top') return target;
	return undefined;
}
