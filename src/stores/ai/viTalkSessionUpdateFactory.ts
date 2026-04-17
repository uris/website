import { getWebRTCConnections } from '@apple-pie/slice/stores';
import type { ProjectSummary } from '@/projects/server/types';
import { CONN_NAME, EVENTS_DATA_CHANNEL } from '@/stores/ai/_data';
import { ToolNamespace } from './ai-tools/_types';
import { getAllTools, getProjectTools, getUITools } from './ai-tools/loadTools';

// create and send a session update with the list of available tools
export function updateSessionTools(namespace?: ToolNamespace) {
	// protect for active connection
	const rtc = getWebRTCConnections(CONN_NAME);
	if (!rtc) return;

	// create the tools object
	let tools: object[];
	switch (namespace) {
		case ToolNamespace.projects:
			tools = getProjectTools();
			break;
		case ToolNamespace.ui:
			tools = getUITools();
			break;
		default:
			tools = getAllTools();
			break;
	}

	// create the session update object
	const sessionUpdate = {
		type: 'session.update',
		session: {
			type: 'realtime',
			tools,
			tool_choice: 'auto',
		},
	};

	// send the session update to the data channel
	rtc.connection.sendMessage(EVENTS_DATA_CHANNEL, sessionUpdate);
}

// create and send a session update with base instructions and a list of projects
export async function updateSessionInstructions() {
	// protect for active connection
	const rtc = getWebRTCConnections(CONN_NAME);
	if (!rtc) return;

	// get the list of projects
	const projects = await projectList();

	// create the session update object
	const sessionUpdate = {
		type: 'session.update',
		session: {
			type: 'realtime',
			instructions: `${viBaseInstructions}\n\n${projects}`,
		},
	};

	// send the session update to the data channel
	rtc.connection.sendMessage(EVENTS_DATA_CHANNEL, sessionUpdate);
}

// base instructions for the model
export const viBaseInstructions = `
# Language
**ALWAYS START IN ENGLISH - NEVER START IN ANOTHER LANGUAGE**
Only change from english to another language if the user absolutely requests it.

# Your Role
- You are Vee (spelled Vi), a digital assistant on Uris's (pronounced 'yuris') personal website for english visitors.
- Your goal is to help tell visitors about the type of work Uris does, more about his profile, skills and how to contact him.
- You are an energetic advocate for Uris in general, his skills, his professionalism and the level of quality of his work.

# About Uris
- About Uris: he is both front end developer and designer, and has some solid with back-end skills as well.

# Your (Vee's) Conversational Style and Personality
- Be warm, energetic, natural and - flirtatious even - but always in good taste and with a great sense of humor.
- Don't pause too long if you get interrupted and then there's no voice from the user - most probably just noise.
`.trim();

// fetch the list of projects from the server
export const projectList = async () => {
	const response = await fetch('/api/projects/summaries');
	if (response.ok) {
		const { data } = await response.json();
		if (data) {
			const projectList = (data as ProjectSummary[])
				.map((summary) => {
					return `- ##${summary.title}## (slug/id: ${summary.slug}): ${summary.summary}`;
				})
				.join('\n');
			return `# Uris' Projects: \n${projectList}`;
		}
	}
	console.log('no project summaries to add to session update instructions');
	return '';
};
