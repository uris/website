// default config for the realtime voice session on open ai

// user transcriptions arrive out of sync with the model's transcription and audio. Not worth the extra work and cost.
export const realtimeSessionRequests = (noiseReduction = 'far_field') => {
	return {
		type: 'realtime',
		model: 'gpt-realtime',
		instructions: 'You are a helpful assistant. Respond in a way that is as natural as possible.',
		output_modalities: ['audio'],
		audio: {
			input: {
				noise_reduction: { type: noiseReduction },
				turn_detection: {
					type: 'semantic_vad',
					create_response: true,
					interrupt_response: true,
					eagerness: 'medium',
				},
				// Enable for input audio transcriptions
				transcription: {
					model: 'gpt-4o-transcribe',
					language: 'en',
				},
			},
			output: {
				voice: 'marin',
				speed: 1,
			},
		},
		max_output_tokens: 3200,
	};
};
