export function bestGuessNoiseReduction(deviceName: string) {
	if (deviceName.toLowerCase().includes('airpods')) return 'near_field';
	if (deviceName.toLowerCase().includes('earbuds')) return 'near_field';
	if (deviceName.toLowerCase().includes('headset')) return 'near_field';
	if (deviceName.toLowerCase().includes('buds')) return 'near_field';
	return 'far_field';
}
