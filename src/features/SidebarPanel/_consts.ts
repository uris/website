import type { TabOption } from '@apple-pie/slice';
import { SidebarSurface } from '@/src/stores/sidebar/_types';

export const sidebarTabs: TabOption[] = [
	{ name: 'Work', value: SidebarSurface.Projects },
	{ name: 'Skills', value: SidebarSurface.Skills },
	{ name: 'Contact', value: SidebarSurface.Contact },
];
