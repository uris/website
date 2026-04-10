import dynamic from 'next/dynamic';

// map of all projects -> dynamic load to only load a specific project
export const projectMap = {
	slice: dynamic(() => import('@/projects/slice/Slice')),
};
