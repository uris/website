import { NextResponse } from 'next/server';
import { getProjectAIData } from '@/projects/server';
import type { BaseResponse } from '@/src/lib/shared/types';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const projectData = getProjectAIData(slug);

	if (!projectData) {
		const response: BaseResponse = {
			success: false,
			data: null,
			status: 404,
			message: 'Project details not found',
		};
		return NextResponse.json(response, { status: response.status });
	}

	const response: BaseResponse = { success: true, data: projectData, status: 200 };
	return NextResponse.json(response, { status: response.status });
}
