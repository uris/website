import { SidebarSurface } from '@/stores/sidebar/_types';
import { EAction } from '@/utils/consts/consts';

export const introMessageMd = `# 👋 Hi. Uris here.

I'm a $$Frontend dev.$$Product designer$$Maker$$Craftsman$$Coder$$Leader$$Follower$$Diver$$Motard$$ that loves making simple, intuitive products people use to$$Connect$$Be productive$$Have fun$$GSD$$Live life$$Be better$$Learn$$Be healthy$$.

What's fun? Bringing ideas to life, crafting the details that make them human, continuously improving and learning my craft. 

Feel free to [browse](/action?actionType=${EAction.Sidebar}&actionValue=true&actionFocus=${SidebarSurface.Projects}) some of my work, or [talk to Vi](/action?actionType=${EAction.TalkToVi}&actionValue=vi) (my home grown ai assistant) about it. She can help you navigate my portfolio or [get in touch](/action?actionType=${EAction.Sidebar}&actionValue=true&actionFocus=${SidebarSurface.Contact}).

Let's make something great together?`;
