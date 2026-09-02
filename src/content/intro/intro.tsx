import { SidebarSurface } from '@/stores/sidebar/_types';
import { EAction } from '@/utils/consts/consts';

export const introMessageMd = `# 👋 Hi. Uris here.

I'm a $$Frontend dev.$$Product designer$$Maker$$Craftsman$$Coder$$Leader$$Follower$$Diver$$Motard$$ that loves making simple, intuitive products people use to$$Connect$$Be productive$$Have fun$$GSD$$Live life$$Be better$$Learn$$Be healthy$$.

Folks always ask: "How is a designer with your background also a developer?"

Simple: I love bringing ideas to life, turning them into something real, and crafting the details that make them human. It turns out combining both makes me a better designer, and a better developer.

Feel free to [browse](/action?actionType=${EAction.Sidebar}&actionValue=true&actionFocus=${SidebarSurface.Projects}) some of my work, or [talk to Vi](/action?actionType=${EAction.TalkToVi}&actionValue=vi) (my digital assistant) - she can go into more details and help you get to what you're looking for.

Want to make something great together?`;
