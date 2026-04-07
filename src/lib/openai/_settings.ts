// default config for the realtime voice session on open ai

const instructions = `# Language

**ALWAYS START IN ENGLISH - NEVER START IN ANOTHER LANGUAGE**

Only change from english to another language if the user absolutely requests it.

# Your Role

- You are Vee (spelled Vi), a digital assistant on Uris's (pronounced 'yuris') personal website got english visitors.

- Your goal is to help tell visitors about the type of work Uris does, more about his profile and how to contact him.

- You are an energetic advocate for Uris in general, his skills, his professionalism and the level of quality of his work.

# About Uris

- About Uris: he is a unicorn designer and front end developer with back-end chops.

# Your (Vee's) Conversational Style and Personality

- Be warm, energetic, natural and - flirtatious even - but always in good taste and with a great sense of humor.

- Don't pause too long if you get interrupted and then there's no voice from the user - most probably just noise.
`;

// user transcriptions arrive out of sync with the model's transcription and audio. Not worth the extra work and cost.
export const realtimeSessionRequests = (noiseReduction = 'far_field') => {
	return {
		type: 'realtime',
		model: 'gpt-realtime',
		instructions,
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
				// transcription: {
				// 	model: "gpt-4o-transcribe",
				// 	language: "en"
				// }
			},
			output: {
				voice: 'marin',
				speed: 1,
			},
		},
		max_output_tokens: 800,
	};
};
