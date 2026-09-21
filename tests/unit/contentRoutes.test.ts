import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET as project } from '@/app/server/projects/[slug]/route';
import { GET as summaries } from '@/app/server/projects/summaries/route';
import { GET as skills } from '@/app/server/skills/route';

const loaders = vi.hoisted(() => ({ project: vi.fn(), summaries: vi.fn(), skills: vi.fn() }));
vi.mock('@/projects/server', () => ({ getProjectAIData: loaders.project, getProjectSummaries: loaders.summaries }));
vi.mock('@/skills/server', () => ({ getSkillsAIData: loaders.skills }));
const request = new Request('http://localhost/server');
const projectRequest = (slug: string) => project(request, { params: Promise.resolve({ slug }) });
beforeEach(() => {
	for (const loader of Object.values(loaders)) loader.mockReset();
});

describe('content route contracts', () => {
	it('forwards the resolved project slug and returns the loader payload', async () => {
		const data = { slug: 'slice', title: 'Slice', summary: 'UI components', techStack: ['React'] };
		loaders.project.mockReturnValue(data);
		const response = await projectRequest('slice');
		expect(loaders.project).toHaveBeenCalledExactlyOnceWith('slice');
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ success: true, data, status: 200 });
	});
	it('returns 404 for an unknown slug', async () => {
		loaders.project.mockReturnValue(null);
		const response = await projectRequest('unknown-project');
		expect(loaders.project).toHaveBeenCalledWith('unknown-project');
		expect(response.status).toBe(404);
		expect(await response.json()).toEqual({
			success: false,
			data: null,
			status: 404,
			message: 'Project details not found',
		});
	});
	it.each([
		['summaries', summaries, loaders.summaries, [{ slug: 'slice', title: 'Slice', summary: 'UI components' }]],
		['skills', skills, loaders.skills, { slug: 'skills', title: 'Skills', sections: [] }],
	] as const)('returns %s payloads', async (_name, handler, loader, data) => {
		loader.mockReturnValue(data);
		const response = await handler(request);
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ success: true, data, status: 200 });
		expect(loader).toHaveBeenCalledExactlyOnceWith();
	});
	it('treats an empty summaries collection as a successful result', async () => {
		loaders.summaries.mockReturnValue([]);
		expect(await (await summaries(request)).json()).toEqual({ success: true, data: [], status: 200 });
	});
	it.each([
		[summaries, loaders.summaries, 'Project summaries not found'],
		[skills, loaders.skills, 'Skills data not found'],
	] as const)('returns a controlled missing-data response', async (handler, loader, message) => {
		loader.mockReturnValue(null);
		const response = await handler(request);
		expect(response.status).toBe(404);
		expect(await response.json()).toEqual({ success: false, data: null, status: 404, message });
	});
	it.each([
		[() => projectRequest('slice'), loaders.project],
		[() => summaries(request), loaders.summaries],
		[() => skills(request), loaders.skills],
	] as const)('converts loader exceptions to a public JSON error', async (call, loader) => {
		loader.mockImplementation(() => {
			throw new Error('private filesystem path');
		});
		const response = await call();
		expect(response.status).toBe(500);
		expect(await response.json()).toEqual({ success: false, data: null, status: 500, message: 'Unable to load data' });
	});
	it('handles failure to resolve route parameters', async () => {
		const response = await project(request, { params: Promise.reject(new Error('failed params')) });
		expect(response.status).toBe(500);
		expect(await response.json()).toMatchObject({ success: false, status: 500 });
		expect(loaders.project).not.toHaveBeenCalled();
	});
});
