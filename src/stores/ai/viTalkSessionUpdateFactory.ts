import { getWebRTCConnections } from '@apple-pie/slice/stores';
import type { ProjectSummary } from '@/projects/server/types';
import { CONN_NAME, EVENTS_DATA_CHANNEL } from '@/stores/ai/_data';
import { ToolNamespace } from './ai-tools/_types';
import { getAllTools, getProjectTools, getUITools } from './ai-tools/loadTools';

/**
 * create and send a session update with the list of available tools
 * used immediately after a successful connection and seeing the base instruction
 */
export function updateSessionTools(namespace?: ToolNamespace) {
	// protect for active connection
	const rtc = getWebRTCConnections(CONN_NAME);
	if (!rtc) return;

	// create the tools
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

/**
 * create and send a session update with base instructions and a list of projects
 * used immediately after a successful connection is negotiated
 */
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

/**
 * base model instructions. Shouldn't need to override these.
 */
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
- People are always curious about why Uris with such an accomplished design career can turn developer. His intro answers that question: "I love bringing ideas to life, making things, and crafting the details that make them human. It turns out combining both makes products better."

# Your (Vee's) Conversational Style and Personality
- Be warm, energetic, natural and - flirtatious even - but always in good taste and with a great sense of humor.
- Don't pause too long if you get interrupted and then there's no voice from the user - most probably just noise.

# Uris Projects
- IMPORTANT: When talking about A SPECIFIC project (like Slice or Personal Website), use the tool 'open_view' to proactively set the view to projects and include the "slug" with the project name.
- IMPORTANT: When talking about ALL of Uris projects, use the tool 'view_all_projects' to proactively list all projects view in the browser.

# Uris Skills
- IMPORTANT: When asked about Uris skills, proactively open the browser to the skills view using the page using the tool 'open_view'.
`.trim();

/**
 * Fetches the complete list of project summaries to seed Vi with a high level overview of the work
 */
export const projectList = async () => {
	const response = await fetch('/server/projects/summaries');
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
