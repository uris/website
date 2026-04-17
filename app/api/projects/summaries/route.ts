import { NextResponse } from 'next/server';
import { getProjectSummaries } from '@/projects/server';
import type { BaseResponse } from '@/src/lib/shared/types';

export async function GET(_request: Request) {
	const summaries = getProjectSummaries();

	if (!summaries) {
		const response: BaseResponse = {
			success: false,
			data: null,
			status: 404,
			message: 'Project summaries not found',
		};
		return NextResponse.json(response, { status: response.status });
	}

	const response: BaseResponse = { success: true, data: summaries, status: 200 };
	return NextResponse.json(response, { status: response.status });
}
